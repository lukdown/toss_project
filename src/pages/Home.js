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
            maxRedirects: 0,
            validateStatus: function (status) {
              return status >= 200 && status < 300;
            }
          });
          
          const blob = new Blob([response.data], { type: 'image/png' });
          const imageObjectURL = URL.createObjectURL(blob);
          setImageBlob(imageObjectURL);

          // formData 생성 및 이미지 blob 추가
          const formData = new FormData();
          const file = new File([blob], 'generated_image.png', { type: 'image/png' });
          formData.append('file', file);

          // formData를 API 엔드포인트로 전송
          const discription = await axios.post('http://127.0.0.1:8000/image_description/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          setText(discription.data);
          setIsLoading(false);
          setShowContent(true);
        } catch (err) {
          console.error('Error fetching image:', err);
          if (err.response) {
            setError(`서버 에러: ${err.response.status}`);
          } else if (err.request) {
            setError('서버로부터 응답이 없습니다.');
          } else {
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
          <div></div>
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