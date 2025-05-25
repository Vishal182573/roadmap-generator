"use client"
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';
import { useSession } from '@/lib/auth/AuthContext';
import AgoraRTC from 'agora-rtc-sdk-ng';

// Set Agora log level (0 is most verbose, 4 is least)
AgoraRTC.setLogLevel(0); // Set to 0 for debugging

interface MeetData {
  meetId: string;
  mentorId: string | { _id: string, name: string, email: string };
  studentId: string | { _id: string, name: string, email: string };
  scheduledTime: string;
  topic: string;
  status: string;
  currentUserId?: string;
}

export default function MeetPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: session } = useSession();
  const [meetData, setMeetData] = useState<MeetData | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Not connected");
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  
  // Create client ref to persist between renders
  const clientRef = useRef<any>(null);
  const localTracksRef = useRef<{
    audioTrack: any | null;
    videoTrack: any | null;
  }>({
    audioTrack: null,
    videoTrack: null,
  });

  // Use channel name that doesn't have special characters
  const getChannelName = () => {
    // Use the exact meetId as the channel name for Agora
    return id || `channel${Math.floor(Math.random() * 100000)}`;
  };

  useEffect(() => {
    const fetchMeetData = async () => {
      try {
        if (!id) {
          throw new Error('Meeting ID is required');
        }

        const response = await fetch(`/api/meet/${id}`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch meet data');
        }
        
        console.log("Meet data:", data.data);
        setMeetData(data.data);
        
        // Get user ID from session
        const userId = session?.user?.id;
        if (!userId) {
          throw new Error('User session not found');
        }
        
        // Compare with mentor and student IDs
        const mentorId = typeof data.data.mentorId === 'object' ? data.data.mentorId._id : data.data.mentorId;
        const studentId = typeof data.data.studentId === 'object' ? data.data.studentId._id : data.data.studentId;
        
        console.log("User ID:", userId);
        console.log("Mentor ID:", mentorId);
        console.log("Student ID:", studentId);
        
        if (userId !== mentorId && userId !== studentId) {
          throw new Error('Unauthorized access to this meeting');
        }
      } catch (err) {
        console.error("Error fetching meet data:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchMeetData();
    }
    
    // Cleanup on component unmount
    return () => {
      // Clean up local tracks
      if (localTracksRef.current.audioTrack) {
        localTracksRef.current.audioTrack.close();
      }
      if (localTracksRef.current.videoTrack) {
        localTracksRef.current.videoTrack.close();
      }
      
      // Leave the channel if client exists
      if (clientRef.current) {
        clientRef.current.leave().catch(console.error);
      }
    };
  }, [id, session]);

  // Separate useEffect for WebRTC initialization
  useEffect(() => {
    // Only initialize WebRTC if we have meetData and no error
    if (meetData && !error && !isLoading) {
      initializeWebRTC();
    }
  }, [meetData, error, isLoading]);

  const initializeWebRTC = async () => {
    try {
      setConnectionStatus("Initializing connection...");
      
      // Check for Agora App ID
      const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
      if (!appId) {
        console.error("Missing Agora App ID in environment variables");
        throw new Error('Video call configuration error: Agora App ID not found');
      }
      
      console.log("Agora App ID found. Length:", appId.length);
      
      // Create a fresh client
      if (clientRef.current) {
        try {
          await clientRef.current.leave();
        } catch (e) {
          console.log("No active channel to leave");
        }
      }
      
      clientRef.current = AgoraRTC.createClient({ 
        mode: 'rtc', 
        codec: 'vp8',
        role: 'host' // Explicitly set as host
      });
      
      const client = clientRef.current;
      
      // Set up event listeners before joining
      client.on("user-published", async (user: any, mediaType: 'audio' | 'video') => {
        setConnectionStatus(`Remote user ${user.uid} published ${mediaType} track`);
        try {
          await client.subscribe(user, mediaType);
          console.log("Subscribed to user:", user.uid, mediaType);
          if (mediaType === "video") {
            if (remoteVideoRef.current) {
              user.videoTrack.play(remoteVideoRef.current);
              console.log("Playing remote video");
            }
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
            console.log("Playing remote audio");
          }
        } catch (subErr) {
          console.error("Error subscribing to user:", subErr);
        }
      });
      
      client.on("user-unpublished", (user: any, mediaType: 'audio' | 'video') => {
        console.log("User unpublished:", user.uid, mediaType);
      });
      
      client.on("user-joined", (user: any) => {
        console.log("User joined:", user.uid);
        setConnectionStatus(`Remote user ${user.uid} joined the call`);
      });
      
      client.on("user-left", (user: any) => {
        console.log("User left:", user.uid);
        setConnectionStatus(`Remote user ${user.uid} left the call`);
      });
      
      client.on("connection-state-change", (state: string) => {
        console.log("Connection state changed to:", state);
        setConnectionStatus(`Connection state: ${state}`);
      });
      
      // Join the channel
      const channelName = getChannelName();
      console.log("Joining channel with name:", channelName);
      setConnectionStatus(`Joining channel: ${channelName}...`);
      
      // Generate a temporary user ID for testing - make sure it's a number for Agora
      const uid = Math.floor(Math.random() * 100000);
      console.log("Using generated UID:", uid);
      
      try {
        await client.join(appId, channelName, null, uid);
        console.log("Successfully joined channel");
        setConnectionStatus("Successfully joined channel. Creating media tracks...");
      } catch (joinErr: any) {
        console.error("Join error:", joinErr);
        if (typeof joinErr === 'object' && joinErr !== null && joinErr.toString().includes("CAN_NOT_GET_GATEWAY_SERVER")) {
          setConnectionStatus("Connection issue with Agora servers. Trying alternate approach...");
          try {
            const simpleChannel = "testchannel" + Math.floor(Math.random() * 1000);
            await client.join(appId, simpleChannel, null, uid);
            console.log("Successfully joined fallback channel");
            setConnectionStatus("Connected via fallback. Creating media tracks...");
          } catch (fallbackErr) {
            console.error("Fallback join also failed:", fallbackErr);
            throw new Error("Cannot connect to video servers. Please check your internet connection and firewall settings.");
          }
        } else {
          throw joinErr;
        }
      }
      
      // Get user media
      try {
        // Create local audio and video tracks
        const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const cameraTrack = await AgoraRTC.createCameraVideoTrack();
        
        // Store tracks in ref for later cleanup
        localTracksRef.current.audioTrack = microphoneTrack;
        localTracksRef.current.videoTrack = cameraTrack;
        
        // Play local video
        if (localVideoRef.current) {
          cameraTrack.play(localVideoRef.current);
          console.log("Playing local video");
        }
        
        // Publish tracks
        setConnectionStatus("Publishing local tracks...");
        await client.publish([microphoneTrack, cameraTrack]);
        console.log("Published local tracks");
        
        setConnectionStatus("Connected! Waiting for other participants...");
      } catch (mediaErr) {
        console.error("Media error:", mediaErr);
        throw new Error('Failed to access camera or microphone. Please ensure they are connected and permissions are granted.');
      }
    } catch (err) {
      console.error("WebRTC initialization error:", err);
      setError(err instanceof Error ? err.message : 'Failed to initialize video call. Please check your connection and try again.');
      setConnectionStatus("Connection failed");
    }
  };

  const toggleAudio = () => {
    if (localTracksRef.current.audioTrack) {
      const enabled = !isAudioEnabled;
      localTracksRef.current.audioTrack.setEnabled(enabled);
      setIsAudioEnabled(enabled);
    }
  };

  const toggleVideo = () => {
    if (localTracksRef.current.videoTrack) {
      const enabled = !isVideoEnabled;
      localTracksRef.current.videoTrack.setEnabled(enabled);
      setIsVideoEnabled(enabled);
    }
  };

  const endCall = () => {
    // Clean up tracks
    if (localTracksRef.current.audioTrack) {
      localTracksRef.current.audioTrack.close();
    }
    if (localTracksRef.current.videoTrack) {
      localTracksRef.current.videoTrack.close();
    }
    
    // Leave the channel
    if (clientRef.current) {
      clientRef.current.leave().catch(console.error);
    }
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  const retry = () => {
    // Retry connection
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Setting up your meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Meeting Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex flex-col space-y-3">
            <Button
              variant="default"
              className="w-full"
              onClick={retry}
            >
              Retry Connection
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/dashboard'}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getMeetingParticipantName = (role: 'mentor' | 'student') => {
    if (!meetData) return 'Unknown';
    
    const participant = role === 'mentor' ? meetData.mentorId : meetData.studentId;
    
    if (typeof participant === 'object' && participant.name) {
      return participant.name;
    }
    
    return role === 'mentor' ? 'Mentor' : 'Student';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Meeting Info */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h1 className="text-2xl font-bold mb-2">{meetData?.topic || 'Video Meeting'}</h1>
            <p className="text-gray-600 mb-2">
              Scheduled Time: {meetData?.scheduledTime ? new Date(meetData.scheduledTime).toLocaleString() : 'Not specified'}
            </p>
            <p className="text-gray-600">
              Status: <span className="font-semibold">{connectionStatus}</span>
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <div 
                ref={localVideoRef} 
                className="w-full h-full object-cover"
              ></div>
              <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                You {!isVideoEnabled && '(Video Off)'}
              </div>
            </div>
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <div 
                ref={remoteVideoRef} 
                className="w-full h-full object-cover"
              ></div>
              <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                {getMeetingParticipantName(session?.user?.id === (typeof meetData?.mentorId === 'object' ? meetData.mentorId._id : meetData?.mentorId) ? 'student' : 'mentor')}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
            <div className="max-w-6xl mx-auto flex justify-center space-x-4">
              <Button
                variant={isAudioEnabled ? "default" : "destructive"}
                size="lg"
                onClick={toggleAudio}
              >
                {isAudioEnabled ? <Mic /> : <MicOff />}
              </Button>
              <Button
                variant={isVideoEnabled ? "default" : "destructive"}
                size="lg"
                onClick={toggleVideo}
              >
                {isVideoEnabled ? <Video /> : <VideoOff />}
              </Button>
              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
              >
                <Phone className="rotate-135" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}