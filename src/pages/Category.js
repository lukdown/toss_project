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
  // 상태 변수들 정의
  const [feedbackAudioId, setFeedbackAudioId] = useState(null);
  const [tossRecommendationAudioId, setTossRecommendationAudioId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [showAdditionalContent, setShowAdditionalContent] = useState(false);
  const [showUserInput, setShowUserInput] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTossRecommendation, setShowTossRecommendation] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);  // 새로운 상태 추가

  // 컴포넌트 마운트 시 오디오 ID 설정
  useEffect(() => {
    setFeedbackAudioId('feedback-test-id');
    setTossRecommendationAudioId('toss-test-id');
  }, []);

  // 녹음 완료 시 호출되는 함수
  const handleRecordingComplete = async (audioBlob) => {
    console.log('Recording completed', audioBlob);
    // TODO: 실제 구현 시 이 부분에 서버로 오디오 전송 로직 추가
  };

  // 오디오 전송 시 호출되는 함수
  const handleAudioSend = (data) => {
    console.log("Received data in Category:", data);  // 데이터 확인을 위한 로그
    setAnalysisData(data);  // 받은 데이터를 상태로 저장
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
            <ImageContainer category={selectedCategory} />
            <AudioRecorder 
              onRecordingComplete={handleRecordingComplete} 
              onAudioSend={handleAudioSend}
            />
            {/* 추가 컨텐츠 (UserInput, Correction, Feedback, TossRecommendation) */}
            {showAdditionalContent && (
              <>
                {showUserInput && (
                  <div className="fly-in">
                    <UserInput analysisData={analysisData}/>
                  </div>
                )}
                {showCorrection && (
                  <div className="fly-in delay-1">
                    <Correction analysisData={analysisData} />
                  </div>
                )}
                {showFeedback && analysisData && (
                  <div className="fly-in delay-2">
                    <Feedback analysisData={analysisData} />
                  </div>
                )}
                {/* {showTossRecommendation && (
                  <div className="fly-in delay-3">
                    <TossRecommendation audioId={tossRecommendationAudioId} />
                  </div>
                )} */}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Category;