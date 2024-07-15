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
    const user_input_txt = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [showPlayButton, setShowPlayButton] = useState(true);
    const [showAudioControl, setShowAudioControl] = useState(false);
    const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

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

                    user_input_txt.current = description.data;
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
                    setShowPlayButton(true);
                    setShowAudioControl(false);
                });
            }

        } catch (error) {
            console.error('Error:', error);
            setIsPlaying(false);
            setShowPlayButton(true);
            setShowAudioControl(false);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
        setShowPlayButton(true);
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
                    </div>
                    <div className="playing-btn-box">
                        {showAudioControl && (
                            <audio ref={audioRef} onEnded={handleAudioEnded} controls style={{ display: 'block' }} />
                        )}
                        {!hasPlayedOnce && (  // 이 부분을 변경
                            <button className="home-playing-btn" onClick={handleTextToSpeech} disabled={isPlaying}>
                                <span>
                                    <svg viewBox="0 0 24 24" className="icon">
                                    <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z" />
                                    </svg>
                                </span>
                            </button>
                        )}
                    </div>
                    <div className="home-toss-content">
                        <TypeWriter text={text} speed={40} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;