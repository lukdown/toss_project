import React, { useState, useEffect } from 'react';
import './css/Home.css'
import axios from 'axios';

function Home() {
  const [imageBlob, setImageBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/get-image', {
          responseType: 'blob'
        });
        const imageObjectURL = URL.createObjectURL(response.data);
        setImageBlob(imageObjectURL);
        setIsLoading(false);
      } catch (err) {
        setError('이미지를 불러오는 데 실패했습니다.');
        setIsLoading(false);
      }
    };

    fetchImage();

    return () => {
      if (imageBlob) {
        URL.revokeObjectURL(imageBlob);
      }
    };
  }, []);

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