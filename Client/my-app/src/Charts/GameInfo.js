import React, { useState } from 'react';
import "./GameInfo.css";

const PlayerStats = ({ dataSets }) => {
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

    const navigatePlayer = (direction) => {
        if (direction === 'left') {
            setCurrentPlayerIndex((prev) => (prev > 0 ? prev - 1 : dataSets.length - 1));
        } else if (direction === 'right') {
            setCurrentPlayerIndex((prev) => (prev < dataSets.length - 1 ? prev + 1 : 0));
        }
    };

    return (
        <div className="player-stats">
            <div className="navigable-chart">
                <button className="arrow" onClick={() => navigatePlayer('left')}>{"<"}</button>
                <div>
                    <h3>Player {currentPlayerIndex + 1} Stats</h3>
                    <p>Average Speed: {dataSets[currentPlayerIndex].avgSpeed}</p>
                    <p>Longest Points Rally: {dataSets[currentPlayerIndex].longestPointsRally}</p>
                    {/* Add more player-specific metrics here */}
                </div>

                <button className="arrow" onClick={() => navigatePlayer('right')}>{">"}</button>
            </div>
        </div>
    );
};

export const GameInfo = ({gameStats, playerStats}) => {
    return (
        <div className="top-right-component">
            <div className="game-stats">
                <h3>Game Statistics</h3>
                <p>Longest Rally: {gameStats.longestRally}</p>
                <p>Number of Points: {gameStats.numberOfPoints}</p>
                <p>Result: {gameStats.result}</p>
                <p>Time: {gameStats.time}</p>
            </div>
            <PlayerStats dataSets={playerStats} />
        </div>
    );
};

