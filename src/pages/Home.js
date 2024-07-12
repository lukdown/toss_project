import React, { useState, useEffect, useRef } from 'react';
import './css/Home.css';
import axios from 'axios';
import SoundService from './SoundService';
import TypeWriter from './TypeWriter';

function Home() {
    const [imageBlob, setImageBlob] = useState(null);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const effectRan = useRef(false);

    const [showContent, setShowContent] = useState(false);
    const [audioId, setAudioId] = useState(null);
    const [text, setText] = useState('');
    const user_input_txt = useRef(null);  // useRef로 변경
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [showPlayButton, setShowPlayButton] = useState(true);

    useEffect(() => {
        if (effectRan.current === false) {
            const fetchImage = async () => {
                setIsLoading(true);
                try {
                    const response = await axios.get('http://127.0.0.1:8000/random-image-generator', {
                        responseType: 'arraybuffer',
                        maxRedirects: 0,
                        validateStatus: function (status) {
                            return status >= 200 && status < 300;
                        }
                    });

                    const blob = new Blob([response.data], { type: 'image/png' });
                    const imageObjectURL = URL.createObjectURL(blob);
                    setImageBlob(imageObjectURL);

                    const formData = new FormData();
                    const file = new File([blob], 'generated_image.png', { type: 'image/png' });
                    formData.append('file', file);

                    const description = await axios.post('http://127.0.0.1:8000/image-description/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    user_input_txt.current = description.data;  // useRef를 사용해 값 저장
                    setText(description.data);
                    setIsLoading(false);
                    setShowContent(true);
                } catch (err) {
                    console.error('Error fetching image:', err);
                    if (err.response) {
                        setError(`서버 에러: ${err.response.status}`);
                    } else if (err.request) {
                        setError('서버로부터 응답이 없습니다.');
                    } else {
                        setError('요청 설정 중 오류가 발생했습니다.');
                    }
                    setIsLoading(false);
                }
            };

            fetchImage();
        }
        return () => {
            effectRan.current = true;
        };
    }, []);

    useEffect(() => {
        return () => {
            if (imageBlob) {
                URL.revokeObjectURL(imageBlob);
            }
        };
    }, [imageBlob]);


    const handleTextToSpeech = async () => {
      try {
        setIsPlaying(true);
        setShowPlayButton(false);  // 버튼 숨기기

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

    return (
        <div className="home-image-container">
            <div className="home-image-box">
                {loading ? (
                    <div></div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <img src={imageBlob} alt="연습 이미지" />
                )}
            </div>

            {loading && (
                <div className="home-loading">
                    <div className="home-loading-spinner"></div>
                </div>
            )}

            {showContent && (
                <div className="home-toss-recommendation">
                    <div className="home-toss-header">
                        <h3>ToSS의 추천</h3>
                        <SoundService audioId={audioId} />
                        {/* {isPlaying ? '재생 중...' : '음성 재생'} */}
                    </div>
                    {showPlayButton && (
                      <button onClick={handleTextToSpeech} disabled={isPlaying}>
                          <svg viewBox="0 0 24 24" className="icon">
                              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                          </svg>
                          음성 재생
                      </button>
                    )}
                    <audio ref={audioRef} onEnded={handleAudioEnded} controls style={{ display: 'block' }} />
                    <div className="home-toss-content">
                        <TypeWriter text={text} speed={40} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
