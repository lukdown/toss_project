import React from 'react';
import { useLocation } from 'react-router-dom';

function Correction() {
  const location = useLocation();
  const { transcription } = location.state || {};
  return (
    <div className="correction">
      <p>In this picture, I can see a cat and a dog together.</p>
      <p>The cat appears to <span className="correction-green">be</span> a tabby with <span className="correction-green">brown</span> and white fur, <span className="correction-red">mixed breed</span> <span className="correction-green">puppy</span>.</p>
      <p>They seem to be <span className="correction-green">in an outdoor setting,</span> not sitting on a <span className="correction-red">comfortable-looking</span> couch.</p>
      <p><span className="correction-blue">appears to be ~</span> : 안쪽에서 더 자세히 보기</p>
      <p><span className="correction-blue">mixed breed puppy</span> : 안내는 옮은 이름이지만 하나만 맞습니다</p>
      <p className="score">점수: 8rfafdafad2/145</p>
      <p>{transcription}</p>
      <p>testdi</p>
    </div>
  );
}

export default Correction;