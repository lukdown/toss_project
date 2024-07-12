import React, { useEffect, useState } from 'react';
import { Bar, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

function Feedback({ analysisData }) {
  const [feedback, setFeedback] = useState('');

  console.log("Received analysisData:", analysisData); // 데이터 확인을 위한 로그

  useEffect(() => {
    if (analysisData && analysisData.pronunciation) {
      generateFeedback(analysisData.pronunciation);
    }
  }, [analysisData]);
  
  const generateFeedback = (data) => {
    let feedbackText = '';
    if (data && data.utterance_scores) {
      feedbackText += `전체 발음 점수: ${data.utterance_scores.total?.toFixed(2) || 'N/A'}/10\n`;
      feedbackText += `정확성: ${data.utterance_scores.accuracy?.toFixed(2) || 'N/A'}\n`;
      feedbackText += `완전성: ${data.utterance_scores.completeness?.toFixed(2) || 'N/A'}\n`;
      feedbackText += `유창성: ${data.utterance_scores.fluency?.toFixed(2) || 'N/A'}\n`;
      feedbackText += `운율: ${data.utterance_scores.prosodic?.toFixed(2) || 'N/A'}\n`;
    }
    if (data && data.word_scores) {
      feedbackText += `단어 정확성: ${data.word_scores.accuracy?.toFixed(2) || 'N/A'}\n`;
      feedbackText += `단어 강세: ${data.word_scores.stress?.toFixed(2) || 'N/A'}\n`;
      feedbackText += `단어 전체 점수: ${data.word_scores.total?.toFixed(2) || 'N/A'}\n`;
    }
    setFeedback(feedbackText);
  };

  // 음소 분류 및 가이드
  const phoneticGuide = {
    vowels: ['a', 'e', 'i', 'o', 'u'],
    consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'],
    diphthongs: ['ai', 'ay', 'ea', 'ee', 'ey', 'oa', 'oi', 'oo', 'ou', 'ow', 'oy']
  };

  const phoneticTips = {
    'a': "입을 크게 벌리고 혀를 낮게 유지하세요.",
    'e': "입을 옆으로 살짝 벌리고 혀를 중간 높이로 유지하세요.",
    'i': "혀를 앞쪽으로 내밀고 입을 약간 벌리세요.",
    'o': "입술을 둥글게 모으고 소리내세요.",
    'u': "입술을 앞으로 내밀고 소리내세요.",
    'b': "양 입술을 붙였다가 떼면서 소리내세요.",
    'c': "혀의 뒷부분을 입천장에 닿게 하고 소리내세요.",
    'd': "혀의 앞부분을 윗니 뒤쪽에 닿게 하고 소리내세요.",
    'f': "아랫니를 윗입술에 닿게 하고 소리내세요.",
    'g': "혀의 뒷부분을 입천장에 닿게 하고 소리내세요.",
    'h': "숨을 내쉬듯이 소리내세요.",
    'j': "혀의 앞부분을 윗니 뒤쪽에 닿게 하고 소리내세요.",
    'k': "혀의 뒷부분을 입천장에 닿게 하고 소리내세요.",
    'l': "혀의 앞부분을 윗니 뒤쪽에 닿게 하고 소리내세요.",
    'm': "입술을 붙이고 소리내세요.",
    'n': "혀의 앞부분을 윗니 뒤쪽에 닿게 하고 소리내세요.",
    'p': "양 입술을 붙였다가 떼면서 소리내세요.",
    'q': "혀의 뒷부분을 입천장에 닿게 하고 소리내세요.",
    'r': "혀를 입천장에 가깝게 하면서 소리내세요.",
    's': "혀를 앞니 뒤쪽에 가까이 하면서 소리내세요.",
    't': "혀의 앞부분을 윗니 뒤쪽에 닿게 하고 소리내세요.",
    'v': "아랫니를 윗입술에 닿게 하고 소리내세요.",
    'w': "입술을 둥글게 모으고 소리내세요.",
    'x': "혀를 앞니 뒤쪽에 가까이 하면서 소리내세요.",
    'y': "혀를 앞니 뒤쪽에 가깝게 하면서 소리내세요.",
    'z': "혀를 앞니 뒤쪽에 가까이 하면서 소리내세요.",
    'ai': "입을 크게 벌리고 혀를 낮게 유지하세요.",
    'ay': "입을 크게 벌리고 혀를 낮게 유지하세요.",
    'ea': "입을 옆으로 살짝 벌리고 혀를 중간 높이로 유지하세요.",
    'ee': "입을 옆으로 살짝 벌리고 혀를 중간 높이로 유지하세요.",
    'ey': "입을 옆으로 살짝 벌리고 혀를 중간 높이로 유지하세요.",
    'oa': "입술을 둥글게 모으고 소리내세요.",
    'oi': "입술을 둥글게 모으고 소리내세요.",
    'oo': "입술을 앞으로 내밀고 소리내세요.",
    'ou': "입술을 앞으로 내밀고 소리내세요.",
    'ow': "입술을 앞으로 내밀고 소리내세요.",
    'oy': "입술을 앞으로 내밀고 소리내세요.",
  };

  const categorizePhoneScores = () => {
    const categorized = {
      vowels: [],
      consonants: [],
      diphthongs: []
    };

    analysisData?.pronunciation?.phone_scores.forEach((score, index) => {
      const phone = String.fromCharCode(97 + index); // ASCII 코드를 사용해 알파벳 생성
      if (phoneticGuide.vowels.includes(phone)) {
        categorized.vowels.push({ phone, score });
      } else if (phoneticGuide.consonants.includes(phone)) {
        categorized.consonants.push({ phone, score });
      } else if (phoneticGuide.diphthongs.includes(phone)) {
        categorized.diphthongs.push({ phone, score });
      }
    });

    return categorized;
  };

  const categorizedScores = categorizePhoneScores();

  const phoneticFeedback = () => {
    const lowScores = analysisData?.pronunciation?.phone_scores
      .map((score, index) => ({ score, phone: String.fromCharCode(97 + index) }))
      .filter(item => item.score < 0.6)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    return lowScores.map(item => (
      <div key={item.phone} className="phonetic-feedback-item">
        <h4>음소 '{item.phone.toUpperCase()}'</h4>
        <p>점수: {(item.score * 10).toFixed(2)}</p>
        <p>팁: {phoneticTips[item.phone] || "이 음소에 대해 더 연습이 필요합니다."}</p>
      </div>
    ));
  };

  const utteranceChartData = {
    labels: ['정확성', '완전성', '유창성', '운율', '전체'],
    datasets: [
      {
        label: '문장 점수',
        data: analysisData?.pronunciation?.utterance_scores 
          ? [
              analysisData.pronunciation.utterance_scores.accuracy,
              analysisData.pronunciation.utterance_scores.completeness,
              analysisData.pronunciation.utterance_scores.fluency,
              analysisData.pronunciation.utterance_scores.prosodic,
              analysisData.pronunciation.utterance_scores.total
            ] 
          : [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(75, 192, 192)'
      },
    ],
  };

  const phoneChartData = {
    labels: analysisData?.pronunciation?.phone_scores ? [...Array(analysisData.pronunciation.phone_scores.length).keys()] : [],
    datasets: [
      {
        label: '음소 점수',
        data: analysisData?.pronunciation?.phone_scores || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const wordChartData = {
    labels: ['정확성', '강세', '전체'],
    datasets: [
      {
        label: '단어 점수',
        data: analysisData?.pronunciation?.word_scores 
          ? [
              analysisData.pronunciation.word_scores.accuracy,
              analysisData.pronunciation.word_scores.stress,
              analysisData.pronunciation.word_scores.total
            ] 
          : [],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const phoneticCategoryData = {
    labels: ['모음', '자음', '이중모음'],
    datasets: [{
      label: '평균 점수',
      data: [
        categorizedScores.vowels.reduce((sum, item) => sum + item.score, 0) / categorizedScores.vowels.length || 0,
        categorizedScores.consonants.reduce((sum, item) => sum + item.score, 0) / categorizedScores.consonants.length || 0,
        categorizedScores.diphthongs.reduce((sum, item) => sum + item.score, 0) / categorizedScores.diphthongs.length || 0
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: -5,
        suggestedMax: 10
      }
    }
  };

  const barChartOptions = {
    ...options,
    scales: {
      y: {
        beginAtZero: true,
        max: 1
      }
    }
  };

  if (!analysisData || !analysisData.pronunciation) {
    return <div>분석 결과가 없거나 올바른 형식이 아닙니다.</div>;
  }

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">발음 분석</h2>
      //영수 존~~

      <div className="feedback-content">
        <div className="feedback-chart-container">
          <h3 className="feedback-chart-title">문장 점수</h3>
          <div className="feedback-chart">
            <Radar data={utteranceChartData} options={options} />
          </div>
        </div>
        <div className="feedback-chart-container">
          <h3 className="feedback-chart-title">단어 점수</h3>
          <div className="feedback-chart">
            <Bar data={wordChartData} options={options} />
          </div>
        </div>
        <div className="feedback-text-container">
          <h3 className="feedback-text-title">음소별 발음 가이드</h3>
          <div className="phonetic-feedback">
            {phoneticFeedback()}
          </div>
        </div>
        <div className="feedback-text-container">
          <h3 className="feedback-text-title">피드백</h3>
          <div className="feedback-table">
            <table>
              <thead>
                <tr>
                  <th>항목</th>
                  <th>점수</th>
                </tr>
              </thead>
              <tbody>
                {feedback.split('\n').map((line, index) => {
                  const parts = line.split(': ');
                  return parts.length === 2 ? (
                    <tr key={index}>
                      <td>{parts[0]}</td>
                      <td>{parts[1]}</td>
                    </tr>
                  ) : null;
                })}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Feedback;
