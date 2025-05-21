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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [randomQuizQuestions, setRandomQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [showReview, setShowReview] = useState(false);
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
        setModuleData(data.data);

        // Select 5 random quiz questions
        if (data.data.quizQuestions && data.data.quizQuestions.length >= 5) {
          const shuffledQuestions = data.data.quizQuestions.sort(() => 0.5 - Math.random());
          setRandomQuizQuestions(shuffledQuestions.slice(0, 5));
        } else {
           // Handle case where there aren't enough questions, maybe show a message or disable quiz
           console.warn('Not enough quiz questions available.', data.data.quizQuestions);
           setRandomQuizQuestions([]); // Ensure it's an empty array
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

  const totalSlides = moduleData?.slides.length || 0;
  const hasQuiz = randomQuizQuestions.length > 0;
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
       // Ensure all quiz questions are answered before going to review
       if (isQuizSlide && Object.keys(userAnswers).length < randomQuizQuestions.length) {
         alert('Please answer all quiz questions before submitting.');
         return; // Prevent navigation
       }
      setCurrentSlideIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prevIndex => prevIndex - 1);
    }
  };

   const handleFinishModule = () => {
     // TODO: Implement module completion logic (awarding points, marking completed)
     alert('Module Finished! (Completion logic to be implemented)');
     navigate('/modules'); // Redirect back to modules page
   };

  const handleAnswerChange = (questionId: number, answer: string | string[]) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(userAnswers).length < randomQuizQuestions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    let correctAnswers = 0;
    randomQuizQuestions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (question.question_type === 'multiple_choice') {
        if (userAnswer === question.correct_answer) {
          correctAnswers++;
        }
      } else if (question.question_type === 'input') {
        // For input questions, we'll do a case-insensitive comparison
        if (typeof userAnswer === 'string' && userAnswer.toLowerCase() === question.correct_answer.toLowerCase()) {
           correctAnswers++;
        }
      }
    });
    setQuizScore(correctAnswers);
    setShowReview(true);
    // Stay on the quiz slide until Next is clicked to go to review
    // setCurrentSlideIndex(reviewSlideIndex);
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
          <p>You got {quizScore} out of {randomQuizQuestions.length} questions correct.</p>
          {randomQuizQuestions.map(question => (
            <div key={question.id} className="quiz-review-question">
              <p><strong>Question:</strong> {question.question_text}</p>
              <p><strong>Your Answer:</strong> {userAnswers[question.id]?.toString() || 'Not answered'}</p>
              <p><strong>Correct Answer:</strong> {question.correct_answer}</p>
            </div>
          ))}
           {/* Add completion logic/button here later */}
        </div>
      );
    } else if (isQuizSlide) {
       return (
         <div className="module-quiz-slide">
           <h3>Quiz</h3>
           {randomQuizQuestions.map((question, index) => (
             <div key={question.id} className="quiz-question-item">
               <p>Question {index + 1}/{randomQuizQuestions.length}: {question.question_text}</p>
               {
                 question.question_type === 'multiple_choice' && (
                   <div className="options-container">
                     {question.options.map(option => (
                       <button
                         key={option}
                         className={`option-button ${userAnswers[question.id] === option ? 'selected' : ''}`}
                         onClick={() => handleAnswerChange(question.id, option)}
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
                      value={userAnswers[question.id] as string || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Type your answer here"
                    />
                  )
               }
             </div>
           ))}
           {/* Show submit button once user has answered all questions */}
           {Object.keys(userAnswers).length === randomQuizQuestions.length && !showReview && (
              <button onClick={handleSubmitQuiz}>Submit Quiz</button>
           )}
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
    return null; // Should not happen with proper indexing
  };

  // Determine if Next button should be disabled
  const isNextDisabled = isQuizSlide && (Object.keys(userAnswers).length < randomQuizQuestions.length || !showReview);

  return (
    <div className="module-detail-container">
      <h2>{moduleData.module.title}</h2>

      {/* Slide Tracker */}
      <div className="slide-tracker">
        {/* Slides */}
        {moduleData.slides.map((_, index) => (
          <div
            key={`slide-${index}`}
            className={`tracker-circle ${currentSlideIndex === index ? 'current' : ''} ${currentSlideIndex > index ? 'completed' : ''}`}
          >
            {index + 1}
          </div>
        ))}
        {/* Quiz (single circle) */}
         {hasQuiz && (
          <div
            key={`quiz-tracker`}
            className={`tracker-circle ${currentSlideIndex === quizSlideIndex ? 'current' : ''} ${currentSlideIndex > quizSlideIndex ? 'completed' : ''}`}
          >
             Q
          </div>
        )}
        {/* Review (single circle)*/}
         {hasQuiz && (
           <div
            key={`review-tracker`}
            className={`tracker-circle ${currentSlideIndex === reviewSlideIndex ? 'current' : ''} ${currentSlideIndex > reviewSlideIndex ? 'completed' : ''}`}
          >
             R
          </div>
         )}
      </div>

      <div className="module-content-area">
        {renderSlide()}
      </div>

      {/* Navigation Arrows */}
      <div className="navigation-arrows">
        {currentSlideIndex > 0 && (
          <button onClick={handlePrev}>Previous</button>
        )}
        {currentSlideIndex < totalSteps -1 && (
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