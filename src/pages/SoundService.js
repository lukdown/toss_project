import React, { useState, useEffect, useRef } from 'react';
import './css/SoundService.css';

const SoundService = ({ audioId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch(`/api/audio/${audioId}`);
        if (!response.ok) {
          throw new Error('Audio fetch failed');
        }
        const blob = await response.blob();
        setAudioBlob(blob);
        audioRef.current.src = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    };

    if (audioId) {
      fetchAudio();
    }

    return () => {
      URL.revokeObjectURL(audioRef.current.src);
    };
  }, [audioId]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button 
      className="sound-button" 
      onClick={togglePlay} 
      disabled={!audioBlob}
      style={{ visibility: audioBlob ? 'visible' : 'hidden' }} // 추가
    >
      {isPlaying ? '🔊' : '🔇'}
    </button>
  );
};

export default SoundService;