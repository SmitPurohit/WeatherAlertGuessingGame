// src/components/Game.js
import React, { useEffect, useState } from 'react';
import AlertProfile from './AlertProfile';
import MapComponent from './MapComponent';
import { getRandomCounty, getWeatherData } from '../services/api';
import { getDistance } from '../utils/haversine';
import './Game.css';

const totalRounds = 5;

// Helper function that returns a round's data, retrying if there are fewer than 5 alerts.
const getRoundData = async () => {
    let county, weatherData, sortedCounts;
    do {
      county = getRandomCounty();
      weatherData = await getWeatherData(county.lat, county.lon);
      const counts = {};
      if (weatherData.events && Array.isArray(weatherData.events)) {
        weatherData.events.forEach(event => {
          const type = event.name || event.type;
          counts[type] = (counts[type] || 0) + 1;
        });
      }
      const sortedCountsAll = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      // Limit to top 10 alerts.
      sortedCounts = sortedCountsAll.slice(0, 10);
    } while (sortedCounts.length < 5);
    return {
      target: county,
      alertCounts: sortedCounts
    };
  };
  

// Scoring function: max points = 1000, subtract 3 points per mile.
const scoringFunction = (distanceInMiles) => {
  return Math.max(0, Math.round(1000 - 3 * distanceInMiles));
};

const Game = () => {
  // INITIAL STATES
  const [roundsData, setRoundsData] = useState([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [guessDone, setGuessDone] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingGuess, setPendingGuess] = useState(null);

  // Function to create a new game: fetch rounds data (alerts, counties, etc.)
  const createGame = async () => {
    setLoading(true);
    setScore(0);
    setCurrentRoundIndex(0);
    setFeedback('');
    setGuessDone(false);
    setGameOver(false);
    setPendingGuess(null);
    const rounds = await Promise.all(
        Array.from({ length: totalRounds }).map(async () => {
          return await getRoundData();
        })
      );
      
    setRoundsData(rounds);
    setLoading(false);
  };

  // Update pending guess when the map is clicked.
  const handleGuessChange = (guess) => {
    if (!guessDone) {
      setPendingGuess(guess);
    }
  };

  // When "Submit Guess" is pressed, calculate distance & update score.
  const submitGuess = () => {
    if (!pendingGuess) {
      setFeedback("Please select a location on the map before submitting.");
      return;
    }
    const target = roundsData[currentRoundIndex].target;
    const distance = getDistance(pendingGuess.lat, pendingGuess.lng, target.lat, target.lon);
    const roundPoints = scoringFunction(distance);
    setScore(prev => prev + roundPoints);
    setFeedback(`Your guess was ${distance.toFixed(2)} miles away. Points earned: ${roundPoints}.`);
    setGuessDone(true);
    if (currentRoundIndex === totalRounds - 1) {
      setGameOver(true);
    }
  };

  // Advances to next round.
  const nextRound = () => {
    if (currentRoundIndex < totalRounds - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      setFeedback('');
      setGuessDone(false);
      setPendingGuess(null);
    }
  };

  // Shares the score by copying a shareable message to the clipboard.
  const shareScore = async () => {
    const shareText = `I just scored ${score} points on Alert Finder – what can you score? Play now: ${window.location.href}`;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(shareText);
        console.log("Share message copied to clipboard!");
      } catch (err) {
        console.error("Unable to copy share text", err);
      }
    } else {
      console.log(shareText);
    }
  };

  // Resets the game. Prompts the user if game is not over.
  const resetGame = () => {
    if (roundsData.length > 0 && !gameOver) {
      const confirmReset = window.confirm("Are you sure you want to start a new game? Your current progress will be lost.");
      if (!confirmReset) return;
    }
    createGame();
  };

  // Define gameStarted variable: true if roundsData has been loaded.
  const gameStarted = roundsData.length > 0;

  // useEffect: do nothing on mount; game starts only when "New Game" is pressed.
  useEffect(() => {
    // Intentionally left empty.
  }, []);

  if (loading)
    return <div className="center-text">Loading game data...</div>;

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Alert Finder</h1>
      </header>

      <div className="info-box">
        <p>
          Guess the location based on the counts of NWS weather alerts in 2024
        </p>
      </div>

      <div className="top-panel">
        {/* Left Panel: Minimal view if game not started, full panel if started */}
        <div className="left-panel">
          {gameStarted ? (
            <>
              {/* Alerts at the top */}
              <div className="alerts-panel">
                <AlertProfile alertCounts={roundsData[currentRoundIndex].alertCounts} />
              </div>
              {/* Score / Round Info or Final Score */}
              <div className="center-panel">
                {!gameOver ? (
                  <>
                    <h3>Round {currentRoundIndex + 1} / {totalRounds}</h3>
                    <h2>Score: {score}</h2>
                  </>
                ) : (
                  <>
                    <h2>Final Score: {score}</h2>
                    <div className="share-container">
                      <a className="share-link" href={window.location.href}>
                        {window.location.href}
                      </a>
                      <button className="button" onClick={shareScore}>Copy Link</button>
                    </div>
                  </>
                )}
              </div>
              {/* Buttons: Submit Guess (above) then New Game */}
              <div className="buttons-panel">
                {!guessDone && !gameOver && (
                  <button className="button" onClick={submitGuess}>Submit Guess</button>
                )}
                {guessDone && !gameOver && (
                  <button className="button" onClick={nextRound}>Next Round</button>
                )}
                <button className="button" onClick={resetGame}>New Game</button>
              </div>
              {/* Feedback */}
              {feedback && (
                <div className="feedback">
                  {feedback}
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <p>Press New Game to start.</p>
              </div>
              <div className="buttons-panel">
                <button className="button" onClick={resetGame}>New Game</button>
              </div>
            </>
          )}
        </div>

        {/* Right Panel: Map remains visible always */}
        <div className="right-panel">
          <MapComponent
            key={currentRoundIndex} // forces remount to clear markers on round change
            target={gameStarted ? roundsData[currentRoundIndex].target : null}
            onGuessChange={handleGuessChange}
            guessDone={guessDone}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
