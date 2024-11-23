import React, { useContext, useEffect, useState } from "react";
import { PieChart } from "../../Components/PieChart";
import { BarChart } from "../../Components/BarChart";
import { GameInfo } from "../../Components/GameInfo";
import "./Stats.css";
import { AuthContext } from "../../App/AuthContext";
import { GamesList } from "../../Components/GamesList";
import PlayerInfo from "../../Components/PlayerInfo";

export function Stats({ gameId }) {
  const { token } = useContext(AuthContext); // Use token from context
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/games/personalStatistics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data); // Assuming `data` contains the game stats
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPersonalData();
  }, [gameId, token]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const playerData = {
    totalWins: data.stats.totalWins,
    totalLosses: data.stats.totalLosses,
    totalGames: data.stats.totalLosses + data.stats.totalWins,
    totalWinPoints: data.totalWinPoints,
    totalLossPoints: data.totalLossPoints,
  };

  return (
    <div className="stats">
      <h1 className="headline">My statistics</h1>

      <table>
        <tbody>
          <tr>
            <td className="stats-column">
              <div className="pie-charts">
                <div className="chart-container">
                  <PieChart
                    name={undefined}
                    values={data.lossReasonsSum}
                    miss={true}
                    options={{
                      plugins: {
                        legend: {
                          labels: {
                            font: {
                              size: 12,
                            },
                          },
                        },
                      },
                      maintainAspectRatio: false,
                      aspectRatio: 1.5,
                    }}
                  />
                </div>
                <div className="chart-container">
                  <PieChart
                    name={undefined}
                    values={[data.stats.totalWins, data.stats.totalLosses]}
                    miss={false}
                    labels={["Wins", "Loses"]}
                    options={{
                      plugins: {
                        legend: {
                          labels: {
                            font: {
                              size: 12,
                            },
                          },
                        },
                      },
                      maintainAspectRatio: false,
                      aspectRatio: 1.5,
                    }}
                  />
                </div>
              </div>
            </td>
            <td className="stats-column">
              <PlayerInfo playerData={playerData} />
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
              <div className="bar-chart-container">
                <BarChart
                  values={data.depthOfHits}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                  }}
                />
              </div>
            </td>

            <td className="stats-column">
              <h2 className="last-games-headline">Last 5 games</h2>
              <div>
                <GamesList list={data.lastFiveGames} isRest={true} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
