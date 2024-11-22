import React, { useContext, useEffect, useState } from 'react';
import { PieChart } from "./Charts/PieChart";
import { BarChart } from "./Charts/BarChart";
import { GameInfo } from "./Charts/GameInfo";
import "./Stats.css";
import { AuthContext } from "./AuthContext";
import {GamesList} from "./Charts/GamesList";
import PlayerInfo from "./Charts/PlayerInfo";


export function Stats({ gameId }) {
    const { token } = useContext(AuthContext); // Use token from context
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPersonalData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/games/personalStatistics`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

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
            <table>
                <thead>
                <h1>
sdfsdfsdfsdfsdfsdf                </h1>
                </thead>

                <tbody>
                <tr>
                    <td className="stats-column">
                        <h2>Headline 1</h2>
                        <div className="pie-charts">
                            <PieChart
                                // name={data.player_left_name}
                                values={data.lossReasonsSum}
                                labels={['Hit floor first', 'Double bounce', '2 seconds', '4th reason']}
                            />

                        </div>
                    </td>
                    <td className="stats-column">
                        <h2>Headline 2</h2>
                        <PlayerInfo playerData={playerData} />
                        {/*<GameInfo gameStats={gameStats} playerStats={}/>playerStatsData*/}
                    </td>
                </tr>
                <tr>
                    <td className="stats-column">
                        <h2>Headline 3</h2>
                            <BarChart values={data.depthOfHits}/>
                    </td>
                    <td className="stats-column">
                        <h2>Headline 4</h2>
                        <div>
                            {/*<h2>My Video</h2>*/}
                            <GamesList list={data.lastFiveGames} />
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
