// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import SoundService from '../SoundService';

// function TossSaid({ audioId }) {
//   const [tossData, setTossData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTossData = async () => {
//       setIsLoading(true);
//       try {
//         // 실제 API 엔드포인트로 변경해야 합니다
//         const response = await axios.get(`/api/toss-recommendation/${audioId}`);
//         setTossData(response.data);
//         setIsLoading(false);
//       } catch (err) {
//         setError('데이터를 불러오는 데 실패했습니다.');
//         setIsLoading(false);
//       }
//     };

//     fetchTossData();
//   }, [audioId]);

//   if (isLoading) return <div>로딩 중...</div>;
//   if (error) return <div>{error}</div>;
//   if (!tossData) return null;

//   return (
//     <div className="toss-recommendation">
//       <div className="toss-header">
//         <h3>ToSS의 추천</h3>
//         <SoundService audioId={audioId} />
//       </div>
//       <div className="toss-content">
//         {tossData.recommendations.map((recommendation, index) => (
//           <p key={index}>{recommendation}</p>
//         ))}
//       </div>
//       <div className="score-box">
//         <span>정확도:</span>
//         <span className="score-value">{tossData.accuracy}/145</span>
//       </div>
//     </div>
//   );
// }

// export default TossSaid;

// 백엔드에서는 다음과 같은 형식의 JSON 데이터를 반환해야 합니다
// {
//   "recommendations": [
//     "In the picture, I can see a cat and a dog sitting together outdoors.",
//     "The cat appears to be a short-haired breed with white and gray fur. It has green eyes and is looking directly at the camera. The cat is sitting on the ground, seeming alert and attentive."
//   ],
//   "accuracy": 82
// }



import React from 'react';
import SoundService from '../SoundService';

function TossSaid({ audioId }) {
  return (
    <div className="toss-recommendation">
      <div className="toss-header">
        <h3>ToSS의 추천</h3>
        <SoundService audioId={audioId} />
      </div>
      <div className="toss-content">
        <p>In the picture, I can see a cat and a dog sitting together outdoors.</p>
        <p>The cat appears to be a short-haired breed with white and gray fur. It has green eyes and is looking directly at the camera. The cat is sitting on the ground, seeming alert and attentive.</p>
      </div>
      <div className="score-box">
        <span className='score-box-id'>정확도:</span>
         <span className="score-value">/145</span>
      </div>
    </div>
  );
}

export default TossSaid;