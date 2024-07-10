import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import TossRecommendationContent from './TossRecommendationContent';
import SoundService from './SoundService';
import './css/TossRecommendation.css';
import axios from 'axios';

function TossRecommendation() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [audioId, setAudioId] = useState(null);
  const [recommendationInfo, setRecommendationInfo] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImage(URL.createObjectURL(file));
      setLoading(true);
      setShowContent(false);
      setRecommendationInfo(null);
      
      // 실제 API 호출을 시뮬레이션합니다.

      try {
      // FormData 객체 생성
      const formData = new FormData();
      formData.append('file', file);

      // API 호출
      const response = await axios({
        method: 'post',
        url:'http://127.0.0.1:9909/image_description/', 
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // API 응답 처리
      console.log(response.data)
      setLoading(false);
      setShowContent(true);// 응답에서 audioId를 가져옴
      setText(response.data)
      // 필요한 경우 다른 상태도 업데이트
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoading(false);
      // 에러 처리 (예: 사용자에게 에러 메시지 표시)
    }
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
  const [text, setText] = useState('');
  const fullText = text;

  // useEffect(() => {
  //   let index = 0;
  //   const timer = setInterval(() => {
  //     if (index < fullText.length) {
  //       setText((prev) => prev + fullText.charAt(index));
  //       index++;
  //     } else {
  //       clearInterval(timer);
  //     }
  //   }, 40); // 타이핑 속도 조절 (밀리초)

  //   return () => clearInterval(timer);
  // },)
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
      
      <div className="toss-recommendation">
      <div className="toss-header">
        <h3>ToSS의 추천</h3>
        <SoundService audioId={audioId} />
      </div>
      <div className="toss-content">
        <p className="typing-effect">{text}</p>
      </div>
    </div>
      {/* {showContent && (
        <TossRecommendationContent 
          audioId={audioId} 
          image={image}
          onRecommendationComplete={handleRecommendationComplete}
        />
      )}

      {recommendationInfo && (
        <div className="recommendation-result">
          <h2>Toss의 추천</h2>
          <p>{}</p>
        </div>
      )} */}
    </div>
  );
}

export default TossRecommendation;