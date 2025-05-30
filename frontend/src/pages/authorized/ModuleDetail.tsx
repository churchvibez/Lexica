import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { API_BASE_URL } from '../../apiConfig';

interface Slide {
  id: number;
  module_id: number;
  title: string | null;
  content: string;
  sequence: number;
}

interface QuizQuestion {
  id: number;
  module_id: number;
  question_text: string;
  question_type: string;
  options: string[]; // Assuming options are string arrays for multiple choice
  correct_answer: string;
}

interface ModuleData {
  module: { id: number; title: string; level_id: number; points: number };
  slides: Slide[];
  quizQuestions: QuizQuestion[];
}

const ModuleDetail: React.FC = () => {
  const { levelSlug, moduleOrderId } = useParams<{ levelSlug: string; moduleOrderId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingReload, setPendingReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [learningDelay, setLearningDelay] = useState(0); // seconds left
  const learningTimer = useRef<any>(null);
  const [showQuizConfirm, setShowQuizConfirm] = useState(false);
  const [showQuizFinishConfirm, setShowQuizFinishConfirm] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [awardError, setAwardError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModuleDetail = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/modules/${levelSlug}/${moduleOrderId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.status === 403) {
          navigate('/modules', { replace: true });
          return;
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch module detail');
        }

        const data = await response.json();
        console.log('Module data received:', data);
        setModuleData(data.data);

        // Select exactly 5 quiz questions with a mix of input and multiple choice
        if (data.data.quizQuestions && data.data.quizQuestions.length >= 5) {
          const inputQs = data.data.quizQuestions.filter((q: any) => q.question_type === 'input');
          const mcQs = data.data.quizQuestions.filter((q: any) => q.question_type === 'multiple_choice');
          let selected: any[] = [];
          if (inputQs.length >= 3 && mcQs.length >= 2) {
            // 3 input, 2 multiple choice
            selected = [
              ...inputQs.sort(() => 0.5 - Math.random()).slice(0, 3),
              ...mcQs.sort(() => 0.5 - Math.random()).slice(0, 2),
            ];
          } else if (inputQs.length >= 2 && mcQs.length >= 3) {
            // 2 input, 3 multiple choice
            selected = [
              ...inputQs.sort(() => 0.5 - Math.random()).slice(0, 2),
              ...mcQs.sort(() => 0.5 - Math.random()).slice(0, 3),
            ];
          } else {
            // fallback: just pick 5 random
            selected = data.data.quizQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
          }
          // Shuffle the selected questions
          selected = selected.sort(() => 0.5 - Math.random());
          setQuizAnswers(selected.reduce((acc: any, question: any) => ({
            ...acc,
            [question.id.toString()]: ''
          }), {}));
          data.data.quizQuestions = selected;
        } else {
          console.warn('Not enough quiz questions available.', data.data.quizQuestions);
          setQuizAnswers({});
        }

      } catch (err: any) {
        console.error('Error fetching module detail:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && levelSlug && moduleOrderId) {
      fetchModuleDetail();
    }
  }, [isAuthenticated, levelSlug, moduleOrderId]);

  useEffect(() => {
    // Add event listener for browser back button
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

  // On mount, check for reload in the middle of a quiz
  useEffect(() => {
    const isQuizOrModule = !isReviewSlide;
    if (isQuizOrModule) {
      if (sessionStorage.getItem('inModuleQuiz') === 'true') {
        setShowExitConfirm(true);
        setPendingReload(true);
      } else {
        sessionStorage.setItem('inModuleQuiz', 'true');
      }
    } else {
      sessionStorage.removeItem('inModuleQuiz');
    }
    // Cleanup on unmount
    return () => {
      sessionStorage.removeItem('inModuleQuiz');
    };
  // eslint-disable-next-line
  }, []);

  const totalSlides = moduleData?.slides.length || 0;
  const hasQuiz = Object.keys(quizAnswers).length > 0;
  // Quiz is now a single step after all slides
  const quizSlideIndex = hasQuiz ? totalSlides : -1; // Index of the single quiz slide
  // Review is now a single step after the quiz
  const reviewSlideIndex = hasQuiz ? totalSlides + 1 : totalSlides;

  useEffect(() => {
    // Remove time delay for testing: always set learningDelay to 0
    setLearningDelay(0);
    if (learningTimer.current) clearInterval(learningTimer.current);
    return () => {
      if (learningTimer.current) clearInterval(learningTimer.current);
    };
  // eslint-disable-next-line
  }, [currentSlideIndex, quizSlideIndex, reviewSlideIndex]);

  // Calculate total number of steps (slides + quiz + review)
  const totalSteps = totalSlides + (hasQuiz ? 1 : 0) + (hasQuiz ? 1 : 0); // slides + quiz + review

  // Determine if Next button should be disabled
  // Move these variable declarations here to avoid linter errors
  const isQuizSlide = currentSlideIndex === quizSlideIndex;
  const isReviewSlide = currentSlideIndex === reviewSlideIndex;
  const isLearningSlide = !isQuizSlide && !isReviewSlide;
  const isNextDisabled = (isLearningSlide && learningDelay > 0) || (isQuizSlide && Object.entries(quizAnswers).some(([_, answer]) => !answer.trim()));

  const handleNext = () => {
    // If on the last learning slide, show quiz confirm dialog
    if (currentSlideIndex === quizSlideIndex - 1) {
      setShowQuizConfirm(true);
      return;
    }
    // If on quiz slide, show finish confirmation dialog
    if (isQuizSlide) {
      setShowQuizFinishConfirm(true);
      return;
    }
    if (currentSlideIndex < totalSteps - 1) {
      // If on quiz slide, calculate score when moving to review
      if (isQuizSlide) {
        let correctAnswers = 0;
        Object.entries(quizAnswers).forEach(([questionId, answer]) => {
          const question = moduleData?.quizQuestions.find(q => q.id.toString() === questionId);
          if (question && answer.toLowerCase() === question.correct_answer.toLowerCase()) {
            correctAnswers++;
          }
        });
        setQuizScore(correctAnswers);
      }
      setCurrentSlideIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      if (isReviewSlide) {
        // Show exit confirmation instead of going back
        setShowExitConfirm(true);
        return;
      }
      setCurrentSlideIndex(prevIndex => prevIndex - 1);
    }
  };

   const handleFinishModule = () => {
     navigate('/modules');
   };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setQuizAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(quizAnswers).length < Object.keys(quizAnswers).length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setQuizSubmitted(true);
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    navigate('/modules');
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
    if (pendingReload) {
      navigate('/modules'); // If reload, always redirect
    }
  };

  const confirmQuizStart = () => {
    setShowQuizConfirm(false);
    setCurrentSlideIndex(prevIndex => prevIndex + 1);
  };

  const cancelQuizStart = () => {
    setShowQuizConfirm(false);
  };

  const confirmQuizFinish = () => {
    setShowQuizFinishConfirm(false);
    // Calculate score and go to review
    let correctAnswers = 0;
    Object.entries(quizAnswers).forEach(([questionId, answer]) => {
      const question = moduleData?.quizQuestions.find(q => q.id.toString() === questionId);
      if (question && answer.toLowerCase() === question.correct_answer.toLowerCase()) {
        correctAnswers++;
      }
    });
    setQuizScore(correctAnswers);
    setCurrentSlideIndex(prevIndex => prevIndex + 1);
  };

  const cancelQuizFinish = () => {
    setShowQuizFinishConfirm(false);
  };

  useEffect(() => {
    // When entering the review slide for the first time, award XP
    if (isReviewSlide && !xpAwarded && moduleData) {
      const awardXP = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) return;
          const res = await fetch(`${API_BASE_URL}/api/modules/${moduleData.module.id}/complete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ correctAnswers: quizScore }),
          });
          const data = await res.json();
          if (!data.success) {
            setAwardError(data.message || 'Failed to award XP');
          } else {
            setXpAwarded(true);
            setAwardError(null);
            // Optionally: update user XP in UI here
          }
        } catch (err) {
          setAwardError('Failed to award XP');
        }
      };
      awardXP();
    }
  }, [isReviewSlide, xpAwarded, moduleData, quizScore]);

  useEffect(() => {
    if (!isReviewSlide) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isReviewSlide]);

  if (loading) {
    return <div className="module-detail-container">Loading module...</div>;
  }

  if (error === 'Module not unlocked yet') {
    navigate('/modules', { replace: true });
    return null;
  }
  if (error) {
    return null;
  }

  if (!moduleData) {
    return <div className="module-detail-container">Module data not available.</div>;
  }

  const renderSlide = () => {
    if (isReviewSlide) {
      // Calculate XP breakdown
      let baseXP = 0;
      if (moduleData.module) {
        if (moduleData.module.level_id === 1) baseXP = 5;
        else if (moduleData.module.level_id === 2) baseXP = 10;
        else if (moduleData.module.level_id === 3) baseXP = 20;
      }
      const correctXP = quizScore; // 1 XP per correct answer
      const totalXP = baseXP + correctXP;
      return (
        <div className="module-review-slide">
          <h2>Quiz Review</h2>
          <p className="quiz-score">You got {quizScore} out of 5 questions correct.</p>
          <hr className="quiz-review-separator" />
          {Object.entries(quizAnswers).map(([questionId, answer], idx) => {
            const question = moduleData.quizQuestions.find(q => q.id.toString() === questionId);
            if (!question) return null;
            const isCorrect = answer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase();
            return (
              <div key={questionId} className={`quiz-review-question ${isCorrect ? 'correct' : 'incorrect'}`}> 
                <span className="question-number">{idx + 1}.</span>
                <span className={`result-label ${isCorrect ? 'correct' : 'incorrect'}`}>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                <p><strong>Question:</strong> {question.question_text}</p>
                <p><strong>Your Answer:</strong> {answer}</p>
                <p><strong>Correct Answer:</strong> {question.correct_answer}</p>
              </div>
            );
          })}
          <div className="xp-breakdown" style={{marginTop: 24, textAlign: 'center'}}>
            <h4>XP Gained</h4>
            <p>Module completion: <strong>+{baseXP} XP</strong></p>
            <p>Correct answers XP: <strong>+{correctXP} XP</strong></p>
            <p>Total XP: <strong>+{totalXP} XP</strong></p>
            {awardError && <p style={{ color: 'red' }}>Error awarding XP: {awardError}</p>}
            {xpAwarded && <p style={{ color: 'green' }}>XP awarded!</p>}
          </div>
        </div>
      );
    } else if (isQuizSlide) {
      return (
        <div className="module-quiz-slide">
          <h3>Quiz</h3>
          {Object.keys(quizAnswers).map((questionId, index) => {
            const question = moduleData.quizQuestions.find(q => q.id.toString() === questionId);
            if (!question) return null;
            
            return (
              <div key={questionId} className="quiz-question-item">
                <p>Question {index + 1}/5: {question.question_text}</p>
                {
                  question.question_type === 'multiple_choice' && (
                    <div className="options-container">
                      {question.options.map(option => (
                        <button
                          key={option}
                          className={`option-button ${quizAnswers[questionId] === option ? 'selected' : ''}`}
                          onClick={() => handleAnswerChange(questionId, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )
                }
                {
                  question.question_type === 'input' && (
                    <input
                      type="text"
                      value={quizAnswers[questionId] || ''}
                      onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                      placeholder="Type your answer here"
                    />
                  )
                }
              </div>
            );
          })}
        </div>
      );
    } else if (currentSlideIndex < totalSlides) {
      const currentSlide = moduleData.slides[currentSlideIndex];
      return (
        <div className="module-slide-content">
          {currentSlide.title && <h3>{currentSlide.title}</h3>}
          <div dangerouslySetInnerHTML={{ __html: currentSlide.content }} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="module-detail-container">
      <div className="module-header">
        <h1 className="module-learning-title">{moduleData.module.title}</h1>
        {!isReviewSlide && (
          <button className="exit-button" onClick={handleExit}>✕</button>
        )}
      </div>

      {showExitConfirm && (
        <div className="exit-confirm-overlay">
          <div className="exit-confirm-dialog">
            <h3>Exit Module?</h3>
            <p>Are you sure you want to exit? Your progress will be lost.</p>
            <div className="exit-confirm-buttons">
              <button onClick={confirmExit} className="confirm-exit">Yes, Exit</button>
              <button onClick={cancelExit} className="cancel-exit">No, Stay</button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz start confirmation dialog */}
      {showQuizConfirm && (
        <div className="exit-confirm-overlay">
          <div className="exit-confirm-dialog">
            <h3>Ready for the Quiz?</h3>
            <p>Are you sure you want to start the quiz? You won't be able to go back to the learning slides.</p>
            <div className="exit-confirm-buttons">
              <button onClick={confirmQuizStart} className="confirm-exit">Yes, Start Quiz</button>
              <button onClick={cancelQuizStart} className="cancel-exit">No, Keep Learning</button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz finish confirmation dialog */}
      {showQuizFinishConfirm && (
        <div className="exit-confirm-overlay">
          <div className="exit-confirm-dialog">
            <h3>Are you sure you want to finish the test?</h3>
            <div className="exit-confirm-buttons">
              <button onClick={confirmQuizFinish} className="confirm-exit">Yes, Finish</button>
              <button onClick={cancelQuizFinish} className="cancel-exit">No, Go Back</button>
            </div>
          </div>
        </div>
      )}

      <div className="module-content-area">
        {renderSlide()}
      </div>

      <div className="slide-tracker">
        {moduleData.slides.map((_, index) => (
          <div
            key={index}
            className={`tracker-circle ${
              index === currentSlideIndex
                ? 'current'
                : index < currentSlideIndex
                ? 'completed'
                : ''
            }`}
          >
            {index + 1}
          </div>
        ))}
        <div
          className={`tracker-circle ${
            currentSlideIndex === moduleData.slides.length ? 'current' : ''
          }`}
        >
          Q
        </div>
        <div
          className={`tracker-circle ${
            currentSlideIndex === moduleData.slides.length + 1 ? 'current' : ''
          }`}
        >
          R
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className={`navigation-arrows${(isQuizSlide || isReviewSlide) ? ' center-nav' : ''}`}>
        {/* Only show Previous if not on quiz or review */}
        {!(isQuizSlide || isReviewSlide) && (
          <button
            className="module-nav-btn prev-btn"
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
          >
            Previous
          </button>
        )}
        <button
          className={isReviewSlide ? "finish-module-btn" : "module-nav-btn next-btn"}
          onClick={isReviewSlide ? handleFinishModule : handleNext}
          disabled={isReviewSlide ? false : isNextDisabled}
        >
          {isReviewSlide ? 'Finish Module' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default ModuleDetail; 