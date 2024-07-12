<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Correction() {
  const location = useLocation();
  const { transcription } = location.state || {};
  const [correctedText, setCorrectedText] = useState('');

  useEffect(() => {
    const fetchCorrectedText = async () => {
      try {
        const formData = new FormData();
        formData.append('text', transcription);

        const response = await axios.post('http://127.0.0.1:8000/correct-grammar/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setCorrectedText(response.data.corrected_text);
      } catch (error) {
        console.error('Error fetching corrected text:', error);
      }
    };

    if (transcription) {
      fetchCorrectedText();
    }
  }, [transcription]);

  return (
    <div className="correction">
      <p dangerouslySetInnerHTML={{ __html: correctedText }} />
=======
import React from 'react';

function Correction({analysisData}) {
  console.log("Received analysisData:", analysisData); // 데이터 확인을 위한 로그
  

  return (
    <div className="correction">
      <h3>문법 교정 결과</h3>
      <p>{analysisData.grammar?.corrected_text || '문법 교정 결과가 없습니다.'}</p>
>>>>>>> LEB_react
    </div>
  );
}

export default Correction;
