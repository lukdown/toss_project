import React, { useState, useRef, useEffect } from 'react';
import './css/AudioRecorder.css';

const AudioRecorder = ({ onRecordingComplete }) => {
  // 상태 관리
  const [isRecording, setIsRecording] = useState(false); // 녹음 중인지 여부
  const [audioURL, setAudioURL] = useState(''); // 녹음된 오디오 URL
  const [timeLeft, setTimeLeft] = useState(40); // 남은 녹음 시간 (초)

  // ref를 사용하여 컴포넌트 리렌더링과 무관하게 값을 유지
  const mediaRecorder = useRef(null); // MediaRecorder 인스턴스 저장
  const timerRef = useRef(null); // 타이머 인터벌 ID 저장

  // 녹음 시작/중지에 따른 타이머 효과
  useEffect(() => {
    if (isRecording) {
      // 1초마다 타이머 갱신
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            stopRecording(); // 시간이 다 되면 녹음 중지
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current); // 녹음 중지 시 타이머 해제
    }

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  // 녹음 시작 함수
  const startRecording = async () => {
    try {
      // 사용자의 마이크 접근 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      // 녹음 데이터 사용 가능할 때 실행되는 이벤트 핸들러
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const audioBlob = new Blob([event.data], { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url); // 오디오 URL 상태 업데이트
          onRecordingComplete(audioBlob); // 상위 컴포넌트에 녹음 완료 알림
        }
      };

      mediaRecorder.current.start(); // 녹음 시작
      setIsRecording(true);
      setTimeLeft(40); // 타이머 초기화
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
  };

  // 녹음 중지 함수
  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop(); // 녹음 중지
      setIsRecording(false);
      clearInterval(timerRef.current); // 타이머 중지
    }
  };

  return (
    <div className="audio-recorder">
      <button 
        className={`record-button ${isRecording ? 'recording' : ''}`} 
        onClick={isRecording ? stopRecording : startRecording}
      >
        <i className="mic-icon"></i>
        {isRecording ? `${timeLeft}s` : ''} {/* 녹음 중일 때만 남은 시간 표시 */}
      </button>
      {audioURL && <audio src={audioURL} controls className="audio-player" />} {/* 녹음된 오디오가 있을 때만 플레이어 표시 */}
    </div>
  );
};

export default AudioRecorder;