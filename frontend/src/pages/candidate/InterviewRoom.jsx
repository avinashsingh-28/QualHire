import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { 
  Video, VideoOff, Mic, MicOff, Monitor, StopCircle, 
  Hand, MessageSquare, FolderPlus, FileText, ClipboardList, 
  ChevronRight, ChevronLeft, LogOut, Radio, Download, 
  Users, AlertCircle, Play, Sparkles, Clock, Trash2, Send
} from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

const InterviewRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { user } = useAuth();
  
  // Params from Setup page
  const setupState = routeLocation.state || {};
  const initialVideo = setupState.videoEnabled !== false;
  const initialAudio = setupState.audioEnabled !== false;
  const preferredVideoDevice = setupState.selectedVideo || '';
  const preferredAudioDevice = setupState.selectedAudio || '';

  // Core Room States
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Connecting to signaling server...');
  const [peerConnected, setPeerConnected] = useState(false);
  const [peerName, setPeerName] = useState('Invited Participant');
  const [callDuration, setCallDuration] = useState(0);

  // Media States
  const [videoOn, setVideoOn] = useState(initialVideo);
  const [audioOn, setAudioOn] = useState(initialAudio);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Signaling States (Muted / Raise Hand)
  const [peerVideoOn, setPeerVideoOn] = useState(true);
  const [peerAudioOn, setPeerAudioOn] = useState(true);
  const [myHandRaised, setMyHandRaised] = useState(false);
  const [peerHandRaised, setPeerHandRaised] = useState(false);

  // Side Panel state
  const [activePanel, setActivePanel] = useState('chat'); // chat, files, notes (recruiter), eval (recruiter)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Chat panel states
  const [chatMessages, setChatMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  // Files panel states
  const [filesList, setFilesList] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef(null);

  // Notes panel states
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Evaluation form states
  const [evalForm, setEvalForm] = useState({
    technicalScore: 8,
    communicationScore: 8,
    problemSolvingScore: 8,
    culturalFitScore: 8,
    recommendation: 'HIRE',
    detailedFeedback: ''
  });
  const [submittingEval, setSubmittingEval] = useState(false);

  // Call Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [peerRecording, setPeerRecording] = useState(false);
  const [peerScreenSharing, setPeerScreenSharing] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [toast, setToast] = useState(null); // { message: '', type: 'info' }

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 960;

  // WebRTC / WS Refs
  const stompClientRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const iceCandidatesQueueRef = useRef([]);

  const isRecruiter = user?.role === 'recruiter' || user?.role === 'mentor';
  const roleName = isRecruiter ? 'Interviewer' : 'Candidate';

  // Sync local stream with video ref
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      if (localVideoRef.current.srcObject !== localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    }
  }, [videoOn, isScreenSharing]);

  // Sync remote stream with video ref
  useEffect(() => {
    if (remoteVideoRef.current && remoteStreamRef.current) {
      if (remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    }
  }, [peerVideoOn, peerConnected, peerScreenSharing]);

  // 1. Fetch Room Metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await api.get(`/interviews/room/${roomCode}`);
        setInterview(data);
        setNotes(data.notes || '');
        
        // Fetch Chat history & attachments
        fetchChatHistory(data.id);
        fetchMeetingAttachments(data.id);

        // Update status to ONGOING if it was SCHEDULED
        if (data.status === 'SCHEDULED') {
          await api.put(`/interviews/${data.id}/status?status=ongoing`, {});
        }
      } catch (err) {
        console.error('Room lookup failed', err);
        navigate('/interview/exit');
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, [roomCode]);

  // Sync interview metadata reference
  const interviewRef = useRef(null);
  useEffect(() => {
    interviewRef.current = interview;
  }, [interview]);

  // Handle meeting expiration
  const handleTimeExpired = () => {
    sendSignal('LEAVE', null);
    cleanupStreamsAndConnections();
    
    if (isRecruiter) {
      showToast('Meeting duration has expired. Redirecting...', 'info');
      setTimeout(() => {
        const fillEval = window.confirm('The meeting duration has expired. Would you like to fill out the candidate scorecard before exiting?');
        if (fillEval) {
          setActivePanel('eval');
          setSidebarOpen(true);
        } else {
          navigate('/interview/exit');
        }
      }, 1500);
    } else {
      showToast('The scheduled meeting duration has expired. Thank you!', 'info');
      setTimeout(() => {
        navigate('/interview/exit');
      }, 3000);
    }
  };

  // 2. Call Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => {
        const next = prev + 1;
        const currentInterview = interviewRef.current;
        if (currentInterview && currentInterview.durationMinutes) {
          const totalSecs = currentInterview.durationMinutes * 60;
          const remaining = totalSecs - next;
          
          if (remaining === 60) {
            showToast('Warning: 1 minute remaining before the meeting automatically ends.', 'info');
          } else if (remaining === 30) {
            showToast('Warning: 30 seconds remaining.', 'info');
          } else if (remaining <= 0) {
            clearInterval(interval);
            handleTimeExpired();
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 3. WebRTC / WS Setup
  useEffect(() => {
    if (loading || !interview) return;

    let activeClient = null;

    const setupCall = async () => {
      // 1. Initialize WebRTC PeerConnection and attach local media tracks first
      await initializePeerConnection();

      // 2. Connect WebSocket STOMP for WebRTC signaling
      const socket = new SockJS('http://localhost:8080/ws-chat');
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (str) => console.log('[STOMP Interview] ' + str),
      });

      client.onConnect = () => {
        setConnectionStatus('Connected. Exchanging signatures...');
        
        // Subscribe to signaling topic
        client.subscribe(`/topic/interview/${roomCode}`, (msg) => {
          const signal = JSON.parse(msg.body);
          if (signal.senderId === user.id) return; // Ignore self

          handleIncomingSignal(signal);
        });

        // Broadcast join event
        stompClientRef.current.publish({
          destination: '/app/interview.signal',
          body: JSON.stringify({
            type: 'JOIN',
            roomCode,
            senderId: user.id,
            senderName: user.name,
            data: { name: user.name, role: user.role }
          })
        });
      };

      client.onStompError = (frame) => {
        console.error(frame);
        setConnectionStatus('WebSocket connection failed.');
      };

      client.activate();
      activeClient = client;
      stompClientRef.current = client;
    };

    setupCall();

    return () => {
      cleanupStreamsAndConnections();
      if (activeClient) {
        activeClient.deactivate();
      }
    };
  }, [loading, interview]);

  // Cleanup media/ws resources on exit
  const cleanupStreamsAndConnections = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (pcRef.current) {
      pcRef.current.close();
    }
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
  };

  // Initialize WebRTC RTCPeerConnection
  const initializePeerConnection = async () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(configuration);
    pcRef.current = pc;

    // Get and attach media stream
    try {
      const constraints = {
        video: videoOn ? { deviceId: preferredVideoDevice ? { exact: preferredVideoDevice } : undefined } : false,
        audio: audioOn ? { deviceId: preferredAudioDevice ? { exact: preferredAudioDevice } : undefined } : false
      };

      // Ensure we request at least one, or start empty if both off
      if (videoOn || audioOn) {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStreamRef.current = stream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Add tracks to PeerConnection
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });
      }
    } catch (err) {
      console.warn('Failed to attach media capture to WebRTC peer', err);
    }

    // ICE Candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal('ICE_CANDIDATE', event.candidate);
      }
    };

    // Connection state visualizers
    pc.onconnectionstatechange = () => {
      console.log('[WebRTC ConnectionState]', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setConnectionStatus('Secure Connection Active');
        setPeerConnected(true);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setConnectionStatus('Reconnecting...');
        setPeerConnected(false);
      }
    };

    // Attach remote stream tracks
    pc.ontrack = (event) => {
      console.log('[WebRTC Track Added]', event.streams[0]);
      remoteStreamRef.current = event.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      setPeerConnected(true);
    };
  };

  // Flush queued WebRTC ice candidates once remote description is set
  const processQueuedIceCandidates = async () => {
    if (!pcRef.current) return;
    while (iceCandidatesQueueRef.current.length > 0) {
      const candidate = iceCandidatesQueueRef.current.shift();
      try {
        await pcRef.current.addIceCandidate(candidate);
      } catch (e) {
        console.error('Error processing queued ICE candidate', e);
      }
    }
  };

  // Handle incoming WebSocket messages
  const handleIncomingSignal = async (signal) => {
    const { type, senderName, data } = signal;
    console.log('[Signal Received]', type, data);

    switch (type) {
      case 'JOIN':
        setPeerName(senderName);
        setPeerConnected(true);
        // Acknowledge join by replying with our current media state
        sendSignal('JOIN_ACK', { videoOn, audioOn, isScreenSharing });
        // Recruiter starts the peer offer handshake if already connected
        if (isRecruiter) {
          createOffer();
        }
        break;

      case 'JOIN_ACK':
        setPeerName(senderName);
        setPeerConnected(true);
        // Sync peer media state
        setPeerVideoOn(data.videoOn);
        setPeerAudioOn(data.audioOn);
        setPeerScreenSharing(data.isScreenSharing);
        // Recruiter starts the peer offer handshake when Candidate acknowledges join
        if (isRecruiter) {
          createOffer();
        }
        break;

      case 'LEAVE':
        setPeerConnected(false);
        setConnectionStatus('Peer left room. Waiting for reconnection...');
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        break;

      case 'OFFER':
        if (!pcRef.current) return;
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        sendSignal('ANSWER', answer);
        await processQueuedIceCandidates();
        break;

      case 'ANSWER':
        if (!pcRef.current) return;
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(data));
        await processQueuedIceCandidates();
        break;

      case 'ICE_CANDIDATE':
        if (!pcRef.current) return;
        try {
          const candidate = new RTCIceCandidate(data);
          if (pcRef.current.remoteDescription && pcRef.current.remoteDescription.type) {
            await pcRef.current.addIceCandidate(candidate);
          } else {
            iceCandidatesQueueRef.current.push(candidate);
          }
        } catch (e) {
          console.error('Error adding ICE candidate', e);
        }
        break;

      case 'MEDIA_TOGGLE':
        setPeerVideoOn(data.videoOn);
        setPeerAudioOn(data.audioOn);
        break;

      case 'SCREEN_SHARE':
        setPeerScreenSharing(data);
        break;

      case 'RECORDING':
        setPeerRecording(data);
        break;

      case 'RAISE_HAND':
        setPeerHandRaised(data);
        break;

      case 'CHAT':
        fetchChatHistory(interview.id);
        break;

      case 'FILE':
        fetchMeetingAttachments(interview.id);
        break;

      case 'MUTE_ALL':
        if (!isRecruiter) {
          // Force candidate mute
          setAudioOn(false);
          if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => track.enabled = false);
          }
          sendSignal('MEDIA_TOGGLE', { videoOn, audioOn: false });
        }
        break;

      default:
        break;
    }
  };

  // Dispatch message Helper
  const sendSignal = (type, data) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/interview.signal',
        body: JSON.stringify({
          type,
          roomCode,
          senderId: user.id,
          senderName: user.name,
          data
        })
      });
    }
  };

  // Handshake Offer Creator
  const createOffer = async () => {
    if (!pcRef.current) return;
    try {
      const offer = await pcRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await pcRef.current.setLocalDescription(offer);
      sendSignal('OFFER', offer);
    } catch (e) {
      console.error('Failed to create WebRTC offer', e);
    }
  };

  // Toggle Camera
  const toggleCamera = async () => {
    const next = !videoOn;
    setVideoOn(next);

    if (next) {
      try {
        let track = null;
        if (localStreamRef.current) {
          track = localStreamRef.current.getVideoTracks()[0];
        }
        
        if (!track) {
          const constraints = {
            video: preferredVideoDevice ? { deviceId: { exact: preferredVideoDevice } } : true
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          track = stream.getVideoTracks()[0];
          
          if (!localStreamRef.current) {
            localStreamRef.current = new MediaStream();
          }
          localStreamRef.current.addTrack(track);
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
          
          if (pcRef.current) {
            const senders = pcRef.current.getSenders();
            const videoSender = senders.find(sender => sender.track && sender.track.kind === 'video');
            if (videoSender) {
              await videoSender.replaceTrack(track);
            } else {
              pcRef.current.addTrack(track, localStreamRef.current);
              createOffer();
            }
          }
        } else {
          track.enabled = true;
          if (pcRef.current) {
            const senders = pcRef.current.getSenders();
            const videoSender = senders.find(sender => sender.track && sender.track.kind === 'video');
            if (videoSender) {
              await videoSender.replaceTrack(track);
            }
          }
        }
      } catch (err) {
        console.error('Failed to start camera', err);
        setVideoOn(false);
        showToast('Could not start camera: ' + err.message, 'error');
      }
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(track => {
          track.enabled = false;
        });
      }
    }
    sendSignal('MEDIA_TOGGLE', { videoOn: next, audioOn });
  };

  // Toggle Microphone
  const toggleMic = async () => {
    const next = !audioOn;
    setAudioOn(next);

    if (next) {
      try {
        let track = null;
        if (localStreamRef.current) {
          track = localStreamRef.current.getAudioTracks()[0];
        }
        
        if (!track) {
          const constraints = {
            audio: preferredAudioDevice ? { deviceId: { exact: preferredAudioDevice } } : true
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          track = stream.getAudioTracks()[0];
          
          if (!localStreamRef.current) {
            localStreamRef.current = new MediaStream();
          }
          localStreamRef.current.addTrack(track);
          
          if (pcRef.current) {
            const senders = pcRef.current.getSenders();
            const audioSender = senders.find(sender => sender.track && sender.track.kind === 'audio');
            if (audioSender) {
              await audioSender.replaceTrack(track);
            } else {
              pcRef.current.addTrack(track, localStreamRef.current);
              createOffer();
            }
          }
        } else {
          track.enabled = true;
        }
      } catch (err) {
        console.error('Failed to start microphone', err);
        setAudioOn(false);
        showToast('Could not start microphone: ' + err.message, 'error');
      }
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => {
          track.enabled = false;
        });
      }
    }
    sendSignal('MEDIA_TOGGLE', { videoOn, audioOn: next });
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop Screen Share
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsScreenSharing(false);
      sendSignal('SCREEN_SHARE', false);
      
      // Re-add camera track if camera was active
      if (videoOn) {
        await startCameraStream();
      } else {
        if (pcRef.current) {
          const senders = pcRef.current.getSenders();
          const videoSender = senders.find(sender => sender.track && sender.track.kind === 'video');
          if (videoSender) {
            try {
              await videoSender.replaceTrack(null);
            } catch (err) {
              console.warn(err);
            }
          }
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
      }
    } else {
      // Start Screen Share
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        setIsScreenSharing(true);
        sendSignal('SCREEN_SHARE', true);

        const screenTrack = stream.getVideoTracks()[0];
        
        // Replace current video track in RTCPeerConnection
        if (pcRef.current) {
          const senders = pcRef.current.getSenders();
          const videoSender = senders.find(sender => sender.track && sender.track.kind === 'video');
          if (videoSender) {
            await videoSender.replaceTrack(screenTrack);
          } else {
            pcRef.current.addTrack(screenTrack, stream);
            createOffer();
          }
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Listener for stop sharing button on browser UI
        screenTrack.onended = async () => {
          setIsScreenSharing(false);
          sendSignal('SCREEN_SHARE', false);
          if (videoOn) {
            await startCameraStream();
          } else {
            if (pcRef.current) {
              const senders = pcRef.current.getSenders();
              const videoSender = senders.find(sender => sender.track && sender.track.kind === 'video');
              if (videoSender) {
                await videoSender.replaceTrack(null);
              }
            }
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = null;
            }
          }
        };
      } catch (err) {
        console.error('Failed to acquire screen stream', err);
      }
    }
  };

  const startCameraStream = async () => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: preferredVideoDevice ? { deviceId: { exact: preferredVideoDevice } } : true
      });
      
      const newVideoTrack = stream.getVideoTracks()[0];

      if (!localStreamRef.current) {
        localStreamRef.current = new MediaStream();
      }
      
      localStreamRef.current.getVideoTracks().forEach(track => {
        localStreamRef.current.removeTrack(track);
      });
      
      localStreamRef.current.addTrack(newVideoTrack);

      if (pcRef.current) {
        const senders = pcRef.current.getSenders();
        const videoSender = senders.find(sender => sender.track && sender.track.kind === 'video');
        if (videoSender) {
          await videoSender.replaceTrack(newVideoTrack);
        } else {
          pcRef.current.addTrack(newVideoTrack, localStreamRef.current);
          createOffer();
        }
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    } catch (e) {
      console.error('Failed to restart camera stream', e);
    }
  };

  // Raise Hand
  const toggleRaiseHand = () => {
    const next = !myHandRaised;
    setMyHandRaised(next);
    sendSignal('RAISE_HAND', next);
  };

  // Mute All (Recruiter only)
  const handleMuteAll = () => {
    if (!isRecruiter) return;
    sendSignal('MUTE_ALL', null);
  };

  // 4. Chat logic
  const fetchChatHistory = async (id) => {
    try {
      const data = await api.get(`/interviews/${id}/chat`);
      setChatMessages(data);
    } catch (e) {
      console.warn('Failed to load chat history', e);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    try {
      await api.post(`/interviews/${interview.id}/chat`, newMsg);
      setNewMsg('');
      fetchChatHistory(interview.id);
      sendSignal('CHAT', null); // Trigger peer chat reload
    } catch (err) {
      console.error('Failed to send chat', err);
    }
  };

  // 5. Files / Attachments logic
  const fetchMeetingAttachments = async (id) => {
    try {
      const data = await api.get(`/interviews/${id}/attachments`);
      setFilesList(data);
    } catch (e) {
      console.warn('Failed to fetch attachments', e);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.upload(`/interviews/${interview.id}/attachments`, formData);
      fetchMeetingAttachments(interview.id);
      sendSignal('FILE', null); // Trigger peer attachments list reload
    } catch (err) {
      console.error('Failed to upload file', err);
      showToast('Failed to upload file.', 'error');
    } finally {
      setUploadingFile(false);
    }
  };

  // 6. Notes Auto-save (every 5 seconds)
  useEffect(() => {
    if (!isRecruiter || !interview || !notes.trim()) return;

    const timer = setTimeout(async () => {
      setSavingNotes(true);
      try {
        await api.put(`/interviews/${interview.id}/notes`, notes);
      } catch (e) {
        console.warn('Notes auto-save failed', e);
      } finally {
        setSavingNotes(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [notes, interview, isRecruiter]);

  // 7. Call Recording logic (Recruiter only)
  const toggleRecording = () => {
    if (isRecording) {
      // Stop Recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      sendSignal('RECORDING', false);
    } else {
      // Start Recording
      recordedChunksRef.current = [];
      
      const mixedStream = new MediaStream();
      
      // Mix local camera track
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => mixedStream.addTrack(track));
      }
      
      // Fallback if no local streams/tracks are active
      if (mixedStream.getTracks().length === 0) {
        showToast('You must enable camera or mic to start recording the call.', 'error');
        return;
      }

      try {
        const mediaRecorder = new MediaRecorder(mixedStream, { mimeType: 'video/webm;codecs=vp9' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const recordingFile = new File([blob], `Interview_Recording_${interview.roomCode}.webm`, { type: 'video/webm' });
          
          // Post recording to attachments
          const formData = new FormData();
          formData.append('file', recordingFile);

          try {
            await api.upload(`/interviews/${interview.id}/attachments`, formData);
            fetchMeetingAttachments(interview.id);
            sendSignal('FILE', null);
            showToast('Interview recording saved successfully under shared files!', 'success');
          } catch (err) {
            console.error('Failed to upload recording file', err);
          }
        };

        mediaRecorder.start(1000); // Record in 1s slices
        setIsRecording(true);
        sendSignal('RECORDING', true);
      } catch (err) {
        console.error('MediaRecorder initialization failed', err);
        showToast('Failed to start recording. Please ensure camera or mic is active.', 'error');
      }
    }
  };

  // 8. Submit Evaluation (Recruiter only)
  const handleEvalSubmit = async (e) => {
    e.preventDefault();
    setSubmittingEval(true);
    try {
      const payload = {
        technicalScore: parseInt(evalForm.technicalScore),
        communicationScore: parseInt(evalForm.communicationScore),
        problemSolvingScore: parseInt(evalForm.problemSolvingScore),
        culturalFitScore: parseInt(evalForm.culturalFitScore),
        recommendation: evalForm.recommendation,
        detailedFeedback: evalForm.detailedFeedback
      };

      await api.post(`/interviews/${interview.id}/evaluations`, payload);
      showToast('Evaluation submitted successfully!', 'success');
      
      // End interview session
      await api.put(`/interviews/${interview.id}/status?status=completed`, {});
      sendSignal('LEAVE', null);
      
      setTimeout(() => {
        navigate('/interview/exit');
      }, 1500);
    } catch (err) {
      console.error('Evaluation submit failed', err);
      showToast('Failed to submit evaluation.', 'error');
    } finally {
      setSubmittingEval(false);
    }
  };

  // Disconnect Meeting
  const handleLeaveCall = async () => {
    if (window.confirm('Are you sure you want to leave this interview room?')) {
      sendSignal('LEAVE', null);
      
      // If recruiter, check if they want to complete evaluations
      if (isRecruiter) {
        const complete = window.confirm('Would you like to fill out the candidate evaluation report before exiting?');
        if (complete) {
          setActivePanel('eval');
          setSidebarOpen(true);
          return;
        }
      }

      cleanupStreamsAndConnections();
      navigate('/interview/exit');
    }
  };

  if (loading) return null;


  return (
    <div style={{ 
      display: 'flex', height: '100vh', width: '100vw', 
      background: '#0f172a', color: '#fff', overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
      position: 'relative'
    }}>
      
      {/* LEFT: Main Meeting Stage */}
      <div style={{ 
        flex: 1, display: 'flex', flexDirection: 'column', 
        position: 'relative', height: '100%' 
      }}>
        
        {/* Call Header */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: isMobile ? '10px 16px' : '16px 24px', background: 'rgba(15, 23, 42, 0.8)', 
          backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.05)',
          zIndex: 10
        }}>
          <div>
            <h2 style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: 700, margin: 0 }}>{interview.title}</h2>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, marginTop: '2px' }}>
              {isMobile ? `Room: ${roomCode}` : `Interviewer: ${interview.interviewerName} · Candidate: ${interview.candidateName}`}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={11} /> {formatTimer(callDuration)}
            </span>
            <span style={{ 
              fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '12px',
              background: peerConnected ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
              color: peerConnected ? '#4ade80' : '#fbbf24',
              display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: peerConnected ? '#4ade80' : '#fbbf24' }} />
              {peerConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Recording alert banner */}
        {(isRecording || peerRecording) && (
          <div style={{ 
            background: '#ef4444', color: 'white', padding: '8px', 
            textAlign: 'center', fontSize: '12px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            animation: 'pulse 2s infinite'
          }}>
            <Radio size={14} className="animate-pulse" /> Recording Session Active. Candidate notified.
          </div>
        )}

        {/* Video stream grids */}
        <div style={{ 
          flex: 1, padding: isMobile ? '12px' : '24px', display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : (peerConnected ? '1fr 1fr' : '1fr'), 
          gridTemplateRows: isMobile && peerConnected ? '1fr 1fr' : '1fr',
          gap: isMobile ? '12px' : '20px', alignItems: 'center', justifyContent: 'center',
          background: '#090d16'
        }}>
          {/* Local Camera stream */}
          <div style={{ 
            position: 'relative', width: '100%', height: '100%', 
            background: '#1e293b', borderRadius: '16px', overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.05)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: isScreenSharing ? 'contain' : 'cover', 
                transform: isScreenSharing ? 'none' : 'scaleX(-1)',
                display: (videoOn || isScreenSharing) ? 'block' : 'none'
              }} 
            />
            {!videoOn && !isScreenSharing && (
              <div style={{ textAlign: 'center', color: '#64748b', position: 'absolute' }}>
                <VideoOff size={isMobile ? 36 : 48} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p style={{ fontSize: isMobile ? '11px' : '13px' }}>Your camera is muted</p>
              </div>
            )}
            
            {/* Label and badges */}
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px' }}>
              <span>You ({roleName})</span>
              {!audioOn && <MicOff size={12} style={{ color: '#ef4444' }} />}
            </div>
            {myHandRaised && (
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#eab308', color: '#000', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                <Hand size={16} fill="#000" />
              </div>
            )}
          </div>

          {/* Remote Peer stream */}
          {peerConnected && (
            <div style={{ 
              position: 'relative', width: '100%', height: '100%', 
              background: '#1e293b', borderRadius: '16px', overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.05)', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: peerScreenSharing ? 'contain' : 'cover',
                  display: (peerVideoOn || peerScreenSharing) ? 'block' : 'none'
                }} 
              />
              {!peerVideoOn && !peerScreenSharing && (
                <div style={{ textAlign: 'center', color: '#64748b', position: 'absolute' }}>
                  <VideoOff size={isMobile ? 36 : 48} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <p style={{ fontSize: isMobile ? '11px' : '13px' }}>{peerName} camera muted</p>
                </div>
              )}

              {/* Label and badges */}
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px' }}>
                <span>{peerName} ({isRecruiter ? 'Candidate' : 'Interviewer'})</span>
                {!peerAudioOn && <MicOff size={12} style={{ color: '#ef4444' }} />}
              </div>
              {peerHandRaised && (
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#eab308', color: '#000', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <Hand size={16} fill="#000" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Controls Bar */}
        <div style={{ 
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: isMobile ? '12px' : '20px 24px', background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid rgba(255,255,255,0.05)', gap: isMobile ? '6px' : '16px',
          zIndex: 10, flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          {/* Audio toggle */}
          <button 
            onClick={toggleMic}
            style={{ 
              width: isMobile ? '36px' : '46px', height: isMobile ? '36px' : '46px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: audioOn ? '#334155' : '#ef4444', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
            }}
            title={audioOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {audioOn ? <Mic size={isMobile ? 16 : 18} /> : <MicOff size={isMobile ? 16 : 18} />}
          </button>

          {/* Camera toggle */}
          <button 
            onClick={toggleCamera}
            style={{ 
              width: isMobile ? '36px' : '46px', height: isMobile ? '36px' : '46px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: videoOn ? '#334155' : '#ef4444', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
            }}
            title={videoOn ? 'Stop Camera' : 'Start Camera'}
          >
            {videoOn ? <Video size={isMobile ? 16 : 18} /> : <VideoOff size={isMobile ? 16 : 18} />}
          </button>

          {/* Screen Share */}
          <button 
            onClick={toggleScreenShare}
            style={{ 
              width: isMobile ? '36px' : '46px', height: isMobile ? '36px' : '46px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: isScreenSharing ? '#10b981' : '#334155', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
            }}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
          >
            <Monitor size={isMobile ? 16 : 18} />
          </button>

          {/* Hand Raise */}
          <button 
            onClick={toggleRaiseHand}
            style={{ 
              width: isMobile ? '36px' : '46px', height: isMobile ? '36px' : '46px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: myHandRaised ? '#eab308' : '#334155', color: myHandRaised ? '#000' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
            }}
            title={myHandRaised ? 'Lower Hand' : 'Raise Hand'}
          >
            <Hand size={isMobile ? 16 : 18} fill={myHandRaised ? '#000' : 'none'} />
          </button>

          {/* Recruiter-only Call Controls */}
          {isRecruiter && (
            <>
              {/* Record Toggle */}
              <button 
                onClick={toggleRecording}
                style={{ 
                  width: isMobile ? '36px' : '46px', height: isMobile ? '36px' : '46px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: isRecording ? '#ef4444' : '#334155', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                  animation: isRecording ? 'pulse 1.5s infinite' : 'none'
                }}
                title={isRecording ? 'Stop Recording' : 'Record Call'}
              >
                <Radio size={isMobile ? 16 : 18} />
              </button>

              {/* Mute All */}
              <button 
                onClick={handleMuteAll}
                style={{ 
                  width: isMobile ? '36px' : '46px', height: isMobile ? '36px' : '46px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: '#334155', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                }}
                title="Mute All Candidates"
              >
                <MicOff size={isMobile ? 16 : 18} style={{ opacity: 0.8 }} />
              </button>
            </>
          )}

          <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Sidebar Panel Toggles */}
          <button 
            onClick={() => { setSidebarOpen(!sidebarOpen) }}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px'
            }}
          >
            {sidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* Exit Call */}
          <Button 
            variant="danger" 
            size={isMobile ? "sm" : "md"} 
            leftIcon={<LogOut size={isMobile ? 14 : 16} />} 
            onClick={handleLeaveCall} 
            style={{ 
              background: '#ef4444', 
              border: 'none', 
              borderRadius: '30px', 
              padding: isMobile ? '6px 12px' : '10px 24px',
              fontSize: isMobile ? '12px' : '14px'
            }}
          >
            {!isMobile && 'Leave'}
          </Button>
        </div>
      </div>

      {/* RIGHT: Dynamic Control Sidebar Panel */}
      {sidebarOpen && (
        <div style={{ 
          width: isMobile ? '100%' : '380px', background: '#1e293b', borderLeft: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', height: '100%', zIndex: 20,
          position: isMobile ? 'absolute' : 'relative',
          top: 0,
          right: 0,
          boxShadow: isMobile ? '-4px 0 24px rgba(0,0,0,0.5)' : 'none'
        }}>
          {/* Tabs bar */}
          <div style={{ 
            display: 'flex', background: '#0f172a', 
            borderBottom: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto',
            alignItems: 'center', width: '100%'
          }}>
            <button 
              onClick={() => setActivePanel('chat')}
              style={{ 
                flex: 1, padding: '14px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                background: activePanel === 'chat' ? '#1e293b' : 'transparent', color: activePanel === 'chat' ? '#fff' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderBottom: activePanel === 'chat' ? '2px solid var(--color-primary)' : 'none'
              }}
            >
              <MessageSquare size={14} /> Chat
            </button>
            <button 
              onClick={() => setActivePanel('files')}
              style={{ 
                flex: 1, padding: '14px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                background: activePanel === 'files' ? '#1e293b' : 'transparent', color: activePanel === 'files' ? '#fff' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderBottom: activePanel === 'files' ? '2px solid var(--color-primary)' : 'none'
              }}
            >
              <FolderPlus size={14} /> Files
            </button>
            {isRecruiter && (
              <>
                <button 
                  onClick={() => setActivePanel('notes')}
                  style={{ 
                    flex: 1, padding: '14px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                    background: activePanel === 'notes' ? '#1e293b' : 'transparent', color: activePanel === 'notes' ? '#fff' : '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderBottom: activePanel === 'notes' ? '2px solid var(--color-primary)' : 'none'
                  }}
                >
                  <FileText size={14} /> Notes
                </button>
                <button 
                  onClick={() => setActivePanel('eval')}
                  style={{ 
                    flex: 1, padding: '14px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                    background: activePanel === 'eval' ? '#1e293b' : 'transparent', color: activePanel === 'eval' ? '#fff' : '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderBottom: activePanel === 'eval' ? '2px solid var(--color-primary)' : 'none'
                  }}
                >
                  <ClipboardList size={14} /> Scorecard
                </button>
              </>
            )}
            <button 
              onClick={() => setSidebarOpen(false)}
              style={{
                padding: '14px 16px', border: 'none', cursor: 'pointer', background: 'transparent', color: '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto',
                transition: 'color 0.2s'
              }}
              title="Close Sidebar"
            >
              <ChevronRight size={18} />
            </button>
          </div>


          {/* Panel Content Router */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            
            {/* A. Chat Panel */}
            {activePanel === 'chat' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px' }}>
                  {chatMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#64748b', marginTop: '48px', fontSize: '13px' }}>
                      No messages sent yet. Send a message to start.
                    </div>
                  ) : (
                    chatMessages.map(m => (
                      <div key={m.id} style={{ 
                        alignSelf: m.senderId === user.id ? 'flex-end' : 'flex-start',
                        maxWidth: '85%', padding: '10px 14px', borderRadius: '12px',
                        background: m.senderId === user.id ? 'var(--color-primary)' : '#334155',
                        fontSize: '13.5px', lineHeight: 1.4
                      }}>
                        <p style={{ fontSize: '11px', opacity: 0.6, marginBottom: '2px', fontWeight: 600 }}>{m.senderName}</p>
                        <p style={{ margin: 0 }}>{m.text}</p>
                        <p style={{ fontSize: '9px', opacity: 0.5, textAlign: 'right', marginTop: '2px' }}>
                          {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Chat form */}
                <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Type message..." 
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    style={{ 
                      flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                      background: '#0f172a', color: 'white', fontSize: '13px', outline: 'none'
                    }}
                  />
                  <button type="submit" style={{ width: '38px', height: '38px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}

            {/* B. Files Panel */}
            {activePanel === 'files' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', margin: 0, marginBottom: '8px' }}>Shared Meeting Files</h4>
                  
                  {filesList.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#64748b', marginTop: '36px', fontSize: '13px' }}>
                      No documents shared in call yet.
                    </div>
                  ) : (
                    filesList.map(file => (
                      <div key={file.id} style={{ 
                        padding: '12px', background: '#334155', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'
                      }}>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{file.fileName}</p>
                          <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, marginTop: '2px' }}>by {file.senderName} • {Math.round(file.fileSize / 1024)} KB</p>
                        </div>
                        <a 
                          href={`http://localhost:8080${file.fileUrl}`} 
                          download 
                          style={{ 
                            width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            textDecoration: 'none'
                          }}
                          title="Download shared file"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    ))
                  )}
                </div>

                {/* Upload attachment CTA */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <Button 
                    variant="outline" 
                    style={{ width: '100%', borderColor: 'rgba(255,255,255,0.1)', color: 'white', background: 'transparent' }}
                    leftIcon={<FolderPlus size={16} />}
                    disabled={uploadingFile}
                    onClick={() => fileInputRef.current.click()}
                  >
                    {uploadingFile ? 'Uploading file...' : 'Share Document'}
                  </Button>
                </div>
              </div>
            )}

            {/* C. Notes Panel (Recruiter only) */}
            {activePanel === 'notes' && isRecruiter && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', margin: 0 }}>Private Interview Notes</h4>
                  {savingNotes && <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkles size={10} className="animate-spin" /> Saving...</span>}
                </div>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>These notes are private and only visible to the recruiter dashboard. Auto-saves dynamically.</p>
                <textarea 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Take notes during the interview... e.g. candidate coding standards, communication notes, architecture insights..."
                  style={{ 
                    flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                    background: '#0f172a', color: 'white', fontSize: '13px', outline: 'none', resize: 'none',
                    lineHeight: 1.5, minHeight: '320px'
                  }}
                />
              </div>
            )}

            {/* D. Evaluation Panel (Recruiter only) */}
            {activePanel === 'eval' && isRecruiter && (
              <form onSubmit={handleEvalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'white', margin: 0 }}>Hiring Scorecard</h4>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Rate the candidate across standard evaluation criteria (1-10).</p>

                {/* Technical Score */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                    <span>Technical Skillset</span>
                    <strong>{evalForm.technicalScore} / 10</strong>
                  </div>
                  <input 
                    type="range" min={1} max={10} 
                    value={evalForm.technicalScore}
                    onChange={e => setEvalForm({ ...evalForm, technicalScore: e.target.value })}
                    style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                  />
                </div>

                {/* Communication */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                    <span>Communication</span>
                    <strong>{evalForm.communicationScore} / 10</strong>
                  </div>
                  <input 
                    type="range" min={1} max={10} 
                    value={evalForm.communicationScore}
                    onChange={e => setEvalForm({ ...evalForm, communicationScore: e.target.value })}
                    style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                  />
                </div>

                {/* Problem Solving */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                    <span>Problem Solving</span>
                    <strong>{evalForm.problemSolvingScore} / 10</strong>
                  </div>
                  <input 
                    type="range" min={1} max={10} 
                    value={evalForm.problemSolvingScore}
                    onChange={e => setEvalForm({ ...evalForm, problemSolvingScore: e.target.value })}
                    style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                  />
                </div>

                {/* Cultural Fit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                    <span>Cultural Fit</span>
                    <strong>{evalForm.culturalFitScore} / 10</strong>
                  </div>
                  <input 
                    type="range" min={1} max={10} 
                    value={evalForm.culturalFitScore}
                    onChange={e => setEvalForm({ ...evalForm, culturalFitScore: e.target.value })}
                    style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                  />
                </div>

                {/* Recommendation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Overall Recommendation</label>
                  <select 
                    value={evalForm.recommendation}
                    onChange={e => setEvalForm({ ...evalForm, recommendation: e.target.value })}
                    style={{ 
                      padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                      background: '#0f172a', color: 'white', fontSize: '13px'
                    }}
                  >
                    <option value="STRONG_HIRE">Strong Hire</option>
                    <option value="HIRE">Hire</option>
                    <option value="NEUTRAL">Neutral</option>
                    <option value="REJECT">Reject</option>
                  </select>
                </div>

                {/* Written Feedback */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Written Feedback & Summary</label>
                  <textarea 
                    placeholder="Provide detailed feedback on technical proficiency, coding assessment, strength, weakness..."
                    rows={4}
                    value={evalForm.detailedFeedback}
                    onChange={e => setEvalForm({ ...evalForm, detailedFeedback: e.target.value })}
                    style={{ 
                      padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                      background: '#0f172a', color: 'white', fontSize: '13px', outline: 'none', resize: 'none',
                      lineHeight: 1.4
                    }}
                  />
                </div>

                <Button variant="primary" type="submit" disabled={submittingEval} style={{ marginTop: '8px' }}>
                  {submittingEval ? 'Submitting...' : 'Submit Scorecard & Complete'}
                </Button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : (toast.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(30, 41, 59, 0.95)'),
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '30px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 9999,
          fontSize: '13px',
          fontWeight: 600,
          pointerEvents: 'none',
          transition: 'all 0.2s ease-in-out'
        }}>
          <AlertCircle size={16} />
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default InterviewRoom;
