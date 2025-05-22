import React, { useEffect, useState } from 'react';
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

        // Select exactly 5 random quiz questions
        if (data.data.quizQuestions && data.data.quizQuestions.length >= 5) {
          const shuffledQuestions = data.data.quizQuestions.sort(() => 0.5 - Math.random());
          const selectedQuestions = shuffledQuestions.slice(0, 5);
          setQuizAnswers(selectedQuestions.reduce((acc, question) => ({
            ...acc,
            [question.id.toString()]: ''
          }), {}));
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

  const isQuizSlide = currentSlideIndex === quizSlideIndex;
  const isReviewSlide = currentSlideIndex === reviewSlideIndex;

  // Calculate total number of steps (slides + quiz + review)
  const totalSteps = totalSlides + (hasQuiz ? 1 : 0) + (hasQuiz ? 1 : 0); // slides + quiz + review

  const handleNext = () => {
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
          {Object.entries(quizAnswers).map(([questionId, answer]) => {
            const question = moduleData.quizQuestions.find(q => q.id.toString() === questionId);
            if (!question) return null;
            const isCorrect = answer.toLowerCase() === question.correct_answer.toLowerCase();
            
            return (
              <div key={questionId} className={`quiz-review-question ${isCorrect ? 'correct' : 'incorrect'}`}>
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

  // Determine if Next button should be disabled
  const isNextDisabled = isQuizSlide && Object.entries(quizAnswers).some(([_, answer]) => !answer.trim());

  return (
    <div className="module-detail-container">
      <div className="module-header">
        <h1>{moduleData.module.title}</h1>
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

      <div className="module-content-area">
        {renderSlide()}
      </div>

      {/* Navigation Arrows */}
      <div className="navigation-arrows">
        {currentSlideIndex > 0 && !isReviewSlide && (
          <button onClick={handlePrev}>Previous</button>
        )}
        {currentSlideIndex < totalSteps - 1 && (
          <button onClick={handleNext} disabled={isNextDisabled}>Next</button>
        )}
        {isReviewSlide && (
          <button onClick={handleFinishModule}>Finish Module</button>
        )}
      </div>
    </div>
  );
};

export default ModuleDetail; 