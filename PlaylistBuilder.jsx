import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAudioPlayer } from '../contexts/AudioContext';
import DraggableTrack from './DraggableTrack';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Music, 
  ListMusic, 
  Save, 
  Share2, 
  Play,
  Plus,
  Search,
  ArrowRight
} from 'lucide-react';

const PlaylistBuilder = ({ 
  availableTracks = [], 
  initialPlaylistTracks = [], 
  onSave,
  isLoading = false
}) => {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState(initialPlaylistTracks);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudioPlayer();
  
  // Handle track play
  const handlePlayTrack = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };
  
  // Handle adding track to playlist
  const handleAddTrack = (track) => {
    // Check if track is already in playlist
    const isTrackInPlaylist = playlistTracks.some(t => t.id === track.id);
    if (!isTrackInPlaylist) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  };
  
  // Handle removing track from playlist
  const handleRemoveTrack = (index) => {
    const newTracks = [...playlistTracks];
    newTracks.splice(index, 1);
    setPlaylistTracks(newTracks);
  };
  
  // Handle reordering tracks in playlist
  const moveTrack = useCallback((dragIndex, hoverIndex) => {
    setPlaylistTracks(prevTracks => {
      const newTracks = [...prevTracks];
      const draggedTrack = newTracks[dragIndex];
      
      // Remove the dragged track
      newTracks.splice(dragIndex, 1);
      
      // Insert it at the new position
      newTracks.splice(hoverIndex, 0, draggedTrack);
      
      return newTracks;
    });
  }, []);
  
  // Handle saving playlist
  const handleSavePlaylist = () => {
    if (!playlistName.trim()) {
      // Show error - playlist name is required
      return;
    }
    
    if (playlistTracks.length === 0) {
      // Show error - playlist must have at least one track
      return;
    }
    
    const playlist = {
      title: playlistName,
      description: playlistDescription,
      tracks: playlistTracks.map((track, index) => ({
        track_id: track.id,
        position: index
      }))
    };
    
    onSave(playlist);
  };
  
  // Filter available tracks based on search query
  const filteredTracks = availableTracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Playlist Details */}
        <Card>
          <CardHeader>
            <CardTitle>Playlist Details</CardTitle>
            <CardDescription>Create your custom sound therapy playlist</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="playlist-name">Playlist Name</Label>
              <Input
                id="playlist-name"
                placeholder="Enter playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="playlist-description">Description (Optional)</Label>
              <Textarea
                id="playlist-description"
                placeholder="Describe your playlist..."
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Available Tracks */}
        <Card>
          <CardHeader>
            <CardTitle>Available Tracks</CardTitle>
            <CardDescription>Browse and add tracks to your playlist</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tracks..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              {filteredTracks.length > 0 ? (
                <div className="divide-y">
                  {filteredTracks.map((track) => (
                    <div 
                      key={track.id} 
                      className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-10 w-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-md flex items-center justify-center mr-4">
                        <Music className="h-5 w-5 text-indigo-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{track.title}</h3>
                        <p className="text-sm text-gray-500 capitalize">{track.category}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="icon" 
                          variant={currentTrack && currentTrack.id === track.id && isPlaying ? 'default' : 'outline'}
                          className="rounded-full h-8 w-8"
                          onClick={() => handlePlayTrack(track)}
                        >
                          {currentTrack && currentTrack.id === track.id && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button 
                          size="icon" 
                          variant="outline"
                          className="rounded-full h-8 w-8"
                          onClick={() => handleAddTrack(track)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Music className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium mb-1">No tracks found</h3>
                  <p className="text-gray-500 text-sm">
                    {searchQuery ? 'Try a different search term' : 'No tracks available'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Playlist Tracks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Playlist Tracks</CardTitle>
              <CardDescription>
                {playlistTracks.length === 0 
                  ? 'Add tracks to your playlist' 
                  : `${playlistTracks.length} track${playlistTracks.length !== 1 ? 's' : ''} in playlist`}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              disabled={playlistTracks.length === 0}
              onClick={() => {
                // Play the first track in the playlist
                if (playlistTracks.length > 0) {
                  handlePlayTrack(playlistTracks[0]);
                }
              }}
            >
              <Play className="h-4 w-4" />
              <span>Preview</span>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {playlistTracks.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="divide-y">
                  {playlistTracks.map((track, index) => (
                    <DraggableTrack
                      key={`${track.id}-${index}`}
                      track={track}
                      index={index}
                      moveTrack={moveTrack}
                      isPlaying={currentTrack && currentTrack.id === track.id && isPlaying}
                      onPlay={handlePlayTrack}
                      onRemove={handleRemoveTrack}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center border-t">
                <ListMusic className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Your playlist is empty</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Add tracks from the library to create your custom sound therapy experience
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <ArrowRight className="h-4 w-4 mr-2 animate-bounce-horizontal" />
                  <span>Browse and add tracks from the library</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <Button variant="outline">Cancel</Button>
            <Button 
              onClick={handleSavePlaylist}
              disabled={playlistTracks.length === 0 || !playlistName.trim() || isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : 'Save Playlist'}</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DndProvider>
  );
};

export default PlaylistBuilder;

