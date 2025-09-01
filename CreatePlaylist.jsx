import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tracksAPI, playlistsAPI } from '../services/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import PlaylistBuilder from '@/components/PlaylistBuilder';
import { GradientBackground } from '@/components/GradientBackground';

const CreatePlaylist = () => {
  const [availableTracks, setAvailableTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true);
        const response = await tracksAPI.getAllTracks();
        setAvailableTracks(response.data.tracks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tracks:', error);
        setError('Failed to load tracks. Please try again.');
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const handleSavePlaylist = async (playlist) => {
    try {
      setIsSaving(true);
      setError('');

      // Create the playlist
      const playlistResponse = await playlistsAPI.createPlaylist({
        title: playlist.title,
        description: playlist.description,
        is_public: true // Default to public for now
      });

      const playlistId = playlistResponse.data.playlist.id;

      // Add tracks to the playlist
      for (const trackItem of playlist.tracks) {
        await playlistsAPI.addTrackToPlaylist(playlistId, trackItem.track_id);
      }

      // Reorder tracks if needed
      if (playlist.tracks.length > 1) {
        const trackOrder = playlist.tracks.map(item => item.track_id);
        await playlistsAPI.reorderPlaylistTracks(playlistId, trackOrder);
      }

      // Navigate to the new playlist
      navigate(`/playlists/${playlistId}`);
    } catch (error) {
      console.error('Error saving playlist:', error);
      setError('Failed to save playlist. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Create Playlist</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <GradientBackground variant="subtle" className="p-6 rounded-lg">
        <PlaylistBuilder 
          availableTracks={availableTracks}
          initialPlaylistTracks={[]}
          onSave={handleSavePlaylist}
          isLoading={isSaving}
        />
      </GradientBackground>
    </div>
  );
};

export default CreatePlaylist;

