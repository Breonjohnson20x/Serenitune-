import React from 'react';

const AnimatedBackground = ({ children, className = '' }) => {
  return (
    <div className={`bg-animated-gradient ${className}`}>
      {children}
    </div>
  );
};

// Particle animation component for more subtle effects
export const ParticleBackground = ({ children, density = 'medium', className = '' }) => {
  // Generate random particles based on density
  const generateParticles = () => {
    const particleCount = density === 'low' ? 15 : density === 'medium' ? 30 : 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 4 + 1; // 1-5px
      const opacity = Math.random() * 0.5 + 0.1; // 0.1-0.6
      const duration = Math.random() * 20 + 10; // 10-30s
      const delay = Math.random() * 5; // 0-5s
      
      const style = {
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      };
      
      particles.push(
        <div 
          key={i} 
          className="absolute rounded-full bg-white pointer-events-none animate-float" 
          style={style} 
        />
      );
    }
    
    return particles;
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {generateParticles()}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedBackground;

