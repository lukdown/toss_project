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
    </div>
  );
}

export default Correction;
