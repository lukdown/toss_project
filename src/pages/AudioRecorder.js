import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './css/AudioRecorder.css';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [timeLeft, setTimeLeft] = useState(40);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorder = useRef(null);
  const timerRef = useRef(null);
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
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
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

  const sendRecording = async () => {
    if (audioBlob) {
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
        
        const response = await axios.post('/api/upload-audio', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Audio uploaded successfully', response.data);
        // 여기서 필요한 추가 작업을 수행할 수 있습니다.
      } catch (error) {
        console.error('Error uploading audio', error);
      }
    }
  };

  return (
    <div className="audio-recorder">
      {!isRecording ? (
        <button className="record-button" onClick={startRecording}>
          <i className="mic-icon"></i> 녹음 시작
        </button>
      ) : (
        <>
          <button className="record-button recording" onClick={stopRecording}>
            <i className="stop-icon"></i> 녹음 중지 ({timeLeft}s)
          </button>
          <button className="pause-button" onClick={isPaused ? resumeRecording : pauseRecording}>
            {isPaused ? '재개' : '일시정지'}
          </button>
        </>
      )}
      {audioURL && (
        <>
          <audio src={audioURL} controls className="audio-player" />
          <button className="send-button" onClick={sendRecording}>녹음 보내기</button>
        </>
      )}
    </div>
  );
};

export default AudioRecorder;