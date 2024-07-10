import React from 'react';
import SoundService from '../SoundService';

//
function Feedback({ audioId }) {
  return (
    <div className="feedback">
      <div className="feedback-header">
        <h3>교정과 발음 여부</h3>
        <SoundService audioId={audioId} />
      </div>
      <ul>
        <li>문장 리듬: 내용어와 기능어의 적절한 강세와 속도를 유지하세요</li>
        <li>연음: "cat_and"나 "dog_together" 같이 단어를 부드럽게 연결하세요</li>
        <li>개별 발음: "together"의 "th" 발음, "retriever"의 "r" 발음에 주의하세요</li>
        <li>억양: 문장 끝에서 적절한 올림 또는 내림 톤을 사용하세요</li>
      </ul>
    </div>
  );
}

export default Feedback;