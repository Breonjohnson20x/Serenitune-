import React, { useState, useEffect } from 'react';
import { tracksAPI } from '../services/api';
import { useAudioPlayer } from '../contexts/AudioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Play, 
  Pause, 
  Music, 
  Search, 
  Clock, 
  Heart,
  Plus,
  Star,
  Filter
} from 'lucide-react';

const Library = () => {
  const [tracks, setTracks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Use the audio player context
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudioPlayer();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all tracks
        const tracksResponse = await tracksAPI.getAllTracks();
        setTracks(tracksResponse.data.tracks);
        
        // Fetch categories
        const categoriesResponse = await tracksAPI.getCategories();
        setCategories(categoriesResponse.data.categories);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching library data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlayPause = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Filter tracks based on search query and active category
  const filteredTracks = tracks.filter((track) => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         track.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || track.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Sound Library</h1>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tracks..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          className="mr-2 whitespace-nowrap"
          onClick={() => handleCategoryChange('all')}
        >
          All Tracks
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            className="mr-2 whitespace-nowrap capitalize"
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Tracks List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center p-4 border-b">
                  <Skeleton className="h-12 w-12 rounded-md mr-4" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : filteredTracks.length > 0 ? (
            <div className="divide-y">
              {filteredTracks.map((track) => (
                <div 
                  key={track.id} 
                  className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${
                    currentTrack && currentTrack.id === track.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="h-12 w-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-md flex items-center justify-center mr-4">
                    <Music className="h-6 w-6 text-indigo-400" />
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
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-full hover:bg-indigo-100 hover:text-indigo-600"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-full hover:bg-indigo-100 hover:text-indigo-600"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant={currentTrack && currentTrack.id === track.id && isPlaying ? 'default' : 'outline'}
                      className="rounded-full"
                      onClick={() => handlePlayPause(track)}
                    >
                      {currentTrack && currentTrack.id === track.id && isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Music className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No tracks found</h3>
              <p className="text-gray-500 max-w-md">
                {searchQuery 
                  ? `No tracks matching "${searchQuery}" in the ${activeCategory === 'all' ? 'library' : activeCategory + ' category'}.` 
                  : 'No tracks available in this category.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Library;

