import React, { useState, useEffect } from 'react';
import axios from 'axios';

//
function ImageContainer() {
  const [imageBlob, setImageBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      try {
        // 이미지를 직접 가져오는 API 엔드포인트로 변경해야 합니다
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

    // 컴포넌트 언마운트 시 Blob URL 해제
    return () => {
      if (imageBlob) {
        URL.revokeObjectURL(imageBlob);
      }
    };
  }, []);

  if (isLoading) {
    return <div>이미지 로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="image-container">
      {imageBlob && <img src={imageBlob} alt="연습 이미지" />}
    </div>
  );
}

export default ImageContainer;