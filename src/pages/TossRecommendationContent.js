// import React, { useEffect, useState } from 'react';
// import SoundService from './SoundService';

// function TossRecommendationContent({ audioId, image, onRecommendationComplete }) {
//   const [recommendation, setRecommendation] = useState('');

//   useEffect(() => {
//     // 여기서 이미지 분석 및 추천 생성 로직을 구현합니다.
//     // 실제로는 API 호출 등이 이루어질 것입니다.
//     const analyzeImage = async () => {
//       // 이미지 분석 로직 (예시)
//       await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
      
//       const generatedRecommendation = "이 이미지에 기반한 Toss의 추천입니다...";
//       setRecommendation(generatedRecommendation);
//       onRecommendationComplete({ recommendation: generatedRecommendation });
//     };

//     analyzeImage();
//   }, [image, onRecommendationComplete]);

//   return (
//     <div className="toss-recommendation-content">
//       <div className="toss-header">
//         <h3>ToSS의 추천</h3>
//         <SoundService audioId={audioId} />
//       </div>
//       <div className="toss-content">
//         <p>{recommendation}</p>
//       </div>
//     </div>
//   );
// }

// export default TossRecommendationContent;



import React, { useState, useEffect } from 'react';
import SoundService from './SoundService';
import './css/TossRecommendation.css'; // CSS 파일을 import 해주세요

function TossRecommendationContent({ audioId }) {
  const [text, setText] = useState('');
  const fullText = "In the picture, I can see a cat and a dog sitting together outdoors. The cat appears to be a short-haired breed with white and gray fur. It has green eyes and is looking directly at the camera. The cat is sitting on the ground, seeming alert and attentive.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 40); // 타이핑 속도 조절 (밀리초)

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="toss-recommendation">
      <div className="toss-header">
        <h3>ToSS의 추천</h3>
        <SoundService audioId={audioId} />
      </div>
      <div className="toss-content">
        <p className="typing-effect">{text}</p>
      </div>
    </div>
  );
}

export default TossRecommendationContent;