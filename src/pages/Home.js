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
            responseType: 'arraybuffer',
            maxRedirects: 0,  // 리다이렉트 방지
            validateStatus: function (status) {
              return status >= 200 && status < 300; // 기본값
            }
          });
          
          const blob = new Blob([response.data], { type: 'image/jpeg' });
          const imageObjectURL = URL.createObjectURL(blob);
          setImageBlob(imageObjectURL);

          setText("안녕하세요?")
          setIsLoading(false);
          setShowContent(true);
        } catch (err) {
          console.error('Error fetching image:', err);
          if (err.response) {
            // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
            setError(`서버 에러: ${err.response.status}`);
          } else if (err.request) {
            // 요청이 전송되었지만 응답을 받지 못한 경우
            setError('서버로부터 응답이 없습니다.');
          } else {
            // 요청 설정 중에 오류가 발생한 경우
            setError('요청 설정 중 오류가 발생했습니다.');
          }
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