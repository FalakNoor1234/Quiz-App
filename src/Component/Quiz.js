import React, { useState, useCallback } from 'react';
import './Quiz.css';  // Import the Quiz.css file
import Data from './Data';

// Function to shuffle an array
const shuffleArray = (array) => {
  let shuffledArray = array.slice(); // Copy array to avoid mutating the original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const Quiz = () => {
  const [data, setData] = useState(shuffleArray(Data)); // Store the shuffled data
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question index
  const [score, setScore] = useState(0); // Track the user's score
  const [showScore, setShowScore] = useState(false); // Show score after the last question
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Track selected answers for each question
  const [quizStarted, setQuizStarted] = useState(false); // Track whether the quiz has started

  const currentQuestion = data[currentQuestionIndex];
  const questionKey = Object.keys(currentQuestion).find(key => key.startsWith('Q'));
  const options = ['a', 'b', 'c', 'd']; // Label options as a, b, c, d

  const handleNextClick = useCallback(() => {
    if (selectedAnswers[currentQuestionIndex]) {
      if (currentQuestion[selectedAnswers[currentQuestionIndex]] === currentQuestion.ans) {
        setScore(score + 1); // Increment the score if the answer is correct
      }

      if (currentQuestionIndex < data.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowScore(true); // Show score after the last question
      }
    }
  }, [selectedAnswers, currentQuestion, currentQuestionIndex, score, data.length]);

  const handlePreviousClick = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleRestart = () => {
    setData(shuffleArray(Data)); // Shuffle questions
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswers({}); // Reset selected answers on restart
    setQuizStarted(false); // Return to the start screen
  };

  // Handle when an option is clicked
  const handleAnswerClick = (option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    })); // Set the selected answer for the current question
  };

  return (
    <div className="container">
      <div className="quiz-box">
        {!quizStarted ? (
          // Start quiz screen
          <div>
            <h2>Welcome to the Quiz</h2>
            <button onClick={() => setQuizStarted(true)}>Start Quiz</button>
          </div>
        ) : showScore ? (
          // Show score after quiz ends
          <div>
            <h1>Your Score: {score}/{data.length}</h1>
            <button onClick={handleRestart}>Restart Quiz</button>
          </div>
        ) : (
          // Quiz questions
          <div>
            <h2>Question {currentQuestionIndex + 1} of {data.length}</h2>
            <h3>{currentQuestion[questionKey]}</h3>
            <ul>
              {options.map((option) => (
                <li key={option}>
                  <button
                    onClick={() => handleAnswerClick(option)}
                    className={selectedAnswers[currentQuestionIndex] === option ? 'selected' : ''}
                  >
                    {`${option}) ${currentQuestion[option]}`}
                  </button>
                </li>
              ))}
            </ul>
            <div className="navigation-buttons">
              {currentQuestionIndex > 0 && (
                <button onClick={handlePreviousClick}>Previous</button>
              )}
              {currentQuestionIndex < data.length - 1 ? (
                <button onClick={handleNextClick}>Next</button>
              ) : (
                <button onClick={() => setShowScore(true)}>Submit</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;


