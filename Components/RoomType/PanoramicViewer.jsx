"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as PANOLENS from 'panolens';
import '@/CSS/Panoramic.css';

const PanoramicViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const viewer = new PANOLENS.Viewer({
      container: viewerRef.current,
      autoRotate: true,
      autoRotateSpeed: 0.3,
      controlBar: false, // Disable the default control bar
    });

    const panorama = new PANOLENS.ImagePanorama(imageUrl);
    viewer.add(panorama);

    return () => {
      viewer.dispose();
    };
  }, [imageUrl]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <div 
        ref={viewerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative'
        }}
      />
      
      {/* Custom fullscreen button */}
      <button
        onClick={toggleFullscreen}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.5)',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          padding: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isFullscreen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16V8H16V16H8Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M4 20V16M8 20H4M20 4H16M20 8V4M4 8V4M4 4H8M20 20V16M20 20H16" stroke="currentColor" strokeWidth="2"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16V8H16V16H8Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 4H20V8M20 16V20H16M8 20H4V16M4 8V4H8" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default PanoramicViewer;