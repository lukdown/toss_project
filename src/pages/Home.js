import React, { useState, useEffect, useRef } from 'react';
import './css/Home.css'
import axios from 'axios';

function Home() {
  const [imageBlob, setImageBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const effectRan = useRef(false);

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
          setIsLoading(false);
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
    // 컴포넌트가 언마운트될 때 URL 객체를 해제합니다.
    return () => {
      if (imageBlob) {
        URL.revokeObjectURL(imageBlob);
      }
    };
  }, [imageBlob]);

  return (
    <div className="image-container">
      <div className="image-box">
        {isLoading ? (
          <div>이미지 로딩 중...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <img src={imageBlob} alt="연습 이미지" />
        )}
      </div>
    </div>
  );
}

export default Home;