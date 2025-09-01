import React, { useRef, useEffect } from 'react';

const WaveformVisualizer = ({ 
  audioContext, 
  audioElement, 
  height = 100, 
  barWidth = 2, 
  barGap = 1, 
  barColor = 'gradient', // 'gradient', 'primary', 'secondary', 'accent'
  smoothingTimeConstant = 0.8,
  fftSize = 256
}) => {
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const dataArrayRef = useRef(null);
  
  // Initialize audio analyzer
  useEffect(() => {
    if (!audioContext || !audioElement) return;
    
    // Create analyzer if it doesn't exist
    if (!analyserRef.current) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothingTimeConstant;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
    }
    
    // Start animation
    animationRef.current = requestAnimationFrame(updateCanvas);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioContext, audioElement, fftSize, smoothingTimeConstant]);
  
  // Update canvas with audio data
  const updateCanvas = () => {
    if (!analyserRef.current || !dataArrayRef.current || !canvasRef.current) {
      animationRef.current = requestAnimationFrame(updateCanvas);
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const canvasHeight = canvas.height;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    ctx.clearRect(0, 0, width, canvasHeight);
    
    // Set up gradient or solid color
    let fillStyle;
    if (barColor === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#1F3A8A');  // Indigo
      gradient.addColorStop(0.5, '#939CE2'); // Lilac
      gradient.addColorStop(1, '#B9A0E2');  // Soft Lavender
      fillStyle = gradient;
    } else if (barColor === 'primary') {
      fillStyle = '#1F3A8A'; // Indigo
    } else if (barColor === 'secondary') {
      fillStyle = '#939CE2'; // Lilac
    } else if (barColor === 'accent') {
      fillStyle = '#B9A0E2'; // Soft Lavender
    } else {
      fillStyle = barColor; // Custom color
    }
    
    ctx.fillStyle = fillStyle;
    
    // Calculate total width needed for all bars
    const totalBars = dataArrayRef.current.length;
    const totalBarWidth = (barWidth + barGap) * totalBars - barGap;
    
    // Center the bars horizontally
    let x = (width - totalBarWidth) / 2;
    
    // Draw bars
    for (let i = 0; i < totalBars; i++) {
      const barHeight = (dataArrayRef.current[i] / 255) * canvasHeight * 0.8;
      
      // Draw bar
      ctx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight);
      
      // Move to next bar position
      x += barWidth + barGap;
    }
    
    animationRef.current = requestAnimationFrame(updateCanvas);
  };
  
  // Simple waveform animation when no audio is playing
  const renderPlaceholderWaveform = () => {
    return (
      <div className="waveform h-full w-full flex items-center justify-center">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="waveform-bar"
            style={{ 
              backgroundColor: barColor === 'gradient' ? '#939CE2' : barColor,
              width: `${barWidth}px`,
              margin: `0 ${barGap}px`
            }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="relative w-full h-full">
      {(!audioContext || !audioElement) && renderPlaceholderWaveform()}
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={height} 
        className="w-full h-full"
      />
    </div>
  );
};

export default WaveformVisualizer;

