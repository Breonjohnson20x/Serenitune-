import React, { useState } from 'react';
import { useAudioPlayer } from '../contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';

const GlobalAudioPlayer = () => {
  const { 
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    playNextTrack,
    playPreviousTrack,
    formatTime,
    showPlayer,
    setShowPlayer,
    audioRef,
    audioContext,
  } = useAudioPlayer();
  
  const [expanded, setExpanded] = useState(false);
  const [showVisualization, setShowVisualization] = useState(true);
  
  if (!showPlayer || !currentTrack) return null;
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const toggleVisualization = () => {
    setShowVisualization(!showVisualization);
  };
  
  const handleSeek = (value) => {
    seek(value[0]);
  };
  
  const handleVolumeChange = (value) => {
    setVolume(value[0]);
  };
  
  const handleClose = () => {
    setShowPlayer(false);
  };
  
  // Compact player (minimized)
  if (!expanded) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-indigo-100 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center">
          {/* Track Info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-medium">{currentTrack.title?.charAt(0) || 'T'}</span>
            </div>
            <div className="truncate">
              <h3 className="font-medium truncate">{currentTrack.title}</h3>
              <p className="text-xs text-gray-500 capitalize">{currentTrack.category}</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hidden sm:flex"
              onClick={playPreviousTrack}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button 
              variant={isPlaying ? "default" : "outline"}
              size="icon" 
              className="rounded-full"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hidden sm:flex"
              onClick={playNextTrack}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Time and Progress (medium screens) */}
          <div className="hidden md:flex items-center space-x-2 flex-1">
            <span className="text-xs text-gray-500 w-8">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full mx-2"
            />
            <span className="text-xs text-gray-500 w-8">{formatTime(duration)}</span>
          </div>
          
          {/* Volume (large screens) */}
          <div className="hidden lg:flex items-center space-x-2 ml-4">
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
          
          {/* Expand/Close Buttons */}
          <div className="flex items-center space-x-1 ml-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={toggleExpanded}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Expanded player
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-indigo-100 shadow-lg z-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Visualization */}
        {showVisualization && (
          <div className="h-32 bg-gray-50 rounded-lg overflow-hidden mb-4">
            <WaveformVisualizer 
              audioContext={audioContext}
              audioElement={audioRef.current}
              height={128}
            />
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center">
          {/* Track Info */}
          <div className="flex items-center space-x-4 mb-4 sm:mb-0 sm:flex-1">
            <div className="h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xl font-medium">{currentTrack.title?.charAt(0) || 'T'}</span>
            </div>
            <div>
              <h3 className="text-lg font-medium">{currentTrack.title}</h3>
              <p className="text-sm text-gray-500 capitalize">{currentTrack.category}</p>
            </div>
          </div>
          
          {/* Controls and Progress */}
          <div className="flex flex-col w-full sm:w-auto sm:flex-1">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={playPreviousTrack}
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              
              <Button 
                variant={isPlaying ? "default" : "outline"}
                size="icon" 
                className="rounded-full h-12 w-12"
                onClick={togglePlayPause}
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
                onClick={playNextTrack}
              >
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs text-gray-500 w-8">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <span className="text-xs text-gray-500 w-8">{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Volume and Options */}
          <div className="flex items-center space-x-4 mt-4 sm:mt-0 sm:ml-4">
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
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={toggleVisualization}
            >
              {showVisualization ? 'Hide' : 'Show'} Visualization
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={toggleExpanded}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalAudioPlayer;

