import React, { useState, useEffect } from 'react';
import SoundService from '../SoundService';
import axios from 'axios';

function TossSaid({ file }) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDescription = async () => {
      if (!file) return;

      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/image-description',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setText(response.data); // 서버 응답의 data 필드를 사용
      } catch (err) {
        console.error("Error fetching image description:", err);
        setError("Failed to get image description");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDescription();
  }, [file]);

  return (
    <div className="toss-recommendation">
      <div className="toss-header">
        <h3>ToSS의 추천</h3>
        {/* <SoundService audioId={audioId} /> */}
      </div>
      <div className="typing-effect">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!isLoading && !error && 
          <pre>{text}</pre>
          }
      </div>
      <div className="score-box">
        <span className='score-box-id'>정확도:</span>
        <span className="score-value">/</span>
      </div>
    </div>
  );
}

export default TossSaid;