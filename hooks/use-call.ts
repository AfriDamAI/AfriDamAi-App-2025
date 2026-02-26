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
  onIncomingCall?: (from: string, type: 'voice' | 'video', offer: any, chatId: string) => void;
  onCallAccepted?: (answer: any) => void;
  onCallEnded?: () => void;
  onRemoteStream?: (stream: MediaStream) => void;
}

export const useCall = ({ 
  socket, 
  currentUserId, 
  onIncomingCall, 
  onCallAccepted, 
  onCallEnded,
  onRemoteStream
}: UseCallProps) => {
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const configuration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  const cleanup = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    setIsCalling(false);
    setCallType(null);
    setRemoteUserId(null);
    setCurrentChatId(null);
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
      if (onRemoteStream) {
        onRemoteStream(event.streams[0]);
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [socket, onRemoteStream]);

  const startCall = async (targetId: string, chatId: string, type: 'voice' | 'video') => {
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
        socket.emit('call-answer', {
          to: targetId,
          answer: answer,
          chatId: chatId
        });
      }

      setIsCalling(true);
      setCallType(type);
      setRemoteUserId(targetId);
      setCurrentChatId(chatId);
      
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
    cleanup();
  };

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data: any) => {
      if (onIncomingCall) {
        onIncomingCall(data.from, data.type, data.offer, data.chatId);
      }
    };

    const handleCallAccepted = async (data: any) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        if (onCallAccepted) onCallAccepted(data.answer);
      }
    };

    const handleIceCandidate = async (data: any) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      }
    };

    const handleCallEnded = () => {
      cleanup();
      if (onCallEnded) onCallEnded();
    };

    socket.on('call-offer', handleIncomingCall);
    socket.on('call-answer', handleCallAccepted);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call-end', handleCallEnded);

    return () => {
      socket.off('call-offer', handleIncomingCall);
      socket.off('call-answer', handleCallAccepted);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('call-end', handleCallEnded);
    };
  }, [socket, onIncomingCall, onCallAccepted, onCallEnded, cleanup]);

  return {
    isCalling,
    callType,
    remoteUserId,
    currentChatId,
    localStream: localStreamRef.current,
    startCall,
    acceptCall,
    endCall,
    cleanup
  };
};