import React, { useState, useEffect, useRef } from 'react';
import SoundService from '../SoundService';
import axios from 'axios';
import '../css/TossSaid.css';

function TossSaid({ file, analysisData }) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compareResult, setCompareResult] = useState(null);  // 새로운 상태 추가

  const [showContent, setShowContent] = useState(false);
  const [audioId, setAudioId] = useState(null);
  const user_input_txt = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [showAudioControl, setShowAudioControl] = useState(false);

  const effectRan = useRef(false);

  let compare_result = null;

  useEffect(() => {
    if (effectRan.current === false) {
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
          setText(response.data);
          user_input_txt.current = response.data;
          
          setShowContent(true);
        } catch (err) {
          console.error("Error fetching image description:", err);
          setError("Failed to get image description");
        } finally {
          setIsLoading(false);
        }
      };

      fetchDescription()
    }
    return () => {
        effectRan.current = true;
    };
  }, [file]);

  const handleTextToSpeech = async () => {
    try {
      setIsPlaying(true);
      setHasPlayedOnce(true);
      setShowAudioControl(true);
      
      const response = await axios.post('http://127.0.0.1:8000/text-to-speech/', 
          { text: user_input_txt.current },
          { responseType: 'blob' }
      );

      const audioBlob = new Blob([response.data], { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.load();
          audioRef.current.play().catch(e => {
              console.error("Audio playback failed", e);
              setIsPlaying(false);
              setShowAudioControl(false);
          });
      }

    } catch (error) {
      console.error('Error:', error);
      setIsPlaying(false);
      setShowAudioControl(false);
    }

    const compareResponse = await axios.post('http://localhost:8000/compare-texts/', 
      { 
        text1: user_input_txt.current, 
        text2: analysisData?.transcription 
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
      },
    });
    console.log("Similarity result:", compareResponse.data.similarity_result);
    compare_result = compareResponse.data.similarity_result;
    console.log(typeof(compare_result))
    setCompareResult(compareResponse.data.similarity_result);  // 상태 업데이트
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="toss-recommendation">
      <div className="toss-header">
        <h3>ToSS의 추천</h3>
        <SoundService audioId={audioId} />
      </div>
      
      <div className="TossSaid-playing-btn-box">
        {!hasPlayedOnce && (
          <button className="TossSaid-playing-btn" onClick={handleTextToSpeech} disabled={isPlaying}>
            <svg viewBox="0 0 24 24" className="icon">
              <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z" />
            </svg>
          </button>
        )}
        {showAudioControl && (
          <audio ref={audioRef} onEnded={handleAudioEnded} controls style={{ display: 'block' }} />
        )}
      </div>
      {/* <div>{analysisData?.transcription || '입력된 문장이 없습니다.'}</div> */}
      <div className="typing-effect">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!isLoading && !error && 
          <pre>{text}</pre>
        }
      </div>
      {compareResult !== null && (
        <div className="similarity-result">
          <h4>유사도 점수:</h4>
          <p>{compareResult.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default TossSaid;