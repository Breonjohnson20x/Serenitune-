import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Create context
const AudioPlayerContext = createContext();

// Custom hook to use the audio context
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

export const AudioPlayerProvider = ({ children }) => {
  // Audio state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  
  // Audio refs
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  
  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Clean up
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Initialize Web Audio API
  const initializeAudioContext = () => {
    if (audioContextRef.current) return;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      audioContextRef.current = context;
      
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      if (audioRef.current) {
        const source = context.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(context.destination);
        sourceRef.current = source;
      }
    } catch (error) {
      console.error('Failed to initialize Web Audio API:', error);
    }
  };
  
  // Event handlers
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };
  
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };
  
  const handleEnded = () => {
    if (playlist && playlist.tracks) {
      playNextTrack();
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };
  
  const handleError = (error) => {
    console.error('Audio playback error:', error);
    setIsPlaying(false);
  };
  
  // Player controls
  const playTrack = (track) => {
    if (!track) return;
    
    // Initialize audio context on first user interaction
    if (!audioContextRef.current) {
      initializeAudioContext();
    } else if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // If it's the same track, just toggle play/pause
    if (currentTrack && currentTrack.id === track.id) {
      togglePlayPause();
      return;
    }
    
    // Set new track
    setCurrentTrack(track);
    setShowPlayer(true);
    
    // Update audio source
    if (audioRef.current) {
      audioRef.current.src = track.audio_url;
      audioRef.current.play().catch(error => {
        console.error('Playback prevented:', error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };
  
  const togglePlayPause = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      audioRef.current.play().catch(error => {
        console.error('Playback prevented:', error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const seek = (time) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };
  
  const setVolumeLevel = (level) => {
    if (!audioRef.current) return;
    
    const newVolume = Math.max(0, Math.min(1, level));
    audioRef.current.volume = isMuted ? 0 : newVolume;
    setVolume(newVolume);
  };
  
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMuteState = !isMuted;
    audioRef.current.volume = newMuteState ? 0 : volume;
    setIsMuted(newMuteState);
  };
  
  // Playlist controls
  const playPlaylist = (newPlaylist, startIndex = 0) => {
    if (!newPlaylist || !newPlaylist.tracks || newPlaylist.tracks.length === 0) return;
    
    setPlaylist(newPlaylist);
    
    // Find the track to play
    const trackToPlay = newPlaylist.tracks[startIndex]?.track || newPlaylist.tracks[0]?.track;
    
    if (trackToPlay) {
      playTrack(trackToPlay);
    }
  };
  
  const playNextTrack = () => {
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) return;
    
    // Find current track index
    const currentIndex = playlist.tracks.findIndex(item => 
      item.track && currentTrack && item.track.id === currentTrack.id
    );
    
    if (currentIndex === -1) return;
    
    // Get next track
    const nextIndex = (currentIndex + 1) % playlist.tracks.length;
    const nextTrack = playlist.tracks[nextIndex].track;
    
    if (nextTrack) {
      playTrack(nextTrack);
    }
  };
  
  const playPreviousTrack = () => {
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) return;
    
    // Find current track index
    const currentIndex = playlist.tracks.findIndex(item => 
      item.track && currentTrack && item.track.id === currentTrack.id
    );
    
    if (currentIndex === -1) return;
    
    // Get previous track
    const prevIndex = (currentIndex - 1 + playlist.tracks.length) % playlist.tracks.length;
    const prevTrack = playlist.tracks[prevIndex].track;
    
    if (prevTrack) {
      playTrack(prevTrack);
    }
  };
  
  // Format time in MM:SS
  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Context value
  const value = {
    // State
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    playlist,
    showPlayer,
    
    // Audio elements
    audioRef,
    audioContext: audioContextRef.current,
    analyser: analyserRef.current,
    
    // Controls
    playTrack,
    togglePlayPause,
    seek,
    setVolume: setVolumeLevel,
    toggleMute,
    playPlaylist,
    playNextTrack,
    playPreviousTrack,
    formatTime,
    
    // UI controls
    setShowPlayer,
  };
  
  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default AudioPlayerProvider;

