import React, { useState, useEffect } from 'react';
import '../App.css';
import './css/Category.css';
import AudioRecorder from './AudioRecorder';
import SoundService from './SoundService';

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

  return (
    <div className="app">
      <header>
        <h1>ToSS</h1>
        <p>Toeic Smart Speaking</p>
      </header>
      <nav>
        <button>사진 보고 Toss 추천 받기</button>
        <button>카테고리별 연습하기</button>
      </nav>
      <main>
        <div className="image-container">
          <img src="placeholder.jpg" alt="연습 이미지" />
        </div>
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        <div className="user-input">
          <h3>당신의 문장</h3>
          <p>In this picture, I can see a cat and a dog together. 
            The cat appears to being a tabby with orange and white fur, while the dog looks like a golden retriever. 
            They seem to be living room, sitting on a looking comfortable-couch.</p>
        </div>
        
        <div className="correction">
          <p>In this picture, I can see a cat and a dog together.</p>
          <p>The cat appears to <span className="correction-green">be</span> a tabby with <span className="correction-green">brown</span> and white fur, <span className="correction-red">mixed breed</span> <span className="correction-green">puppy</span>.</p>
          <p>They seem to be <span className="correction-green">in an outdoor setting,</span> not sitting on a <span className="correction-red">comfortable-looking</span> couch.</p>
          <p><span className="correction-blue">appears to be ~</span> : 안쪽에서 더 자세히 보기</p>
          <p><span className="correction-blue">mixed breed puppy</span> : 안내는 옮은 이름이지만 하나만 맞습니다</p>
          <p className="score">점수: 82/145</p>
        </div>
        
        <div className="feedback">
          <SoundService audioId={feedbackAudioId} />
          <h3>교정과 발음 여부</h3>
          <ul>
            <li>문장 리듬: 내용어와 기능어의 적절한 강세와 속도를 유지하세요</li>
            <li>연음: "cat_and"나 "dog_together" 같이 단어를 부드럽게 연결하세요</li>
            <li>개별 발음: "together"의 "th" 발음, "retriever"의 "r" 발음에 주의하세요</li>
            <li>억양: 문장 끝에서 적절한 올림 또는 내림 톤을 사용하세요</li>
          </ul>
        </div>
        
        <div className="toss-recommendation">
          <SoundService audioId={tossRecommendationAudioId} />
          <h3>ToSS의 추천</h3>
          <p>In the picture, I can see a cat and a dog sitting together outdoors.</p>
          <p>The cat appears to be a short-haired breed with white and gray fur. It has green eyes and is looking directly at the camera. The cat is sitting on the ground, seeming alert and attentive.</p>
          <p className="score">정확도: 82/145</p>
        </div>
      </main>
    </div>
  );
}

export default Category;