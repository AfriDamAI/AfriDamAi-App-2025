"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";

/**
 * 🛡️ AFRIDAM NEURAL CALL HOOK
 * Focus: Native WebRTC Handshake with Signaling via Socket.io.
 */

interface UseCallProps {
  socket: Socket | null;
  currentUserId: string;
  onIncomingCall?: (from: string, type: 'voice' | 'video', offer: any, chatId: string, signalId?: string) => void;
  onCallAccepted?: (answer: any) => void;
  onCallEnded?: () => void;
  onMissedCall?: (from: string, type: 'voice' | 'video', chatId: string) => void;
  onRemoteStream?: (stream: MediaStream) => void;
}

export const useCall = ({ 
  socket, 
  currentUserId, 
  onIncomingCall, 
  onCallAccepted, 
  onCallEnded,
  onMissedCall,
  onRemoteStream
}: UseCallProps) => {
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const configuration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      // 🌐 Production TURN Relay (Required for symmetric NAT/Vercel connectivity)
      { 
        urls: 'turn:openrelay.metered.ca:80', 
        username: 'openrelayproject', 
        credential: 'openrelayproject' 
      },
      { 
        urls: 'turn:openrelay.metered.ca:443', 
        username: 'openrelayproject', 
        credential: 'openrelayproject' 
      },
      { 
        urls: 'turn:openrelay.metered.ca:443?transport=tcp', 
        username: 'openrelayproject', 
        credential: 'openrelayproject' 
      }
    ],
    iceCandidatePoolSize: 10,
  };

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    setCallDuration(0);
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const cleanup = useCallback(() => {
    stopTimer();
    setCallDuration(0);
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    pendingCandidatesRef.current = [];
    setIsCalling(false);
    setCallType(null);
    setRemoteUserId(null);
    setCurrentChatId(null);
  }, [stopTimer]);

  const processPendingCandidates = useCallback(async () => {
    if (!peerConnectionRef.current || !peerConnectionRef.current.remoteDescription) return;
    
    console.log(`📦 CALL ENGINE: Processing ${pendingCandidatesRef.current.length} pending ICE candidates`);
    while (pendingCandidatesRef.current.length > 0) {
      const candidate = pendingCandidatesRef.current.shift();
      if (candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding queued ice candidate", e);
        }
      }
    }
  }, []);

  const createPeerConnection = useCallback((targetId: string, chatId: string) => {
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          to: targetId,
          candidate: event.candidate,
          chatId: chatId
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("🎵 CALL ENGINE: Remote track received");
      // Start timer when we actually get media from the other end
      startTimer();
      if (onRemoteStream) {
        if (event.streams && event.streams[0]) { onRemoteStream(event.streams[0]); } else { const stream = new MediaStream(); stream.addTrack(event.track); onRemoteStream(stream); }
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`🌐 CALL ENGINE: Connection state: ${pc.connectionState}`);
      if (pc.connectionState === 'connected') {
        startTimer();
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        stopTimer();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [socket, onRemoteStream, startTimer, stopTimer]);

  const startCall = async (targetId: string, chatId: string, type: 'voice' | 'video') => {
    console.log(`📡 CALL ENGINE: Initiating ${type} call to ${targetId}...`);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video'
      });
      
      localStreamRef.current = stream;
      const pc = createPeerConnection(targetId, chatId);
      
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (socket) {
        socket.emit('call-offer', {
          to: targetId,
          from: currentUserId,
          offer: offer,
          chatId: chatId,
          type: type
        });
        console.log(`✅ CALL ENGINE: Offer sent to ${targetId}`);
      }

      setIsCalling(true);
      setCallType(type);
      setRemoteUserId(targetId);
      setCurrentChatId(chatId);
      
      return stream;
    } catch (err) {
      console.error("Failed to start call:", err);
      cleanup();
      throw err;
    }
  };

  const acceptCall = async (targetId: string, chatId: string, type: 'voice' | 'video', offer: any) => {
    console.log(`📞 CALL ENGINE: Accepting incoming ${type} call from ${targetId}...`);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video'
      });
      
      localStreamRef.current = stream;
      const pc = createPeerConnection(targetId, chatId);
      
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (socket) {
        socket.emit('call-answer', { type: type,
          to: targetId,
          answer: answer,
          chatId: chatId
        });
        console.log(`✅ CALL ENGINE: Answer sent to ${targetId}`);
      }

      setIsCalling(true);
      setCallType(type);
      setRemoteUserId(targetId);
      setCurrentChatId(chatId);
      
      // Process any candidates that arrived while waiting for user to accept
      await processPendingCandidates();
      
      return stream;
    } catch (err) {
      console.error("Failed to accept call:", err);
      cleanup();
      throw err;
    }
  };

  const endCall = (targetId: string, chatId: string) => {
    if (socket) {
      socket.emit('call-end', {
        to: targetId,
        chatId: chatId
      });
    }
    console.log("🛑 CALL ENGINE: Call ended locally.");
    cleanup();
  };

  const handleIncomingAnswer = useCallback(async (data: any) => {
    console.log(`🤝 CALL ENGINE: Answer received (Durable/Socket)`);
    if (peerConnectionRef.current) {
      if (peerConnectionRef.current.signalingState === 'stable') return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      startTimer();
      await processPendingCandidates();
      if (onCallAccepted) onCallAccepted(data.answer);
    }
  }, [onCallAccepted, startTimer, processPendingCandidates]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data: any) => {
      console.log(`🚨 CALL ENGINE: Incoming call from ${data.from} (${data.type})`);
      if (onIncomingCall) {
        onIncomingCall(data.from, data.type, data.offer, data.chatId, data.signalId);
      }
    };

    const handleCallAccepted = async (data: any) => {
      await handleIncomingAnswer(data);
    };

    const handleIceCandidate = async (data: any) => {
      if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      } else {
        console.log("⏳ CALL ENGINE: Queuing ICE candidate (PC or RemoteDesc not ready)");
        pendingCandidatesRef.current.push(data.candidate);
      }
    };

    const handleCallEnded = (data?: any) => {
      console.log("📴 CALL ENGINE: Remote user ended call or connection lost.");
      // If we were in an incoming call state (incomingCallData in provider) but not yet calling
      // Or if isCalling is false but we were notified of an incoming call
      if (onMissedCall && data?.wasMissed) {
        console.log(`📩 CALL ENGINE: Missed call logged from ${data.from}`);
        onMissedCall(data.from, data.type, data.chatId);
      }
      cleanup();
      if (onCallEnded) onCallEnded();
    };

    socket.on('call-offer', handleIncomingCall);
    socket.on('call-answer', handleCallAccepted);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call-end', handleCallEnded);
    socket.on('call-missed', (data: any) => {
      console.log(`📩 CALL ENGINE: Incoming Missed Call Notification from ${data.from}`);
      if (onMissedCall) onMissedCall(data.from, data.type, data.chatId);
    });

    return () => {
      socket.off('call-offer', handleIncomingCall);
      socket.off('call-answer', handleCallAccepted);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('call-end', handleCallEnded);
      socket.off('call-missed');
      stopTimer();
    };
  }, [socket, onIncomingCall, onCallAccepted, onCallEnded, onMissedCall, cleanup, startTimer, stopTimer, remoteUserId, processPendingCandidates]);

  return {
    isCalling,
    callType,
    remoteUserId,
    currentChatId,
    callDuration: formatDuration(callDuration),
    localStream: localStreamRef.current,
    startCall,
    acceptCall,
    endCall,
    handleIncomingAnswer,
    cleanup
  };
};
