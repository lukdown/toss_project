import React from 'react';

function Correction({analysisData}) {
  console.log("Received analysisData:", analysisData); // 데이터 확인을 위한 로그
  

  return (
    <div className="correction">
      <h3>문법 교정 결과</h3>
      <p>{analysisData.grammar?.corrected_text || '문법 교정 결과가 없습니다.'}</p>
    </div>
  );
}

export default Correction;
