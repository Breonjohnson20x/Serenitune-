import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // Use relative path for API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('serenitune_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('serenitune_token');
      localStorage.removeItem('serenitune_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  verifyToken: (token) => api.post('/auth/verify', { token }),
};

// Tracks API
export const tracksAPI = {
  getAllTracks: (params = {}) => api.get('/tracks', { params }),
  getTrack: (id) => api.get(`/tracks/${id}`),
  getCategories: () => api.get('/tracks/categories'),
  rateTrack: (id, rating) => api.post(`/tracks/${id}/rate`, { rating }),
  getUserRating: (id) => api.get(`/tracks/${id}/rating`),
};

// Playlists API
export const playlistsAPI = {
  getUserPlaylists: () => api.get('/playlists'),
  getPlaylist: (id) => api.get(`/playlists/${id}`),
  createPlaylist: (playlistData) => api.post('/playlists', playlistData),
  updatePlaylist: (id, playlistData) => api.put(`/playlists/${id}`, playlistData),
  deletePlaylist: (id) => api.delete(`/playlists/${id}`),
  addTrackToPlaylist: (id, trackId) => api.post(`/playlists/${id}/tracks`, { track_id: trackId }),
  removeTrackFromPlaylist: (playlistId, trackId) => api.delete(`/playlists/${playlistId}/tracks/${trackId}`),
  reorderPlaylistTracks: (id, trackOrder) => api.put(`/playlists/${id}/reorder`, { track_order: trackOrder }),
  getSharedPlaylist: (shareToken) => api.get(`/playlists/shared/${shareToken}`),
};

// Mood Sessions API
export const moodAPI = {
  createMoodSession: (sessionData) => api.post('/mood-sessions', sessionData),
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;

