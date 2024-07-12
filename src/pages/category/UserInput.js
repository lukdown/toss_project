import React from 'react';

function UserInput({ analysisData }) {
  return (
    <div className="user-input">
      <h3>당신의 문장</h3>
      <p>{analysisData?.transcription || '입력된 문장이 없습니다.'}</p>
    </div>
  );
}

export default UserInput;