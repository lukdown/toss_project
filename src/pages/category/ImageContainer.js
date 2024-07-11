import React, { useState, useEffect } from 'react';
import TossSaid from './TossSaid';
import axios from 'axios';

function ImageContainer({ category }) {
  // 상태 변수들 정의
  const [imageBlob, setImageBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 카테고리가 변경될 때마다 이미지 fetch
  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('text', category);
        // 카테고리에 해당하는 이미지 요청
        const response = await axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/text_to_cartgoryImage/',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob', 
        });
        const imageObjectURL = URL.createObjectURL(response.data);
        setImageBlob(imageObjectURL);
        setIsLoading(false);
        TossSaid(imageObjectURL)
      } catch (err) {
        setError(category);
        setIsLoading(false);
      }
    };

    if (category) {
      fetchImage();
    }

    // 컴포넌트 언마운트 시 Blob URL 해제
    return () => {
      if (imageBlob) {
        URL.revokeObjectURL(imageBlob);
      }
    };
  }, [category]);

  // 렌더링 로직
  if (!category) {
    return <div>카테고리를 선택해주세요.</div>;
  }

  if (isLoading) {
    return <div>이미지 로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="image-container">
      {imageBlob && <img src={imageBlob} alt={`${category} 관련 이미지`} />}
    </div>
  );
}

export default ImageContainer;