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
  const user_input_txt = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [showAudioControl, setShowAudioControl] = useState(false);

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
    setShowPlayButton(true);
    setShowAudioControl(false);
  };

  const handleTextToSpeech = async () => {
    try {
      setIsPlaying(true);
      setShowPlayButton(false);
      setShowAudioControl(true);
      console.log(text);

      const response = await axios.post('http://127.0.0.1:8000/text-to-speech/', 
          { text: text },
          { responseType: 'blob' }
      );

      const audioBlob = new Blob([response.data], { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.load();
          audioRef.current.play().catch(e => {
              console.error("Audio playback failed", e);
              setIsPlaying(false);
              setShowPlayButton(true);
              setShowAudioControl(false);
          });
      }

    } catch (error) {
      console.error('Error:', error);
      setIsPlaying(false);
      setShowPlayButton(true);
      setShowAudioControl(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setShowPlayButton(true);
  };

  return (
    <div>
      <h1>사진 보고 Toss 추천 받기</h1>
      <div className="toss-recommendation">
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
            <div className="TossRecommendation-playing-btn-box">
              {showPlayButton && (
                <button className="TossRecommendation-playing-btn" onClick={handleTextToSpeech} disabled={isPlaying}>
                  <svg viewBox="0 0 24 24" className="icon">
                    <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z" />
                  </svg>
                  음성 재생
                </button>
              )}
              {showAudioControl && (
                <audio ref={audioRef} onEnded={handleAudioEnded} controls style={{ display: 'block' }} />
              )}
            </div>
            <div className="toss-content">
              <TypeWriter text={text} speed={40} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TossRecommendation;