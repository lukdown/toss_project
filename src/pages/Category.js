import React, { useState, useEffect } from 'react';
import '../App.css';
import './css/Category.css';
import AudioRecorder from './AudioRecorder';
import UserInput from './category/UserInput';
import Correction from './category/Correction';
import Feedback from './category/Feedback';
import TossSaid from './category/TossSaid';  // TossRecommendation 대신 TossSaid import
import ImageContainer from './category/ImageContainer';
import '../Font.css';

function Category() {
  // 상태 변수들 정의
  const [feedbackAudioId, setFeedbackAudioId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [showAdditionalContent, setShowAdditionalContent] = useState(false);
  const [showUserInput, setShowUserInput] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTossRecommendation, setShowTossRecommendation] = useState(false);
  const [imageFile, setImageFile] = useState(null);  // 새로운 상태 추가

  // 컴포넌트 마운트 시 오디오 ID 설정
  useEffect(() => {
    setFeedbackAudioId('feedback-test-id');
  }, []);

  // 녹음 완료 시 호출되는 함수
  const handleRecordingComplete = async (audioBlob) => {
    console.log('Recording completed', audioBlob);
    // TODO: 실제 구현 시 이 부분에 서버로 오디오 전송 로직 추가
  };

  // 오디오 전송 시 호출되는 함수
  const handleAudioSend = () => {
    setShowAdditionalContent(true);
    
    // 각 컴포넌트를 순차적으로 표시
    setTimeout(() => setShowUserInput(true), 500);
    setTimeout(() => setShowCorrection(true), 1000);
    setTimeout(() => setShowFeedback(true), 1500);
    setTimeout(() => setShowTossRecommendation(true), 2000);
  };

  // 카테고리 선택 시 호출되는 함수
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // 연습 시작 버튼 클릭 시 호출되는 함수
  const handleStartPractice = () => {
    if (selectedCategory) {
      setShowContent(true);
    }
  };

  return (
    <div className="app">
      <main>
        {/* 카테고리 선택 UI */}
        <div className="category-selection">
          <div className="select-wrapper">
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">카테고리 선택</option>
              <option value="education">교육</option>
              <option value="business">회사</option>
              <option value="travel">여행</option>
              <option value="family">가족</option>
              <option value="leisure">여가</option>
              <option value="environment">환경</option>
              <option value="technology">기술</option>
            </select>
          </div>
          <button onClick={handleStartPractice} disabled={!selectedCategory}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

        {/* 선택된 카테고리에 따른 컨텐츠 표시 */}
        {showContent && (
          <>
            <ImageContainer 
              category={selectedCategory}
              setImageFile={setImageFile}  // setImageFile prop 추가
            />
            <AudioRecorder 
              onRecordingComplete={handleRecordingComplete} 
              onAudioSend={handleAudioSend}
            />
            {/* 추가 컨텐츠 (UserInput, Correction, Feedback, TossSaid) */}
            {showAdditionalContent && (
              <>
                {showUserInput && (
                  <div className="fly-in">
                    <UserInput />
                  </div>
                )}
                {showCorrection && (
                  <div className="fly-in delay-1">
                    <Correction />
                  </div>
                )}
                {showFeedback && (
                  <div className="fly-in delay-2">
                    <Feedback audioId={feedbackAudioId} />
                  </div>
                )}
                {showTossRecommendation && (
                  <div className="fly-in delay-3">
                    <TossSaid file={imageFile} />  {/* TossRecommendation을 TossSaid로 교체 */}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Category;