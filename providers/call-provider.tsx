"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSocket } from "@/hooks/use-socket";
import { useAuth } from "@/providers/auth-provider";
import { useCall } from "@/hooks/use-call";
import { IncomingCall } from "@/components/specialist/live/incoming-call";
import { CallControls } from "@/components/specialist/live/call-controls";
import { AnimatePresence, motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { PhoneOff } from "lucide-react";
import { toast } from "sonner";

interface CallContextType {
    isCalling: boolean;
    callType: 'voice' | 'video' | null;
    remoteUserId: string | null;
    currentChatId: string | null;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    callDuration: string;
    startCall: (targetId: string, chatId: string, type: 'voice' | 'video') => Promise<MediaStream>;
    acceptCall: () => Promise<MediaStream>;
    rejectCall: () => void;
    endCall: () => void;
    receiveExternalSignal: (data: any) => void;
    handleIncomingAnswer: (data: any) => Promise<void>;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCallContext = () => {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error("useCallContext must be used within a CallProvider");
    }
    return context;
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);

    const getSocketUrl = () => {
        if (process.env.NEXT_PUBLIC_SOCKET_URL) return process.env.NEXT_PUBLIC_SOCKET_URL;
        const baseURL = apiClient.defaults.baseURL;
        if (baseURL && typeof baseURL === 'string') {
            if (baseURL.endsWith("/api")) return baseURL.slice(0, -4);
            return baseURL;
        }
        return "https://afridam-backend-prod-107032494605.us-central1.run.app";
    };

    const { socket } = useSocket(getSocketUrl());
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const [incomingCallData, setIncomingCallData] = useState<{
        from: string;
        type: 'voice' | 'video';
        offer: any;
        chatId: string;
    } | null>(null);
    const [missedCalls, setMissedCalls] = useState<Array<{ from: string, type: 'voice' | 'video', time: string }>>([]);
    const ringtoneRef = useRef<HTMLAudioElement | null>(null);

    const {
        isCalling,
        callType,
        remoteUserId,
        currentChatId,
        callDuration,
        localStream,
        startCall: baseStartCall,
        acceptCall: baseAcceptCall,
        endCall: baseEndCall,
        handleIncomingAnswer: baseHandleIncomingAnswer,
        cleanup
    } = useCall({
        socket,
        currentUserId: user?.id || "",
        onIncomingCall: (from, type, offer, chatId, signalId) => {
            setIncomingCallData({ from, type, offer, chatId });
            if (signalId && typeof window !== 'undefined') {
                localStorage.setItem(`processed_signal_${signalId}`, 'true');
            }
            // 🎙️ Ringtone logic
            try {
                if (!ringtoneRef.current) {
                    ringtoneRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");
                    ringtoneRef.current.loop = true;
                }
                ringtoneRef.current.play().catch(e => console.log("Audio play blocked", e));
            } catch (e) {
                console.error("Failed to play ringtone", e);
            }
        },
        onCallAccepted: (answer) => {
            console.log("Call accepted by remote user");
            if (ringtoneRef.current) {
                ringtoneRef.current.pause();
                ringtoneRef.current.currentTime = 0;
            }
        },
        onCallEnded: () => {
            setRemoteStream(null);
            setIncomingCallData(null);
            setIsMuted(false);
            setIsVideoOff(false);
            if (ringtoneRef.current) {
                ringtoneRef.current.pause();
                ringtoneRef.current.currentTime = 0;
            }
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
            if (localVideoRef.current) localVideoRef.current.srcObject = null;
            if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
        },
        onMissedCall: (from, type, chatId) => {
            setMissedCalls(prev => [{ from, type, time: new Date().toISOString() }, ...prev]);
            setIncomingCallData(null);
            if (ringtoneRef.current) {
                ringtoneRef.current.pause();
                ringtoneRef.current.currentTime = 0;
            }
            // 🚨 Trigger a notification (browser toast or custom)
            alert(`Missed ${type} call from ${from}`);
        },
        onRemoteStream: (stream) => {
            console.log("🎵 CALL PROVIDER: Remote stream received");
            setRemoteStream(stream);
        },
        onPeerReconnect: (userId) => {
            toast.success("Connection restored with peer", {
                description: "Signaling connection has been recovered.",
                duration: 3000
            });
        }
    });

    const handleJoinMeet = async (specialistId: string) => {
        try {
            // Fetch the user's appointments and find the active one with this specialist
            const { getMyAppointments, joinAppointmentSession } = await import('@/lib/api-client');
            const appointments = await getMyAppointments();
            const activeAppointment = appointments.find((apt: any) =>
                apt.specialistId === specialistId &&
                (apt.status === 'IN_PROGRESS' || apt.status === 'CONFIRMED')
            );

            if (!activeAppointment) {
                toast.error('No active session found. Please wait for your specialist to start the session.');
                return;
            }

            const result = await joinAppointmentSession(activeAppointment.id);
            if (result?.meetLink) {
                window.open(result.meetLink, '_blank', 'noopener,noreferrer');
            } else {
                toast.error('Google Meet link not available yet. Please wait for specialist to start the session.');
            }
        } catch (err) {
            toast.error('Failed to fetch Google Meet link.');
        }
    };

    useEffect(() => {
        if (remoteStream) {
            if (callType === 'video' && remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            } else if (callType === 'voice' && remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = remoteStream;
            }
        }
    }, [remoteStream, callType, isCalling]);

    useEffect(() => {
        if (localStream && localVideoRef.current && callType === 'video') {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, callType, isCalling]);

    const toggleMic = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = isMuted;
                setIsMuted(!isMuted);
                console.log(`🎤 Mic ${isMuted ? 'Enabled' : 'Disabled'}`);
            }
        }
    };

    const toggleVideo = () => {
        if (localStream && callType === 'video') {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = isVideoOff;
                setIsVideoOff(!isVideoOff);
                console.log(`📷 Video ${isVideoOff ? 'Enabled' : 'Disabled'}`);
            }
        }
    };

    const startCall = async (targetId: string, chatId: string, type: 'voice' | 'video') => {
        // For Google Meet, we still emit 'call-offer' but we don't start local WebRTC
        if (socket) {
            socket.emit('call-offer', {
                to: targetId,
                from: user?.id,
                offer: { type: 'google-meet' }, // Signaling we are using Meet
                chatId: chatId,
                type: type
            });
        }
        
        // Open the meet link for the initiator — look up appointment by specialist's userId
        await handleJoinMeet(targetId);
        
        setIsMuted(false);
        setIsVideoOff(false);
        // We set these to trigger the UI
        // @ts-ignore - internal state of useCall isn't exported as setter, so we rely on context
        return new MediaStream(); // Dummy stream to satisfy type
    };

    const acceptCall = async () => {
        if (!incomingCallData) throw new Error("No incoming call to accept");
        
        // 1. Signal backend that call is accepted (clears timeout)
        if (socket) {
            socket.emit('call-answer', {
                to: incomingCallData.from,
                answer: { type: 'google-meet' },
                chatId: incomingCallData.chatId
            });
        }

        // 2. Open Google Meet link — look up appointment by specialist's userId
        await handleJoinMeet(incomingCallData.from);

        setIncomingCallData(null);
        if (ringtoneRef.current) {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0;
        }
        return new MediaStream(); // Dummy
    };

    const rejectCall = () => {
        if (incomingCallData && socket) {
            socket.emit('call-end', {
                to: incomingCallData.from,
                chatId: incomingCallData.chatId
            });
        }
        setIncomingCallData(null);
    };

    const endCall = () => {
        if (remoteUserId && currentChatId) {
            baseEndCall(remoteUserId, currentChatId);
        }
        setRemoteStream(null);
        cleanup();
    };

    const receiveExternalSignal = (data: any) => {
        // 🛡️ DUAL-SIGNALING HANDSHAKE (Rule 6 Multi-Instance Fix)
        if (data.signalType === 'offer') {
            if (isCalling || (incomingCallData && incomingCallData.chatId === data.chatId)) return;
            setIncomingCallData({ from: data.from, type: data.type, offer: data.offer, chatId: data.chatId });
        } else if (data.signalType === 'answer') {
            // Caller picks up an answer via durable polling
            baseHandleIncomingAnswer(data);
        }
    };

    return (
        <CallContext.Provider value={{
            isCalling,
            callType,
            remoteUserId,
            currentChatId,
            localStream,
            remoteStream,
            callDuration,
            startCall,
            acceptCall,
            rejectCall,
            endCall,
            receiveExternalSignal,
            handleIncomingAnswer: baseHandleIncomingAnswer
        }}>
            {children}

            {/* Hidden audio element for voice calls */}
            <audio ref={remoteAudioRef} autoPlay />

            <AnimatePresence>
                {incomingCallData && (
                    <IncomingCall
                        fromName={incomingCallData.from}
                        callType={incomingCallData.type}
                        onAccept={acceptCall}
                        onReject={rejectCall}
                    />
                )}

                {isCalling && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed inset-0 z-[150] bg-black/95 flex flex-col items-center justify-center p-6"
                    >
                        {callType === 'video' ? (
                            <div className="relative w-full h-full max-w-4xl max-h-[80vh] rounded-3xl overflow-hidden bg-gray-900 shadow-2xl">
                                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                <div className="absolute top-6 left-6 flex flex-col gap-2 z-30">
                                    <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                                        <p className="text-white text-xs font-mono">{callDuration}</p>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 w-32 h-48 rounded-2xl border-2 border-white/20 overflow-hidden bg-black shadow-2xl z-20">
                                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
                                </div>
                                {!remoteStream && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/20 backdrop-blur-sm">
                                        <div className="w-20 h-20 rounded-full bg-[#4DB6AC] animate-pulse flex items-center justify-center text-white text-2xl font-bold">
                                            {remoteUserId?.[0].toUpperCase()}
                                        </div>
                                        <p className="text-white text-sm font-bold uppercase tracking-widest animate-pulse">Connecting Video...</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-8">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-white mb-2">Consultation Active</h2>
                                    <div className="flex flex-col items-center gap-6">
                                        <p className="text-[#4DB6AC] uppercase tracking-[0.4em] text-[12px] font-black italic">Meeting is live in Google Meet</p>
                                        
                                        <button 
                                            onClick={() => remoteUserId && handleJoinMeet(remoteUserId)}
                                            className="px-8 py-4 bg-[#4DB6AC] hover:bg-[#3d9189] text-white rounded-2xl font-bold shadow-xl transition-all transform hover:scale-105 flex items-center gap-3"
                                        >
                                            <PhoneOff className="rotate-[135deg] w-5 h-5" />
                                            Re-join Google Meet
                                        </button>
                                        
                                        <p className="text-white/40 font-mono text-sm">Session Duration: {callDuration}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-12">
                            <CallControls
                                isMuted={isMuted}
                                isVideoOff={isVideoOff}
                                onToggleMic={toggleMic}
                                onToggleVideo={toggleVideo}
                                onHangUp={endCall}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </CallContext.Provider>
    );
};
