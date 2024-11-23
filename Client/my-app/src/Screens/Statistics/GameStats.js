import React, { useContext, useEffect, useState } from "react";
import { PieChart } from "../../Components/PieChart";
import { BarChart } from "../../Components/BarChart";
import { GameInfo } from "../../Components/GameInfo";
import "./GameStats.css";
import { AuthContext } from "../../App/AuthContext";

const NavigableChart = ({ dataSets, playerNames, children }) => {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  const navigate = (direction) => {
    if (direction === "left") {
      setCurrentStatIndex((prev) =>
        prev > 0 ? prev - 1 : dataSets.length - 1,
      );
    } else if (direction === "right") {
      setCurrentStatIndex((prev) =>
        prev < dataSets.length - 1 ? prev + 1 : 0,
      );
    }
  };

  return (
    <div className="navigable-chart">
      <button className="arrow" onClick={() => navigate("left")}>
        {"<"}
      </button>
      <h2>{playerNames[currentStatIndex]}</h2>
      <>
        {React.cloneElement(children, { values: dataSets[currentStatIndex] })}
      </>
      <button className="arrow" onClick={() => navigate("right")}>
        {">"}
      </button>
    </div>
  );
};

export function GameStats({ gameId }) {
  const { token } = useContext(AuthContext); // Use token from context
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
        setGameData(result.data); // Assuming `data` contains the game stats
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

  // Map data
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

  return (
    <div className="stats">
      <h1>
        {gameData.player_left_name} {gameData.player_left.points} :{" "}
        {gameData.player_right.points} {gameData.player_right_name}
      </h1>
      <table>
        <tbody>
          <tr>
            <td className="stats-column">
              <div className="pie-charts">
                <PieChart
                  name={gameData.player_left_name}
                  values={gameData.player_left.lossReasons}
                  miss={true}
                  // labels={['Hit floor first', 'Double bounce', '2 seconds', '4th reason']}
                />
                <PieChart
                  name={gameData.player_right_name}
                  values={gameData.player_right.lossReasons}
                  miss={true}
                  // labels={['Hit floor first', 'Double bounce', '2 seconds', '4th reason']}
                />
              </div>
            </td>
            <td className="stats-column">
              <GameInfo gameStats={gameStats} playerStats={playerStatsData} />
            </td>
          </tr>
          <tr>
            <td className="stats-column">
              <NavigableChart
                dataSets={[
                  gameData.player_left.depthOfHits,
                  gameData.player_right.depthOfHits,
                ]}
                playerNames={[
                  gameData.player_left_name,
                  gameData.player_right_name,
                ]}
              >
                <BarChart />
              </NavigableChart>
            </td>
            <td className="stats-column">
              <div>
                <video
                  className="large-video"
                  id="videoPlayer"

                  controls
                  muted="muted"
                  autoPlay
                >
                  <source
                    src={`http://localhost:3000/games/video/${gameId}`}
                    type="video/mp4"
                  />
                </video>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
