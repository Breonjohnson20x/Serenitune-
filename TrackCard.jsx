import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Music, 
  Clock, 
  Heart,
  Plus,
  Check
} from 'lucide-react';

const TrackCard = ({ 
  track, 
  isPlaying = false, 
  onPlay, 
  onAddToPlaylist, 
  isInPlaylist = false,
  variant = 'default' // 'default', 'compact', or 'list'
}) => {
  const getCategoryColor = (category) => {
    const colors = {
      relax: 'bg-blue-100 text-blue-700',
      focus: 'bg-amber-100 text-amber-700',
      sleep: 'bg-purple-100 text-purple-700',
      lofi: 'bg-green-100 text-green-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Default card variant
  if (variant === 'default') {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md group">
        <div className="relative">
          <div className="h-40 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
            <Music className="h-16 w-16 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
          </div>
          <div className="absolute top-4 right-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(track.category)}`}>
              {track.category}
            </span>
          </div>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              size="icon" 
              className="rounded-full h-12 w-12 bg-white/80 hover:bg-white shadow-lg"
              onClick={() => onPlay && onPlay(track)}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-indigo-600" />
              ) : (
                <Play className="h-6 w-6 text-indigo-600" />
              )}
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">{track.title}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4">{track.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatDuration(track.duration)}</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="rounded-full hover:bg-indigo-50 hover:text-indigo-600"
                onClick={() => {}}
              >
                <Heart className="h-4 w-4" />
              </Button>
              {onAddToPlaylist && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`rounded-full ${isInPlaylist ? 'bg-indigo-50 text-indigo-600' : ''}`}
                  onClick={() => onAddToPlaylist(track)}
                  disabled={isInPlaylist}
                >
                  {isInPlaylist ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Plus className="h-4 w-4 mr-1" />
                  )}
                  {isInPlaylist ? 'Added' : 'Add'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Compact card variant
  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="flex p-4">
          <div className="h-16 w-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-md flex items-center justify-center mr-4">
            <Music className="h-8 w-8 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{track.title}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Badge variant="outline" className="mr-2 capitalize">
                {track.category}
              </Badge>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(track.duration)}
              </span>
            </div>
          </div>
          <Button 
            size="icon" 
            variant={isPlaying ? "default" : "outline"}
            className="rounded-full"
            onClick={() => onPlay && onPlay(track)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>
    );
  }
  
  // List item variant
  return (
    <div 
      className={`flex items-center p-4 hover:bg-gray-50 transition-colors border-b ${
        isPlaying ? 'bg-indigo-50' : ''
      }`}
    >
      <div className="h-10 w-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-md flex items-center justify-center mr-4">
        <Music className="h-5 w-5 text-indigo-400" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{track.title}</h3>
        <div className="flex items-center text-xs text-gray-500">
          <Badge variant="outline" className="mr-2 text-xs capitalize">
            {track.category}
          </Badge>
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDuration(track.duration)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          size="icon" 
          variant="ghost" 
          className="rounded-full hover:bg-indigo-100 hover:text-indigo-600"
        >
          <Heart className="h-4 w-4" />
        </Button>
        {onAddToPlaylist && (
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full hover:bg-indigo-100 hover:text-indigo-600"
            onClick={() => onAddToPlaylist(track)}
            disabled={isInPlaylist}
          >
            {isInPlaylist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        )}
        <Button 
          size="icon" 
          variant={isPlaying ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onPlay && onPlay(track)}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TrackCard;

