import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './css/AudioRecorder.css';

const AudioRecorder = ({ onRecordingComplete, onAudioSend }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [timeLeft, setTimeLeft] = useState(40);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorder = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            stopRecording();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setAudioBlob(audioBlob);
        onRecordingComplete(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setTimeLeft(40);
      chunksRef.current = [];
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current && isPaused) {
      mediaRecorder.current.resume();
      setIsPaused(false);
    }
  };

  const restartRecording = () => {
    setAudioURL('');
    setAudioBlob(null);
    startRecording();
  };

  const sendRecording = async () => {
    if (audioBlob) {
      try {
        console.log('Audio blob type:', audioBlob.type);
        console.log('Audio blob size:', audioBlob.size);

        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        
        const response = await axios.post('http://127.0.0.1:8000/api/automaticspeechrecognition', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Audio uploaded successfully', response.data);
        onAudioSend(); // 전송 완료 후 부모 컴포넌트에 알림
      } catch (error) {
        console.error('Error uploading audio', error);
        if (error.response) {
          console.log('Response data:', error.response.data);
          console.log('Response status:', error.response.status);
          console.log('Response headers:', error.response.headers);
        } else if (error.request) {
          console.log('Request data:', error.request);
        } else {
          console.log('Error message:', error.message);
        }
        console.log('Error config:', error.config);
      }
    }
  };

  return (
    <div className="audio-recorder">
      {!isRecording && !audioURL ? (
        <button className="record-button" onClick={startRecording}>
          <svg viewBox="0 0 24 24" className="icon">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
          녹음 시작
        </button>
      ) : isRecording ? (
        <>
          <button className="record-button recording" onClick={stopRecording}>
            <svg viewBox="0 0 24 24" className="icon">
              <path d="M6 6h12v12H6z"/>
            </svg>
            녹음 중지 ({timeLeft}s)
          </button>
          <button className="pause-button" onClick={isPaused ? resumeRecording : pauseRecording}>
            {isPaused ? (
              <svg viewBox="0 0 24 24" className="icon">
                <path d="M8 5v14l11-7z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="icon">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            )}
            {isPaused ? '재개' : '일시정지'}
          </button>
        </>
      ) : (
        <>
          <button className="restart-button" onClick={restartRecording}>
            <svg viewBox="0 0 24 24" className="icon">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            다시 녹음
          </button>
          <audio src={audioURL} controls className="audio-player" />
          <button className="send-button" onClick={sendRecording}>
            <svg viewBox="0 0 24 24" className="icon">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
            전송
          </button>
        </>
      )}
    </div>
  );
};

export default AudioRecorder;