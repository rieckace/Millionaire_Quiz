import React, { useState, useEffect, useRef } from 'react';
import { Trophy, HelpCircle, Users, Timer, Coins } from 'lucide-react';
import './App.css';

// Sound imports
import playSound from './sounds/play.mp3';
import correctSound from './sounds/correct.mp3';
import wrongSound from './sounds/wrong.mp3';
import waitSound from './sounds/wait.mp3';

// Expanded questions database
const questions = [
  {
    question: "Which is the largest planet in our solar system?",
    options: ["Mars", "Jupiter", "Saturn", "Venus"],
    correct: 1,
    prize: "1,000"
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correct: 1,
    prize: "2,000"
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Fe", "Au", "Cu"],
    correct: 2,
    prize: "5,000"
  },
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Rome"],
    correct: 2,
    prize: "10,000"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Mercury"],
    correct: 2,
    prize: "20,000"
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correct: 1,
    prize: "40,000"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
    correct: 2,
    prize: "80,000"
  },
  {
    question: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Shanghai"],
    correct: 2,
    prize: "160,000"
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correct: 1,
    prize: "320,000"
  },
  {
    question: "Who developed the theory of relativity?",
    options: ["Isaac Newton", "Stephen Hawking", "Nikola Tesla", "Albert Einstein"],
    correct: 3,
    prize: "640,000"
  }
];

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const audioRef = useRef(new Audio(playSound));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    audioRef.current.play();
    onLogin(username);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
        <h1 className="login-title">Quiz Master</h1>
        <p className="login-subtitle">Test your knowledge and win big!</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="login-input"
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
}

function Game({ username, onLogout }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameState, setGameState] = useState('playing');
  const [timer, setTimer] = useState(30);

  // Sound refs
  const correctAudioRef = useRef(new Audio(correctSound));
  const wrongAudioRef = useRef(new Audio(wrongSound));
  const waitAudioRef = useRef(new Audio(waitSound));

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(index);
    waitAudioRef.current.play();
    
    setTimeout(() => {
      if (index === questions[currentQuestion].correct) {
        correctAudioRef.current.play();
        if (currentQuestion === questions.length - 1) {
          setGameState('won');
        } else {
          setCurrentQuestion(prev => prev + 1);
          setSelectedOption(null);
          setTimer(30);
        }
      } else {
        wrongAudioRef.current.play();
        setGameState('lost');
      }
    }, 2000);
  };

  useEffect(() => {
    if (gameState !== 'playing' || selectedOption !== null) return;
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          wrongAudioRef.current.play();
          setGameState('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, selectedOption]);

  if (gameState === 'won') {
    return (
      <div className="result-container">
        <Trophy className="w-24 h-24 text-yellow-400 mb-6" />
        <h2 className="result-title">Congratulations, {username}!</h2>
        <p className="result-subtitle">You've won ₹{questions[questions.length - 1].prize}!</p>
        <button onClick={onLogout} className="play-again-button">
          Play Again
        </button>
      </div>
    );
  }

  if (gameState === 'lost') {
    return (
      <div className="result-container">
        <HelpCircle className="w-24 h-24 text-red-400 mb-6" />
        <h2 className="result-title">Game Over, {username}</h2>
        <p className="result-subtitle">You won ₹{currentQuestion > 0 ? questions[currentQuestion - 1].prize : '0'}</p>
        <button onClick={onLogout} className="play-again-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="player-info">
          <Users className="w-5 h-5" />
          <span>{username}</span>
        </div>
        <div className="timer-info">
          <Timer className="w-5 h-5" />
          <span>{timer}s</span>
        </div>
        <div className="prize-info">
          <Coins className="w-5 h-5" />
          <span>₹{questions[currentQuestion].prize}</span>
        </div>
      </div>

      <div className="question-container">
        <h2 className="question-text">
          {questions[currentQuestion].question}
        </h2>
        
        <div className="options-grid">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`option-button ${
                selectedOption === index
                  ? index === questions[currentQuestion].correct
                    ? 'correct'
                    : 'wrong'
                  : ''
              }`}
              disabled={selectedOption !== null}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState('');

  return (
    <div className="app-container">
      {!username ? (
        <Login onLogin={setUsername} />
      ) : (
        <Game username={username} onLogout={() => setUsername('')} />
      )}
    </div>
  );
}

export default App;