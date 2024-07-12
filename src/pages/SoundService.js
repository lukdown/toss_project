import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/SoundService.css';

const SoundService = ({ audioId }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAudio = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 실제 API 호출 대신 임시 URL 사용
        // const response = await axios.get(`/api/audio/${audioId}`, {
        //   responseType: 'blob'
        // });
        // const url = URL.createObjectURL(response.data);
        const url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        setAudioUrl(url);
      } catch (error) {
        console.error('Error fetching audio:', error);
        setError('오디오를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (audioId) {
      fetchAudio();
    }

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioId]);

  if (isLoading) return <div></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="sound-service">
      {audioUrl && (
        <audio controls className="audio-player">
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default SoundService;