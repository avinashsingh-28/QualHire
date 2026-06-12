import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Video, VideoOff, Mic, MicOff, Settings, Volume2, 
  VolumeX, Shield, Play, AlertTriangle, ArrowLeft, RefreshCw
} from 'lucide-react';
import Button from '../../components/Button';
import api from '../../services/api';
import './Dashboard.css';

const InterviewSetup = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  // Settings
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Devices & Streams
  const [localStream, setLocalStream] = useState(null);
  const [devices, setDevices] = useState({ video: [], audioIn: [], audioOut: [] });
  const [selectedDevices, setSelectedDevices] = useState({ video: '', audioIn: '', audioOut: '' });

  // Toggles
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [micLevel, setMicLevel] = useState(0);

  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Fetch interview metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await api.get(`/interviews/room/${roomCode}`);
        setInterview(data);
      } catch (err) {
        console.error(err);
        setError('Interview room not found. Please verify the URL invitation or contact the recruiter.');
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, [roomCode]);

  // Request media permissions and setup preview
  const startPreview = async (videoDeviceId = '', audioDeviceId = '') => {
    // Stop any existing stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints = {
        video: videoOn ? { deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined } : false,
        audio: audioOn ? { deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined } : false
      };

      if (!videoOn && !audioOn) {
        setLocalStream(null);
        if (videoRef.current) videoRef.current.srcObject = null;
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      if (videoRef.current && videoOn) {
        videoRef.current.srcObject = stream;
      }

      // Initialize audio level analyser
      if (stream.getAudioTracks().length > 0 && audioOn) {
        setupAudioAnalyser(stream);
      } else {
        setMicLevel(0);
      }
    } catch (err) {
      console.warn('Failed to acquire media stream preview', err);
    }
  };

  // Setup Microphone Level Meter
  const setupAudioAnalyser = (stream) => {
    try {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        // Map average volume (0-128 range usually) to 0-100 percentage
        setMicLevel(Math.min(100, Math.round((average / 60) * 100)));
        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch (e) {
      console.warn('Could not initialize audio visualizer context', e);
    }
  };

  // Enumerate hardware devices
  const getDevicesList = async () => {
    try {
      // Prompt user to trigger permissions first, so labels are resolved
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const list = await navigator.mediaDevices.enumerateDevices();
      
      const videoList = list.filter(d => d.kind === 'videoinput');
      const audioInList = list.filter(d => d.kind === 'audioinput');
      const audioOutList = list.filter(d => d.kind === 'audiooutput');

      setDevices({ video: videoList, audioIn: audioInList, audioOut: audioOutList });

      // Select default devices
      setSelectedDevices({
        video: videoList[0]?.deviceId || '',
        audioIn: audioInList[0]?.deviceId || '',
        audioOut: audioOutList[0]?.deviceId || ''
      });
    } catch (err) {
      console.error('Permission denied or devices not found', err);
    }
  };

  useEffect(() => {
    getDevicesList();
  }, []);

  // Sync previews on device/toggle change
  useEffect(() => {
    startPreview(selectedDevices.video, selectedDevices.audioIn);
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoOn, audioOn, selectedDevices.video, selectedDevices.audioIn]);

  // Test Speaker Sound
  const playTestSound = () => {
    const testAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
    if (videoRef.current && selectedDevices.audioOut) {
      // Set output device if supported by browser (chrome/edge)
      if (typeof testAudio.setSinkId === 'function') {
        testAudio.setSinkId(selectedDevices.audioOut)
          .then(() => testAudio.play())
          .catch(err => console.error(err));
      } else {
        testAudio.play();
      }
    } else {
      testAudio.play();
    }
  };

  // Join Call
  const handleJoinCall = () => {
    // Navigate to interview room page, passing microphone/video preferences in state
    navigate(`/interview/room/${roomCode}`, {
      state: {
        videoEnabled: videoOn,
        audioEnabled: audioOn,
        selectedVideo: selectedDevices.video,
        selectedAudio: selectedDevices.audioIn
      }
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-surface-hover)' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          <RefreshCw size={36} className="animate-spin" style={{ color: 'var(--color-primary)', margin: '0 auto 12px' }} />
          <h3>Connecting to room...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-surface-hover)', padding: '24px' }}>
        <div className="section-card" style={{ maxWidth: '440px', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <AlertTriangle size={48} style={{ color: 'var(--color-danger)' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Access Error</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>{error}</p>
          <Button leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      minHeight: '100vh', background: 'radial-gradient(circle, var(--color-surface) 0%, rgba(99,102,241,0.03) 100%)', 
      padding: '24px' 
    }}>
      <div style={{ width: '100%', maxWidth: '960px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Banner metadata */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{interview.title}</h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Interviewer: <strong>{interview.interviewerName}</strong> · Candidate: <strong>{interview.candidateName}</strong>
            </p>
          </div>
          <span className={`badge badge-info`} style={{ textTransform: 'capitalize' }}>Status: {interview.status?.toLowerCase()}</span>
        </div>

        {/* Permission / Device Warning */}
        {(devices.video.length === 0 || devices.audioIn.length === 0) && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
            background: 'rgba(239, 68, 68, 0.12)', color: 'var(--color-danger)', 
            borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.25)',
            fontSize: '13px', lineHeight: 1.5
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, color: 'var(--color-danger)' }} />
            <div>
              <strong style={{ fontWeight: 700 }}>Media Access Required:</strong> Camera or microphone access was blocked or no devices were detected. Please check your browser site settings or click the camera icon in the URL bar to allow permissions, then refresh the page.
            </div>
          </div>
        )}

        {/* Outer Split layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginTop: '12px' }}>
          {/* Left - Video Preview panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ 
              position: 'relative', width: '100%', aspectRatio: '16/9', 
              background: '#000', borderRadius: '16px', overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)'
            }}>
              {videoOn && localStream?.getVideoTracks().length > 0 ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
                  <VideoOff size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Camera is turned off</p>
                </div>
              )}

              {/* Float buttons in preview */}
              <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', zIndex: 10 }}>
                <button 
                  onClick={() => setAudioOn(!audioOn)}
                  style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: audioOn ? 'rgba(255,255,255,0.2)' : '#ef4444', color: '#fff',
                    backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {audioOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
                <button 
                  onClick={() => setVideoOn(!videoOn)}
                  style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: videoOn ? 'rgba(255,255,255,0.2)' : '#ef4444', color: '#fff',
                    backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>
              </div>
            </div>

            {/* Mic level gauge */}
            {audioOn && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--color-surface-2)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                <Mic size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', minWidth: '80px' }}>Input Volume</span>
                <div style={{ flex: 1, height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${micLevel}%`, background: 'var(--color-primary)', transition: 'width 0.1s ease-out' }} />
                </div>
              </div>
            )}
          </div>

          {/* Right - Controls and Join Box */}
          <div className="section-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={18} /> Device Calibration
              </h3>

              {/* Camera select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Camera Source</label>
                <select 
                  value={selectedDevices.video}
                  onChange={e => setSelectedDevices({ ...selectedDevices, video: e.target.value })}
                  style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '13px', background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
                >
                  {devices.video.length > 0 ? (
                    devices.video.map(d => <option key={d.deviceId || 'default'} value={d.deviceId}>{d.label || `Camera ${(d.deviceId || '').slice(0, 5)}`}</option>)
                  ) : (
                    <option value="">No Camera Detected / Allowed</option>
                  )}
                </select>
              </div>

              {/* Mic select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Microphone Input</label>
                <select 
                  value={selectedDevices.audioIn}
                  onChange={e => setSelectedDevices({ ...selectedDevices, audioIn: e.target.value })}
                  style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '13px', background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
                >
                  {devices.audioIn.length > 0 ? (
                    devices.audioIn.map(d => <option key={d.deviceId || 'default'} value={d.deviceId}>{d.label || `Microphone ${(d.deviceId || '').slice(0, 5)}`}</option>)
                  ) : (
                    <option value="">No Microphone Detected / Allowed</option>
                  )}
                </select>
              </div>

              {/* Speaker select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Speaker Output</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    value={selectedDevices.audioOut}
                    onChange={e => setSelectedDevices({ ...selectedDevices, audioOut: e.target.value })}
                    style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '13px', background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
                  >
                    {devices.audioOut.length > 0 ? (
                      devices.audioOut.map(d => <option key={d.deviceId || 'default'} value={d.deviceId}>{d.label || `Speaker ${(d.deviceId || '').slice(0, 5)}`}</option>)
                    ) : (
                      <option value="">System Default Speaker</option>
                    )}
                  </select>
                  <Button variant="outline" size="sm" onClick={playTestSound} leftIcon={<Volume2 size={14} />}>Test</Button>
                </div>
              </div>
            </div>

            {/* Join Room CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', border: '1px solid var(--color-primary-light)' }}>
                <Shield size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  Only invited participants can join this encrypted channel. Camera and microphone permissions will be requested on call startup.
                </p>
              </div>
              <Button variant="primary" style={{ padding: '12px' }} leftIcon={<Play size={16} />} onClick={handleJoinCall}>
                Join Interview Room
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
