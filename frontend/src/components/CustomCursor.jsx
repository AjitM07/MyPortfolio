import { useEffect, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  // Mouse coords to track instantly
  const mouseCoords = useRef({ x: 0, y: 0 });
  // Ring coords to track with a LERP delay
  const ringCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseCoords.current = { x: e.clientX, y: e.clientY };
      
      // Move the dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Butter-smooth frame loop for LERP transition of the ring
    let animationFrameId;
    
    const updateRingPosition = () => {
      const ease = 0.15; // Delay factor (lower = slower/more delay, higher = faster)
      
      const dx = mouseCoords.current.x - ringCoords.current.x;
      const dy = mouseCoords.current.y - ringCoords.current.y;
      
      ringCoords.current.x += dx * ease;
      ringCoords.current.y += dy * ease;
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringCoords.current.x}px, ${ringCoords.current.y}px, 0)`;
      }
      
      animationFrameId = requestAnimationFrame(updateRingPosition);
    };

    updateRingPosition();

    // Hover state listener to highlight links & interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' ||
        target.closest('.glass-button') ||
        target.closest('.nav-item') ||
        target.closest('a') ||
        target.closest('button');

      if (isInteractive) {
        ringRef.current?.classList.add('hovered');
        dotRef.current?.classList.add('hovered');
      } else {
        ringRef.current?.classList.remove('hovered');
        dotRef.current?.classList.remove('hovered');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
};

export default CustomCursor;
