import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from './TossRecommendationContent';
import SoundService from './SoundService';
import './css/TossRecommendation.css';
import TypeWriter from './TypeWriter';

function TossRecommendation() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [audioId, setAudioId] = useState(null);
  const [text, setText] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImage(URL.createObjectURL(file));
      setLoading(true);
      setShowContent(false);

      try {
        const response = await uploadImage(file);
        console.log(response);
        setLoading(false);
        setShowContent(true);
        setText(response);
      } catch (error) {
        setLoading(false);
        // 에러 처리
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false // 한 번에 하나의 파일만 허용
  });

  const resetImage = () => {
    setImage(null);
    setLoading(false);
    setShowContent(false);
    setAudioId(null);
    setText('');
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
        <div className="toss-recommendation">
          <div className="toss-header">
            <h3>ToSS의 추천</h3>
            <SoundService audioId={audioId} />
          </div>
          <div className="toss-content">
            <TypeWriter text={text} speed={40} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TossRecommendation;