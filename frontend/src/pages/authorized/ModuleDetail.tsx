import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';

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
  module: { id: number; title: string; };
  slides: Slide[];
  quizQuestions: QuizQuestion[];
}

const ModuleDetail: React.FC = () => {
  const { levelSlug, moduleSequence } = useParams<{ levelSlug: string; moduleSequence: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [learningDelay, setLearningDelay] = useState(0); // seconds left
  const learningTimer = useRef<any>(null);
  const [showQuizConfirm, setShowQuizConfirm] = useState(false);
  const [showQuizFinishConfirm, setShowQuizFinishConfirm] = useState(false);

  useEffect(() => {
    const fetchModuleDetail = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(`http://localhost:8080/api/modules/${levelSlug}/${moduleSequence}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

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

    if (isAuthenticated && levelSlug && moduleSequence) {
      fetchModuleDetail();
    }
  }, [isAuthenticated, levelSlug, moduleSequence]);

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

  const totalSlides = moduleData?.slides.length || 0;
  const hasQuiz = Object.keys(quizAnswers).length > 0;
  // Quiz is now a single step after all slides
  const quizSlideIndex = hasQuiz ? totalSlides : -1; // Index of the single quiz slide
  // Review is now a single step after the quiz
  const reviewSlideIndex = hasQuiz ? totalSlides + 1 : totalSlides;

  useEffect(() => {
    // Calculate local slide type for timer
    const localIsQuizSlide = currentSlideIndex === quizSlideIndex;
    const localIsReviewSlide = currentSlideIndex === reviewSlideIndex;
    // Reset delay on slide change
    if (!localIsQuizSlide && !localIsReviewSlide) {
      setLearningDelay(10);
      if (learningTimer.current) clearInterval(learningTimer.current);
      learningTimer.current = setInterval(() => {
        setLearningDelay(prev => {
          if (prev <= 1) {
            if (learningTimer.current) clearInterval(learningTimer.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setLearningDelay(0);
      if (learningTimer.current) clearInterval(learningTimer.current);
    }
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
     // TODO: Implement module completion logic (awarding points, marking completed)
     alert('Module Finished! (Completion logic to be implemented)');
     navigate('/modules'); // Redirect back to modules page
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
    navigate('/modules');
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
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

  if (loading) {
    return <div className="module-detail-container">Loading module...</div>;
  }

  if (error) {
    return <div className="module-detail-container">Error: {error}</div>;
  }

  if (!moduleData) {
    return <div className="module-detail-container">Module data not available.</div>;
  }

  const renderSlide = () => {
    if (isReviewSlide) {
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
      <div className="navigation-arrows">
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
        <div className={`learning-delay-indicator${isLearningSlide && learningDelay > 0 ? '' : ' inactive'}`}>
          {isLearningSlide && learningDelay > 0 && (
            <div className="learning-spinner">
              <svg viewBox="0 0 40 40" width="40" height="40">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#539bf5" strokeWidth="4" strokeDasharray={Math.PI * 2 * 18} strokeDashoffset={(1-learningDelay/10)*Math.PI*2*18} />
              </svg>
            </div>
          )}
        </div>
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