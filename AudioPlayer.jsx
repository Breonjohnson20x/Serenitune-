import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = ({ track, onEnded, onNext, onPrevious, autoplay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [showVisualization, setShowVisualization] = useState(true);
  
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Initialize audio context and analyser
  useEffect(() => {
    if (!audioRef.current) return;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const analyserNode = context.createAnalyser();
    analyserNode.fftSize = 256;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArr = new Uint8Array(bufferLength);
    
    const source = context.createMediaElementSource(audioRef.current);
    source.connect(analyserNode);
    analyserNode.connect(context.destination);
    
    setAudioContext(context);
    setAnalyser(analyserNode);
    setDataArray(dataArr);
    
    return () => {
      if (context.state !== 'closed') {
        context.close();
      }
    };
  }, [track?.id]);
  
  // Handle track change
  useEffect(() => {
    if (track && audioRef.current) {
      audioRef.current.src = track.audio_url;
      setCurrentTime(0);
      
      if (autoplay) {
        audioRef.current.play().catch(error => {
          console.error('Autoplay prevented:', error);
        });
      }
    }
  }, [track, autoplay]);
  
  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Playback prevented:', error);
          setIsPlaying(false);
        });
        animationRef.current = requestAnimationFrame(updateCanvas);
      } else {
        audioRef.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Audio event handlers
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };
  
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onEnded) onEnded();
  };
  
  const handlePlayPause = () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    if (isMuted && value[0] > 0) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Format time in MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Audio visualization
  const updateCanvas = () => {
    if (!analyser || !dataArray || !canvasRef.current || !showVisualization) {
      animationRef.current = requestAnimationFrame(updateCanvas);
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    analyser.getByteFrequencyData(dataArray);
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#1F3A8A');  // Indigo
    gradient.addColorStop(0.5, '#939CE2'); // Lilac
    gradient.addColorStop(1, '#B9A0E2');  // Soft Lavender
    
    const barWidth = (width / dataArray.length) * 2.5;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * height * 0.8;
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
    
    animationRef.current = requestAnimationFrame(updateCanvas);
  };
  
  const toggleVisualization = () => {
    setShowVisualization(!showVisualization);
  };
  
  if (!track) return null;
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Track Info */}
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-medium">{track.title?.charAt(0) || 'T'}</span>
            </div>
            <div>
              <h3 className="font-medium">{track.title}</h3>
              <p className="text-sm text-gray-500 capitalize">{track.category}</p>
            </div>
          </div>
          
          {/* Visualization */}
          {showVisualization && (
            <div className="h-24 w-full bg-gray-50 rounded-md overflow-hidden">
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={100} 
                className="w-full h-full"
              />
            </div>
          )}
          
          {/* Audio Element (hidden) */}
          <audio
            ref={audioRef}
            src={track.audio_url}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          />
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={onPrevious}
                disabled={!onPrevious}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button 
                variant={isPlaying ? "default" : "outline"}
                size="icon" 
                className="rounded-full h-12 w-12"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={onNext}
                disabled={!onNext}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={toggleVisualization}
            >
              {showVisualization ? 'Hide' : 'Show'} Visualization
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;

