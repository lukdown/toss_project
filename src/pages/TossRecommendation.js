import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';
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
  const user_input_txt = useRef(null);  // useRef로 변경
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [showPlayButton, setShowPlayButton] = useState(true);


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

  
  const handleTextToSpeech = async () => {
    try {
      setIsPlaying(true);
      setShowPlayButton(false);  // 버튼 숨기기
      console.log(text);

      const response = await axios.post('http://127.0.0.1:8000/text-to-speech/', 
          { text: text },
          { responseType: 'blob' }
      );

      const audioBlob = new Blob([response.data], { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.load(); // 추가: 오디오 로드
          audioRef.current.play().catch(e => {
              console.error("Audio playback failed", e);
              setIsPlaying(false);
          });
      }

  } catch (error) {
      console.error('Error:', error);
      setIsPlaying(false);
  }
};

const handleAudioEnded = () => {
    setIsPlaying(false);
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
          <button onClick={() => {resetImage(); handleTextToSpeech();}} className="reset-button">다시하기</button>
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
          {showPlayButton && (
            <button onClick={handleTextToSpeech} disabled={isPlaying}>
              <svg viewBox="0 0 24 24" className="icon">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
              음성 재생
            </button>
          )}
          <audio ref={audioRef} onEnded={handleAudioEnded} controls style={{ display: 'block' }} />
          <div className="toss-content">
            <TypeWriter text={text} speed={40} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TossRecommendation;