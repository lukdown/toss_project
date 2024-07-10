import React, { useState, useEffect } from 'react';
import '../App.css';
import './css/Category.css';
import AudioRecorder from './AudioRecorder';
import UserInput from './category/UserInput';
import Correction from './category/Correction';
import Feedback from './category/Feedback';
import TossRecommendation from './category/TossSaid';
import ImageContainer from './category/ImageContainer';
import '../Font.css';

function Category() {
  const [feedbackAudioId, setFeedbackAudioId] = useState(null);
  const [tossRecommendationAudioId, setTossRecommendationAudioId] = useState(null);

  useEffect(() => {
    // 테스트를 위해 임시 ID 설정
    setFeedbackAudioId('feedback-test-id');
    setTossRecommendationAudioId('toss-test-id');
  }, []);

  const handleRecordingComplete = async (audioBlob) => {
    console.log('Recording completed', audioBlob);
    // 실제 구현 시 이 부분에 서버로 오디오 전송 로직 추가
  };

function ImageContainer({ imageUrl }) {
  return (
    <div className="image-container">
      <img src={imageUrl} alt="" />
    </div>
  );
}

  return (
    <div className="app">
      <main>
        <ImageContainer imageUrl="placeholder.jpg" />
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        <UserInput />
        <Correction />
        <Feedback audioId={feedbackAudioId} />
        <TossRecommendation audioId={tossRecommendationAudioId} />
      </main>
    </div>
  );
}

export default Category;