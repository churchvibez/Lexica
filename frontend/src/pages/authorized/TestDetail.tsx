import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { API_BASE_URL } from '../../apiConfig.ts';
import '../../design.scss';

interface TestQuestion {
  id: number;
  test_id: number;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
}

interface TestData {
  test: { id: number; title: string; level_id: number; sequence: number };
  questions: TestQuestion[];
}

// Normalization function for answers
function normalizeAnswer(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/' | '|`/g, "'") // replace curly/smart apostrophes with straight
    .replace(/"|"/g, '"')   // replace curly quotes with straight
    .replace(/[.,!?;:]/g, '') // remove punctuation
    .replace(/\s+/g, ' ');  // collapse multiple spaces
}

// Shuffle array utility
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TestDetail: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [awardError, setAwardError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingReload, setPendingReload] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) throw new Error('No access token');
        const res = await fetch(`${API_BASE_URL}/api/tests/${testId}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (res.status === 403) {
          navigate('/tests', { replace: true });
          return;
        }
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to fetch test');
        setTestData(data.data);
        setAnswers(data.data.questions.reduce((acc: any, q: any) => ({ ...acc, [q.id]: '' }), {}));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && testId) fetchTest();
  }, [isAuthenticated, testId, navigate]);

  useEffect(() => {
    const isTestInProgress = !submitted;
    if (isTestInProgress) {
      if (sessionStorage.getItem('inTestQuiz') === 'true') {
        setShowExitConfirm(true);
        setPendingReload(true);
      } else {
        sessionStorage.setItem('inTestQuiz', 'true');
      }
    } else {
      sessionStorage.removeItem('inTestQuiz');
    }
    // Cleanup on unmount
    return () => {
      sessionStorage.removeItem('inTestQuiz');
    };
  // eslint-disable-next-line
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    let correct = 0;
    testData?.questions.forEach(q => {
      if (
        answers[q.id] &&
        normalizeAnswer(answers[q.id]) === normalizeAnswer(q.correct_answer)
      ) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  useEffect(() => {
    // Award XP on first review
    if (submitted && !xpAwarded && testData) {
      const awardXP = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) return;
          const res = await fetch(`${API_BASE_URL}/api/tests/${testData.test.id}/complete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ correctAnswers: score }),
          });
          const data = await res.json();
          if (!data.success) {
            setAwardError(data.message || 'Failed to award XP');
          } else {
            setXpAwarded(true);
            setAwardError(null);
          }
        } catch (err) {
          setAwardError('Failed to award XP');
        }
      };
      awardXP();
    }
  }, [submitted, xpAwarded, testData, score]);

  useEffect(() => {
    // Add event listener for browser back button (1:1 with ModuleDetail)
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      setShowExitConfirm(true);
      // Push a new state to prevent the back navigation
      window.history.pushState(null, '', window.location.href);
    };
    // Push initial state
    window.history.pushState(null, '', window.location.href);
    // Add event listener
    window.addEventListener('popstate', handlePopState);
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    navigate('/tests');
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
    if (pendingReload) {
      navigate('/tests'); // If reload, always redirect
    }
  };

  useEffect(() => {
    if (!submitted) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [submitted]);

  // Only show the exit dialog and block navigation away until the user confirms, just like in modules
  useEffect(() => {
    if (!submitted) {
      const handlePopState = (e: PopStateEvent) => {
        setShowExitConfirm(true);
        // Prevent navigation
        window.history.pushState(null, '', window.location.pathname);
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [submitted]);

  useEffect(() => {
    // After fetching testData, select only 5 questions (2/3 multiple choice, 3/2 input if possible)
    if (testData && testData.questions.length > 5) {
      const inputQs = testData.questions.filter(q => q.question_type === 'input');
      const mcQs = testData.questions.filter(q => q.question_type === 'multiple_choice');
      let selected: TestQuestion[] = [];
      if (inputQs.length >= 3 && mcQs.length >= 2) {
        selected = [
          ...inputQs.sort(() => 0.5 - Math.random()).slice(0, 3),
          ...mcQs.sort(() => 0.5 - Math.random()).slice(0, 2),
        ];
      } else if (inputQs.length >= 2 && mcQs.length >= 3) {
        selected = [
          ...inputQs.sort(() => 0.5 - Math.random()).slice(0, 2),
          ...mcQs.sort(() => 0.5 - Math.random()).slice(0, 3),
        ];
      } else {
        selected = testData.questions.sort(() => 0.5 - Math.random()).slice(0, 5);
      }
      // Shuffle selected
      selected = selected.sort(() => 0.5 - Math.random());
      // Shuffle options for multiple choice questions
      const shuffledQuestions = selected.map(q =>
        q.question_type === 'multiple_choice'
          ? { ...q, options: shuffleArray(q.options) }
          : q
      );
      setTestData({ ...testData, questions: shuffledQuestions });
      // Reset answers to only these 5 questions
      setAnswers(shuffledQuestions.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {}));
    }
  }, [testData]);

  if (loading) return null;
  if (error === 'Test not unlocked yet') {
    navigate('/tests', { replace: true });
    return null;
  }
  if (error) return null;
  if (!testData) return <div>Test not found.</div>;

  // XP logic for tests
  let bonusXP = 0;
  if (testData.test.level_id === 1) bonusXP = score;
  else if (testData.test.level_id === 2) bonusXP = 9 + score;
  else if (testData.test.level_id === 3) bonusXP = 19 + score;

  return (
    <div className="module-detail-container">
      <div className="module-header">
        <h1 className="module-learning-title">{testData.test.title}</h1>
        {!submitted && (
          <button className="exit-button" onClick={handleExit}>✕</button>
        )}
      </div>
      {showExitConfirm && (
        <div className="exit-confirm-overlay">
          <div className="exit-confirm-dialog">
            <h3>Exit Test?</h3>
            <p>Are you sure you want to exit? Your progress will be lost.</p>
            <div className="exit-confirm-buttons">
              <button onClick={confirmExit} className="confirm-exit">Yes, Exit</button>
              <button onClick={cancelExit} className="cancel-exit">No, Stay</button>
            </div>
          </div>
        </div>
      )}
      <div className="module-content-area">
        {!submitted ? (
          <div className="module-quiz-slide">
            <h3>Test</h3>
            {testData.questions.map((q, idx) => (
              <div key={q.id} className="quiz-question-item">
                <p>Question {idx + 1}/5: {q.question_text}</p>
                {q.question_type === 'multiple_choice' ? (
                  <div className="options-container">
                    {q.options.map(option => (
                      <button
                        key={option}
                        className={`option-button ${answers[q.id] === option ? 'selected' : ''}`}
                        onClick={() => handleAnswerChange(q.id.toString(), option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={answers[q.id] || ''}
                    onChange={e => handleAnswerChange(q.id.toString(), e.target.value)}
                    placeholder="Type your answer here"
                  />
                )}
              </div>
            ))}
            <button
              className="module-nav-btn next-btn"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== 5 || Object.values(answers).some(a => !a.trim())}
            >
              Submit Test
            </button>
          </div>
        ) : (
          <div className="module-review-slide">
            <h2>Test Review</h2>
            <p className="quiz-score">You got {score} out of 5 questions correct.</p>
            <hr className="quiz-review-separator" />
            {testData.questions.map((q, idx) => {
              const isCorrect =
                answers[q.id] &&
                normalizeAnswer(answers[q.id]) === normalizeAnswer(q.correct_answer);
              return (
                <div key={q.id} className={`quiz-review-question ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <span className="question-number">{idx + 1}.</span>
                  <span className={`result-label ${isCorrect ? 'correct' : 'incorrect'}`}>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                  <p><strong>Question:</strong> {q.question_text}</p>
                  <p><strong>Your Answer:</strong> {answers[q.id]}</p>
                  <p><strong>Correct Answer:</strong> {q.correct_answer}</p>
                </div>
              );
            })}
            <div className="xp-breakdown" style={{marginTop: 24, textAlign: 'center'}}>
              <h4>XP Gained</h4>
              <p>Correct answers XP: <strong>+{bonusXP} XP</strong></p>
              {awardError && <p style={{ color: 'red' }}>Error awarding XP: {awardError}</p>}
              {xpAwarded && <p style={{ color: 'green' }}>XP awarded!</p>}
            </div>
            <div style={{ width: '100%', marginTop: 24 }}>
              <button
                className="finish-module-btn"
                style={{ display: 'block', margin: '0 auto' }}
                onClick={() => navigate('/tests')}
              >
                Finish Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDetail; 