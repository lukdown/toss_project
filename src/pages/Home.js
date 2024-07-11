import React, { useState, useEffect, useRef } from 'react';
import './css/Home.css'
import axios from 'axios';
import SoundService from './SoundService';
import TypeWriter from './TypeWriter';

function Home() {
  const [imageBlob, setImageBlob] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const effectRan = useRef(false);
  
  const [showContent, setShowContent] = useState(false);
  const [audioId, setAudioId] = useState(null);
  const [text, setText] = useState('');

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchImage = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get('http://127.0.0.1:8000/random-image-generator', {
            responseType: 'arraybuffer'
          });
          const blob = new Blob([response.data], { type: 'image/jpeg' });
          const imageObjectURL = URL.createObjectURL(blob);
          setImageBlob(imageObjectURL);

          setText("안녕하세요?")
          setIsLoading(false);
          setShowContent(true);
        } catch (err) {
          setError('이미지를 불러오는 데 실패했습니다.');
          setIsLoading(false);
        }
      };
      fetchImage();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imageBlob) {
        URL.revokeObjectURL(imageBlob);
      }
    };
  }, [imageBlob]);

  return (
    <div className="home-image-container">
      <div className="home-image-box">
        {loading ? (
          <div>이미지 로딩 중...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <img src={imageBlob} alt="연습 이미지" />
        )}
      </div>

      {loading && (  
        <div className="home-loading">
          <div className="home-loading-spinner"></div>
          <p>로딩 중...</p>
        </div>
      )}

      {showContent && (
        <div className="home-toss-recommendation">
          <div className="home-toss-header">
            <h3>ToSS의 추천</h3>
            <SoundService audioId={audioId} />
          </div>
          <div className="home-toss-content">
            <TypeWriter text={text} speed={40} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;