import React from "react";
import "./PlayerInfo.css";

const PlayerInfo = ({ playerData }) => {
  const calculateWinRate = (wins, games) => {
    return games > 0 ? ((wins / games) * 100).toFixed(2) : "0.00";
  };

  return (
    <div className="player-info">
      <h3>Player Statistics</h3>
      <p>Total Games: {playerData.totalGames}</p>
      <p>Total Wins: {playerData.totalWins}</p>
      <p>Total Losses: {playerData.totalLosses}</p>
      <p>
        Win Rate:{" "}
        {calculateWinRate(playerData.totalWins, playerData.totalGames)}%
      </p>
      <p>Total Win Points: {playerData.totalWinPoints}</p>
      <p>Total Loss Points: {playerData.totalLossPoints}</p>
    </div>
  );
};

export default PlayerInfo;
