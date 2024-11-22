import React, { useState } from "react";
import "./GameInfo.css";

const PlayerStats = ({ dataSets }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const navigatePlayer = (direction) => {
    if (direction === "left") {
      setCurrentPlayerIndex((prev) =>
        prev > 0 ? prev - 1 : dataSets.length - 1,
      );
    } else if (direction === "right") {
      setCurrentPlayerIndex((prev) =>
        prev < dataSets.length - 1 ? prev + 1 : 0,
      );
    }
  };

  return (
    <div className="player-stats">
      <div className="navigable-chart">
        <button className="arrow" onClick={() => navigatePlayer("left")}>
          {"<"}
        </button>
        <div>
          <h3>{dataSets[currentPlayerIndex].name} Stats</h3>
          <p>Points: {dataSets[currentPlayerIndex].points}</p>
          <p>Aces: {dataSets[currentPlayerIndex].aces}</p>
          <p>
            Fastest Ball Speed: {dataSets[currentPlayerIndex].fastestBallSpeed}{" "}
            km/h
          </p>
        </div>
        <button className="arrow" onClick={() => navigatePlayer("right")}>
          {">"}
        </button>
      </div>
    </div>
  );
};

export const GameInfo = ({ gameStats, playerStats }) => {
  return (
    <div className="top-right-component">
      <div className="game-stats">
        <h3>Game Statistics</h3>
        <p>Max Hits in Game: {gameStats.maxHitsInGame}</p>
        <p>Average Hits in Game: {gameStats.averageHitsInGame}</p>
      </div>
      <PlayerStats dataSets={playerStats} />
    </div>
  );
};
