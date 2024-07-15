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
import Select from 'react-select';
import styled from 'styled-components';

const StyledSelect = styled(Select).attrs({
  classNamePrefix: 'react-select',
})`
  .react-select__control {
    background-color: #ffffff;
    width: 480px;
    height: 40px;
    padding-right: 15px;
    border: none;
    border-radius: 20px;
    display: flex;
    text-align: center;
    cursor: pointer;
    margin-left: 20px;
  }
  .react-select__single-value {
    color: #000000; /* 텍스트 색상 지정 */
    font-size: 16px;
    font-weight: 700;
  }
  .react-select__menu {
    width: 480px;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-weight: 600;
    text-align: center;
    overflow: hidden;
    margin-left: 20px
  }
  .react-select__menu-list {
    overflow: hidden !important;
  }
  .react-select__option {
    background-color: transparent; /* option 배경색 */
    color: black; /* option 텍스트 색상 */
  }
  .react-select__option--is-focused  {
    background-color: #848E8F; /* 클릭된 option 배경색 */
    color: white; /* 클릭된 option 텍스트 색상 */
  }
  .react-select__dropdown-indicator {
    display: none; /* 드롭다운 화살표를 숨깁니다. */
  }
  .react-select__indicator-separator {
    display: none; /* 화살표 사이의 구분선을 숨깁니다. */
  }
  .react-select__placeholder {
    color: black;
    font-weight: 600;
  }
`;

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
  const [analysisData, setAnalysisData] = useState(null);  // 새로운 상태 추가

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
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption.value);
  };

  // 연습 시작 버튼 클릭 시 호출되는 함수
  const handleStartPractice = () => {
    if (selectedCategory) {
      setShowContent(true);
    }
  };

  
  const options = [
    { value: '', label: '카테고리 선택' },
    { value: 'education', label: '교육' },
    { value: 'business', label: '회사' },
    { value: 'travel', label: '여행' },
    { value: 'family', label: '가족' },
    { value: 'leisure', label: '여가' },
    { value: 'environment', label: '환경' },
    { value: 'technology', label: '기술' }
  ];
  

  return (
    <div className="app">
      <main>
        {/* 카테고리 선택 UI */}
        <div className="category-selection">
          <div className="select-wrapper">
            <StyledSelect options={options} value={options.find(option => option.value === selectedCategory)} onChange={handleCategoryChange} />
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
            <div className="content-container">
              <ImageContainer 
                category={selectedCategory}
                setImageFile={setImageFile}
              />
            </div>
            <div>
              <AudioRecorder 
                onRecordingComplete={handleRecordingComplete} 
                onAudioSend={handleAudioSend}
              />
            </div>
            {/* 추가 컨텐츠 (UserInput, Correction, Feedback, TossSaid) */}
            {showAdditionalContent && (
              <>
                <div className="content-container fly-in">
                  <UserInput analysisData={analysisData}/>
                </div>
                <div className="content-container fly-in delay-1">
                  <Correction analysisData={analysisData} />
                </div>
                <div className="content-container fly-in delay-2">
                  <div className="feedback-container">
                    {showFeedback && analysisData && (
                      <div className="feedback-item">
                        <Feedback analysisData={analysisData} />
                      </div>
                    )}
                  </div>
                </div>
                {showTossRecommendation && (
                  <div className="content-container toss-said-container fly-in delay-3">
                    <TossSaid file={imageFile} analysisData={analysisData} />
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