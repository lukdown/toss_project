import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Correction({ analysisData }) {
  // const location = useLocation();
  // const { transcription } = location.state || {};


  

  return (
    <div className="correction">
      <h3>Grammar</h3>
      <p>당신의 문장: {analysisData?.grammar.original_text.text || '입력된 문장이 없습니다.'}</p>
      <p>교정된 문장: {analysisData?.grammar.corrected_text || '입력된 문장이 없습니다.'}</p>
    </div>
  );
}

export default Correction;
