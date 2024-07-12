<<<<<<< HEAD
import React from 'react';
=======
import React, { useState, useEffect, useRef } from 'react';
>>>>>>> b6801e055835055927481a06cd7f06ce9ae9b58d
import SoundService from '../SoundService';
import axios from 'axios';

function TossSaid(file) {

<<<<<<< HEAD
  
  const formData = new FormData();
  formData.append('file', file);

  const response = axios({
    method: 'post',
    url: 'http://127.0.0.1:8000/image_description/',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
    
  
=======
  const [showContent, setShowContent] = useState(false);
  const [audioId, setAudioId] = useState(null);
  const user_input_txt = useRef(null);  // useRef로 변경
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [showPlayButton, setShowPlayButton] = useState(true);

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
        user_input_txt.current = response.data;  // useRef를 사용해 값 저장
        
        setShowContent(true);
      } catch (err) {
        console.error("Error fetching image description:", err);
        setError("Failed to get image description");
      } finally {
        setIsLoading(false);
      }
    };

    

    fetchDescription()
  }, [file]);
  const handleTextToSpeech = async () => {
    try {
      setIsPlaying(true);
      setShowPlayButton(false);  // 버튼 숨기기
      console.log(user_input_txt.current)
      const response = await axios.post('http://127.0.0.1:8000/text-to-speech/', 
          { text: user_input_txt.current },
          { responseType: 'blob' }
      );

      const audioBlob = new Blob([response.data], { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.load(); // 추가: 오디오 로드
          audioRef.current.play().catch(e => {
              console.error("Audio playback failed", e);
              setIsPlaying(false);
          });
      }

  } catch (error) {
      console.error('Error:', error);
      setIsPlaying(false);
  }
};
const handleAudioEnded = () => {
  setIsPlaying(false);
};
>>>>>>> b6801e055835055927481a06cd7f06ce9ae9b58d

  return (

    <div className="toss-recommendation">
      <div className="toss-header">
        <h3>ToSS의 추천</h3>
<<<<<<< HEAD
        {/* 오디오 재생 서비스 컴포넌트 */}
        {/* <SoundService audioId={audioId} /> */}
      </div>
      {/* ToSS의 추천 내용 */}
      <div className="toss-content">
        <p>{response}</p>
        {/* <p>The cat appears to be a short-haired breed with white and gray fur. It has green eyes and is looking directly at the camera. The cat is sitting on the ground, seeming alert and attentive.</p> */}
      </div>
      {/* 정확도 표시 */}
      <div className="score-box">
        <span className='score-box-id'>정확도:</span>
         <span className="score-value">/145</span>
=======
        <SoundService audioId={audioId} />
      </div>
      
      <button onClick={handleTextToSpeech} disabled={isPlaying}>
          <svg viewBox="0 0 24 24" className="icon">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          음성 재생
      </button>
      <audio ref={audioRef} onEnded={handleAudioEnded} controls style={{ display: 'block' }} />
      <div className="typing-effect">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!isLoading && !error && 
          <pre>{text}</pre>
          }
>>>>>>> b6801e055835055927481a06cd7f06ce9ae9b58d
      </div>
      
    </div>
  );
}

export default TossSaid;