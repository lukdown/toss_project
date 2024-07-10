import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import TossRecommendationContent from './TossRecommendationContent';
import './css/TossRecommendation.css';

function TossRecommendation() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [audioId, setAudioId] = useState(null);
  const [recommendationInfo, setRecommendationInfo] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImage(URL.createObjectURL(file));
      setLoading(true);
      setShowContent(false);
      setRecommendationInfo(null);
      
      // 실제 API 호출을 시뮬레이션합니다.
      setTimeout(() => {
        setLoading(false);
        setShowContent(true);
        setAudioId('some-audio-id');
      }, 3000);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {'image/*': []},
    multiple: false  // 한 번에 하나의 파일만 허용
  });

  const resetImage = () => {
    setImage(null);
    setLoading(false);
    setShowContent(false);
    setAudioId(null);
    setRecommendationInfo(null);
  };

  const handleRecommendationComplete = (info) => {
    setRecommendationInfo(info);
  };

  return (
    <div className="toss-recommendation">
      <h1>사진 보고 Toss 추천 받기</h1>
      
      {!image ? (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>여기에 사진을 놓으세요...</p> :
              <p>이곳을 클릭하거나 사진을 끌어다 놓으세요</p>
          }
        </div>
      ) : (
        <div>
          <div className="image-container">
            <img 
              src={image} 
              alt="Uploaded" 
              className="uploaded-image"
            />
          </div>
          <button onClick={resetImage} className="reset-button">다시하기</button>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>로딩 중...</p>
        </div>
      )}
      
      {showContent && (
        <TossRecommendationContent 
          audioId={audioId} 
          image={image}
          onRecommendationComplete={handleRecommendationComplete}
        />
      )}

      {recommendationInfo && (
        <div className="recommendation-result">
          <h2>Toss의 추천</h2>
          <p>{recommendationInfo.recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default TossRecommendation;