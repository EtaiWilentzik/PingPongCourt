// GameStats.js

import React, { useContext, useEffect, useState } from "react";
import { PieChart } from "../../Components/PieChart";
import { BarChart } from "../../Components/BarChart";
import { GameInfo } from "../../Components/GameInfo";
import "./GameStats.css";
import { AuthContext } from "../../App/AuthContext";

const NavigableChart = ({ dataSets, playerNames, options }) => {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  const navigate = (direction) => {
    if (direction === "left") {
      setCurrentStatIndex((prev) => (prev > 0 ? prev - 1 : dataSets.length - 1));
    } else if (direction === "right") {
      setCurrentStatIndex((prev) => (prev < dataSets.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="navigable-chart">
      <button className="arrow" onClick={() => navigate("left")}>
        {"<"}
      </button>
      <div className="bar-chart-container">
        <h2>{playerNames[currentStatIndex]}</h2>
        <BarChart values={dataSets[currentStatIndex]} options={options} />
      </div>
      <button className="arrow" onClick={() => navigate("right")}>
        {">"}
      </button>
    </div>
  );
};

export function GameStats({ gameId }) {
  const { token } = useContext(AuthContext);
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/games/${gameId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setGameData(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchGameData();
  }, [gameId, token]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!gameData) {
    return <div>Loading...</div>;
  }

  const gameStats = {
    maxHitsInGame: gameData.shared_stats.maxHitsInGame,
    averageHitsInGame: gameData.shared_stats.averageHitsInGame,
  };

  const playerStatsData = [
    {
      name: gameData.player_left_name,
      points: gameData.player_left.points,
      aces: gameData.player_left.aces,
      fastestBallSpeed: gameData.player_left.fastestBallSpeed,
    },
    {
      name: gameData.player_right_name,
      points: gameData.player_right.points,
      aces: gameData.player_right.aces,
      fastestBallSpeed: gameData.player_right.fastestBallSpeed,
    },
  ];

  // Define common options for pie charts (same as in Stats.js)
  const pieChartOptions = {
    responsive: false,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 18,
          },
          color: "#FFFFFF",
        },
      },
      tooltip: {
        titleFont: {
          size: 24,
        },
        bodyFont: {
          size: 20,
        },
        callbacks: {
          labelTextColor: () => "#FFFFFF",
        },
      },
    },
  };

  // Define common options for bar charts (same as in Stats.js)
  const barChartOptions = {
    maintainAspectRatio: false,
    responsive: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 18,
          },
          color: "#FFFFFF",
        },
      },
      tooltip: {
        titleFont: {
          size: 24,
        },
        bodyFont: {
          size: 20,
        },
        callbacks: {
          labelTextColor: () => "#FFFFFF",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
          },
          color: "#FFFFFF",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      y: {
        ticks: {
          font: {
            size: 14,
          },
          color: "#FFFFFF",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  };

  return (
    <>
      <h1 className="headline">
        {gameData.player_left_name} {gameData.player_left.points} : {gameData.player_right.points}{" "}
        {gameData.player_right_name}
      </h1>
      <div className="stats">
        <table>
          <tbody>
            <tr>
              <td className="stats-column">
                <div className="pie-charts">
                  <div className="pie-chart-wrapper">
                    <PieChart
                      name={gameData.player_left_name}
                      values={gameData.player_left.lossReasons}
                      miss={true}
                      options={pieChartOptions}
                      width={400} // Same size as in Stats.js
                      height={400}
                    />
                  </div>
                  <div className="pie-chart-wrapper">
                    <PieChart
                      name={gameData.player_right_name}
                      values={gameData.player_right.lossReasons}
                      miss={true}
                      options={pieChartOptions}
                      width={400}
                      height={400}
                    />
                  </div>
                </div>
              </td>
              <td className="stats-column">
                <GameInfo gameStats={gameStats} playerStats={playerStatsData} />
              </td>
            </tr>
            <tr>
              <td className="stats-column">
                <h2>
                  Depth of the ball
                  <span className="tooltip-icon">ℹ️</span>
                  <span className="tooltip-text">
                    The chart divides the table into 8 sections.
                    <br />
                    Each bar shows hits in an area.
                    <br />
                    The last bar shows your deepest shots.
                  </span>
                </h2>
                <NavigableChart
                  dataSets={[gameData.player_left.depthOfHits, gameData.player_right.depthOfHits]}
                  playerNames={[gameData.player_left_name, gameData.player_right_name]}
                  options={barChartOptions} // Pass the barChartOptions
                />
              </td>
              <td className="stats-column">
                <div>
                  <video className="large-video" id="videoPlayer" controls muted="muted" autoPlay>
                    <source src={`http://localhost:3000/games/video/${gameId}`} type="video/mp4" />
                  </video>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
