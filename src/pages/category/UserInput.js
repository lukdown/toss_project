import React from 'react';
import { useLocation } from 'react-router-dom';

function UserInput() {
  const location = useLocation();
  const { transcription } = location.state || {};
  console.log();
  return (
    <div className="user-input">
      <h3>당신의 문장</h3>
      <p>{transcription}</p>
    </div>
  );
}
//
export default UserInput;