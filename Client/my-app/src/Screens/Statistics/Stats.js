// Stats.js

import React, { useContext, useEffect, useState } from "react";
import { PieChart } from "../../Components/PieChart";
import { BarChart } from "../../Components/BarChart";
import "./Stats.css";
import { AuthContext } from "../../App/AuthContext";
import { GamesList } from "../../Components/GamesList";
import PlayerInfo from "../../Components/PlayerInfo";
import Message from "../../Components/Message";

export function Stats({ gameId }) {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPersonalData = async () => {
    setIsLoading(true); // Start loading state
    try {
      const response = await fetch(`http://localhost:3000/games/personalStatistics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        setData(null);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data);
      setIsLoading(false); // End loading state
    } catch (err) {
      setError(err.message);
      setIsLoading(false); // End loading state
    }
  };

  useEffect(() => {
    fetchPersonalData();
  }, [gameId, token]);

  const handleRetry = () => {
    fetchPersonalData(); // Retry fetching data
  };

  if (isLoading) {
    return <Message isLoading={true} />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return (
      <Message
        headline={"No Data Found"}
        content={"There are no games to show Statistics about"}
        onClick={handleRetry}
        btnText={"Retry"}
      />
    );
  }

  const playerData = {
    totalWins: data.stats.totalWins,
    totalLosses: data.stats.totalLosses,
    totalGames: data.stats.totalLosses + data.stats.totalWins,
    totalWinPoints: data.totalWinPoints,
    totalLossPoints: data.totalLossPoints,
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Disable the built-in legend
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
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
  };

  return (
    <>
      <h1 className="headline">My statistics</h1>
      <div className="stats">
        <table>
          <tbody>
            <tr>
              <td className="stats-column">
                <div className="pie-charts">
                  <div className="pie-chart-wrapper">
                    <PieChart name={undefined} values={data.lossReasonsSum} miss={true} options={pieChartOptions} />
                  </div>
                  <div className="pie-chart-wrapper">
                    <PieChart
                      name={undefined}
                      values={[data.stats.totalWins, data.stats.totalLosses]}
                      miss={false}
                      labels={["Wins", "Losses"]}
                      options={pieChartOptions}
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
                <div className="tooltip-container">
                  <h2 className="depth-of-ball">
                    Depth of the ball <span className="tooltip-icon">ℹ️</span>
                  </h2>
                  <div className="tooltip-text">
                    <span className="tooltip-text">
                      The chart divides the table into 8 sections.
                      <br />
                      Each bar shows the number of ball hits in this area of the table,
                      <br />
                      corresponding to the shots made by the specific player whose name is mentioned.
                      <br />
                      The last bar shows your deepest shots, while the first bar shows the hits closest to you.
                      <br />
                    </span>
                  </div>
                </div>
                <div className="bar-chart-container">
                  <BarChart
                    values={data.depthOfHits}
                    options={{
                      maintainAspectRatio: false,
                      responsive: false,
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
    </>
  );
}
