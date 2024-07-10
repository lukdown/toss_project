import React from 'react';
import SoundService from '../SoundService';

function TossSaid({ audioId }) {
  return (
    <div className="toss-recommendation">
      <div className="toss-header">
        <h3>ToSS의 추천</h3>
        {/* 오디오 재생 서비스 컴포넌트 */}
        <SoundService audioId={audioId} />
      </div>
      {/* ToSS의 추천 내용 */}
      <div className="toss-content">
        <p>In the picture, I can see a cat and a dog sitting together outdoors.</p>
        <p>The cat appears to be a short-haired breed with white and gray fur. It has green eyes and is looking directly at the camera. The cat is sitting on the ground, seeming alert and attentive.</p>
      </div>
      {/* 정확도 표시 */}
      <div className="score-box">
        <span className='score-box-id'>정확도:</span>
         <span className="score-value">/145</span>
      </div>
    </div>
  );
}

export default TossSaid;