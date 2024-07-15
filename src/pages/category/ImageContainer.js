import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ImageContainer({ category, setImageFile }) {
  const [imageBlob, setImageBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('text', category);

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
        const fileName = 'category_image.jpg';
        const file = new File([response.data], fileName, { type: response.data.type });

        if (isMounted) {
          setImageBlob(imageObjectURL);
          setImageFile(file);  // 부모 컴포넌트의 상태 업데이트
          setIsLoading(false);
        }
      } catch (err) {
        console.error("이미지 로딩 중 오류 발생:", err);
        if (isMounted) {
          setError(`이미지 로딩 실패: ${err.message}`);
          setIsLoading(false);
        }
      }
    };

    if (category) {
      fetchImage();
    }

    return () => {
      isMounted = false;
      if (imageBlob) {
        URL.revokeObjectURL(imageBlob);
      }
    };
  }, [category, setImageFile]);

  if (!category) {
    return <div>카테고리를 선택해주세요.</div>;
  }

  if (isLoading) {
    return (
      <div>
        <div className="loader"></div>
        <p className="loading-text">이미지 로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="image-container">
      {imageBlob && (
        <img 
          src={imageBlob} 
          alt={`${category} 관련 이미지`} 
          onLoad={() => console.log("이미지 로딩 완료")}
          onError={(e) => {
            console.error("이미지 로딩 실패", e);
            setError("이미지 로딩에 실패했습니다.");
          }}
        />
      )}
    </div>
  );
}

export default ImageContainer;