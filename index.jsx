import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layout
import Layout from '../components/Layout';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Library from '../pages/Library';
import CreatePlaylist from '../pages/CreatePlaylist';
import PlaylistView from '../pages/PlaylistView';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Router Configuration
const createRouter = () => {
  return createBrowserRouter([
    // Public Routes
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <Register />
        </PublicRoute>
      ),
    },
    
    // Protected Routes
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "library",
          element: <Library />,
        },
        {
          path: "create-playlist",
          element: <CreatePlaylist />,
        },
        {
          path: "playlists/:id",
          element: <PlaylistView />,
        },
        {
          path: "edit-playlist/:id",
          element: <CreatePlaylist />, // Reuse CreatePlaylist component for editing
        },
        {
          path: "profile",
          element: <div>Profile Page (Coming Soon)</div>, // Placeholder
        },
        {
          path: "settings",
          element: <div>Settings Page (Coming Soon)</div>, // Placeholder
        },
      ],
    },
    
    // Shared Playlist Route (public)
    {
      path: "/shared/:token",
      element: <div>Shared Playlist View (Coming Soon)</div>, // Placeholder
    },
    
    // 404 Route
    {
      path: "*",
      element: <div>Page Not Found</div>, // Placeholder
    },
  ]);
};

export default createRouter;

