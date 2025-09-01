import React from 'react';

const GradientBackground = ({ 
  children, 
  variant = 'default', // 'default', 'subtle', 'vibrant', 'dark'
  className = '',
  animated = true,
  overlay = false
}) => {
  // Define gradient styles based on variant
  const getGradientStyle = () => {
    switch (variant) {
      case 'subtle':
        return 'from-indigo-50 via-white to-purple-50';
      case 'vibrant':
        return 'from-indigo-500 via-purple-500 to-indigo-400';
      case 'dark':
        return 'from-indigo-900 via-purple-900 to-indigo-800';
      default: // default
        return 'from-indigo-100 via-purple-100 to-indigo-50';
    }
  };
  
  // Define text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'vibrant':
      case 'dark':
        return 'text-white';
      default:
        return 'text-gray-900';
    }
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${getGradientStyle()} ${
          animated ? 'bg-animated-gradient' : ''
        }`}
      />
      
      {overlay && (
        <div className="absolute inset-0 bg-black/5" />
      )}
      
      <div className={`relative z-10 ${getTextColor()}`}>
        {children}
      </div>
    </div>
  );
};

// Particle Gradient Background
export const ParticleGradientBackground = ({ 
  children, 
  variant = 'default', 
  className = '',
  particleDensity = 'medium', // 'low', 'medium', 'high'
  particleColor = 'white' // 'white', 'primary', 'accent'
}) => {
  // Define gradient styles based on variant
  const getGradientStyle = () => {
    switch (variant) {
      case 'subtle':
        return 'from-indigo-50 via-white to-purple-50';
      case 'vibrant':
        return 'from-indigo-500 via-purple-500 to-indigo-400';
      case 'dark':
        return 'from-indigo-900 via-purple-900 to-indigo-800';
      default: // default
        return 'from-indigo-100 via-purple-100 to-indigo-50';
    }
  };
  
  // Define text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'vibrant':
      case 'dark':
        return 'text-white';
      default:
        return 'text-gray-900';
    }
  };
  
  // Define particle color
  const getParticleColor = () => {
    switch (particleColor) {
      case 'primary':
        return '#1F3A8A'; // Indigo
      case 'accent':
        return '#B9A0E2'; // Soft Lavender
      default:
        return 'white';
    }
  };
  
  // Generate random particles based on density
  const generateParticles = () => {
    const particleCount = 
      particleDensity === 'low' ? 15 : 
      particleDensity === 'medium' ? 30 : 50;
    
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 4 + 1; // 1-5px
      const opacity = Math.random() * 0.5 + 0.1; // 0.1-0.6
      const duration = Math.random() * 20 + 10; // 10-30s
      const delay = Math.random() * 5; // 0-5s
      
      const style = {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: getParticleColor(),
        opacity: opacity,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      };
      
      particles.push(
        <div 
          key={i} 
          className="absolute rounded-full pointer-events-none animate-float" 
          style={style} 
        />
      );
    }
    
    return particles;
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientStyle()}`}>
        {generateParticles()}
      </div>
      <div className={`relative z-10 ${getTextColor()}`}>
        {children}
      </div>
    </div>
  );
};

export default GradientBackground;

