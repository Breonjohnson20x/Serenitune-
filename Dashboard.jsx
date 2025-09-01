import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tracksAPI, playlistsAPI } from '../services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Play, 
  Plus, 
  Music, 
  ListMusic, 
  Heart, 
  Clock, 
  Headphones,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tracks
        setIsLoadingTracks(true);
        const tracksResponse = await tracksAPI.getAllTracks();
        setTracks(tracksResponse.data.tracks);
        setIsLoadingTracks(false);

        // Fetch user playlists
        setIsLoadingPlaylists(true);
        const playlistsResponse = await playlistsAPI.getUserPlaylists();
        setPlaylists(playlistsResponse.data.playlists);
        setIsLoadingPlaylists(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoadingTracks(false);
        setIsLoadingPlaylists(false);
      }
    };

    fetchData();
  }, []);

  // Group tracks by category
  const tracksByCategory = tracks.reduce((acc, track) => {
    if (!acc[track.category]) {
      acc[track.category] = [];
    }
    acc[track.category].push(track);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}!</h1>
            <p className="text-indigo-100">
              Continue your sound therapy journey with Serenitune.
            </p>
          </div>
          <div className="flex space-x-4">
            <Button variant="secondary" className="bg-white text-indigo-700 hover:bg-indigo-100">
              <Play className="mr-2 h-4 w-4" />
              Quick Play
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
              <Plus className="mr-2 h-4 w-4" />
              New Playlist
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="playlists">Your Playlists</TabsTrigger>
        </TabsList>

        {/* Featured Tab */}
        <TabsContent value="featured" className="space-y-6">
          <h2 className="text-2xl font-semibold mt-6 flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-indigo-600" />
            Featured Tracks
          </h2>
          
          {isLoadingTracks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <Skeleton className="h-40 w-full" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.slice(0, 6).map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )}
          
          <h2 className="text-2xl font-semibold mt-10 flex items-center">
            <ListMusic className="mr-2 h-5 w-5 text-indigo-600" />
            Recent Playlists
          </h2>
          
          {isLoadingPlaylists ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : playlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {playlists.slice(0, 4).map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <ListMusic className="h-12 w-12 text-indigo-300 mb-4" />
                <p className="text-center text-gray-500">You haven't created any playlists yet.</p>
                <Button className="mt-4" asChild>
                  <Link to="/create-playlist">Create Your First Playlist</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          {isLoadingTracks ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-8 w-1/4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((j) => (
                      <Card key={j} className="overflow-hidden">
                        <CardHeader className="p-0">
                          <Skeleton className="h-40 w-full" />
                        </CardHeader>
                        <CardContent className="p-6">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(tracksByCategory).map(([category, categoryTracks]) => (
                <div key={category} className="space-y-4">
                  <h2 className="text-2xl font-semibold capitalize flex items-center">
                    <Music className="mr-2 h-5 w-5 text-indigo-600" />
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryTracks.map((track) => (
                      <TrackCard key={track.id} track={track} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Playlists Tab */}
        <TabsContent value="playlists" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Your Playlists</h2>
            <Button asChild>
              <Link to="/create-playlist">
                <Plus className="mr-2 h-4 w-4" />
                New Playlist
              </Link>
            </Button>
          </div>
          
          {isLoadingPlaylists ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : playlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12">
                <ListMusic className="h-16 w-16 text-indigo-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">No playlists yet</h3>
                <p className="text-center text-gray-500 mb-6">
                  Create your first playlist to organize your favorite sound therapy tracks.
                </p>
                <Button size="lg" asChild>
                  <Link to="/create-playlist">Create Your First Playlist</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Track Card Component
const TrackCard = ({ track }) => {
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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
          <Music className="h-16 w-16 text-indigo-400" />
        </div>
        <div className="absolute top-4 right-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(track.category)}`}>
            {track.category}
          </span>
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
          <Button size="sm" variant="outline" className="rounded-full">
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Playlist Card Component
const PlaylistCard = ({ playlist }) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>{playlist.title}</CardTitle>
        <CardDescription>{playlist.track_count} tracks</CardDescription>
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
        <Button size="sm">
          <Play className="h-4 w-4 mr-2" />
          Play
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Dashboard;

