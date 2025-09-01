import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  ListMusic, 
  Share2, 
  Clock,
  Music
} from 'lucide-react';

const PlaylistCard = ({ 
  playlist, 
  onPlay, 
  onShare,
  variant = 'default' // 'default', 'compact', or 'featured'
}) => {
  // Format the total duration of the playlist
  const formatTotalDuration = () => {
    if (!playlist.tracks || playlist.tracks.length === 0) {
      return '0:00';
    }
    
    const totalSeconds = playlist.tracks.reduce((total, item) => {
      return total + (item.track?.duration || 0);
    }, 0);
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Default card variant
  if (variant === 'default') {
    return (
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="truncate">{playlist.title}</CardTitle>
          <CardDescription>
            {playlist.track_count || playlist.tracks?.length || 0} tracks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 line-clamp-2">
            {playlist.description || 'No description provided'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/playlists/${playlist.id}`}>
              <ListMusic className="h-4 w-4 mr-2" />
              View
            </Link>
          </Button>
          <Button size="sm" onClick={() => onPlay && onPlay(playlist)}>
            <Play className="h-4 w-4 mr-2" />
            Play
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Compact card variant
  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="flex p-4">
          <div className="h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md flex items-center justify-center mr-4">
            <ListMusic className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{playlist.title}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="flex items-center mr-3">
                <Music className="h-3 w-3 mr-1" />
                {playlist.track_count || playlist.tracks?.length || 0} tracks
              </span>
              {(playlist.tracks?.length > 0) && (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTotalDuration()}
                </span>
              )}
            </div>
          </div>
          <Button 
            size="icon" 
            variant="outline"
            className="rounded-full"
            onClick={() => onPlay && onPlay(playlist)}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }
  
  // Featured card variant
  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative">
          <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
            <ListMusic className="h-16 w-16 text-white" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-xl font-bold text-white mb-1">{playlist.title}</h3>
            <div className="flex items-center text-sm text-white/80">
              <span className="flex items-center mr-3">
                <Music className="h-3 w-3 mr-1" />
                {playlist.track_count || playlist.tracks?.length || 0} tracks
              </span>
              {(playlist.tracks?.length > 0) && (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTotalDuration()}
                </span>
              )}
            </div>
          </div>
        </div>
        <CardFooter className="flex justify-between p-4">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/playlists/${playlist.id}`}>
              <ListMusic className="h-4 w-4 mr-2" />
              View
            </Link>
          </Button>
          <div className="flex space-x-2">
            {onShare && (
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onShare(playlist)}>
                <Share2 className="h-4 w-4" />
              </Button>
            )}
            <Button size="sm" onClick={() => onPlay && onPlay(playlist)}>
              <Play className="h-4 w-4 mr-2" />
              Play
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
};

export default PlaylistCard;

