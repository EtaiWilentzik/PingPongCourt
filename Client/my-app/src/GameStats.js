import React, {useContext, useEffect, useState} from 'react';
import { PieChart } from "./Charts/PieChart";
import { BarChart } from "./Charts/BarChart";
import { GameInfo } from "./Charts/GameInfo";
import "./GameStats.css";
import {AuthContext} from "./AuthContext";

const NavigableChart = ({ dataSets, children }) => {
    const [currentStatIndex, setCurrentStatIndex] = useState(0);

    const navigate = (direction) => {
        if (direction === 'left') {
            setCurrentStatIndex((prev) => (prev > 0 ? prev - 1 : dataSets.length - 1));
        } else if (direction === 'right') {
            setCurrentStatIndex((prev) => (prev < dataSets.length - 1 ? prev + 1 : 0));
        }
    };

    return (
        <div className="navigable-chart">
            <button className="arrow" onClick={() => navigate('left')}>{"<"}</button>
            <>
                {React.cloneElement(children, { values: dataSets[currentStatIndex] })}
            </>
            <button className="arrow" onClick={() => navigate('right')}>{">"}</button>
        </div>
    );
};

export function GameStats({gameId}) {
    const { token } = useContext(AuthContext); // Use token from context
    const [gameData, setGameData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                console.log("Fetching game data");
                const response = await fetch(`http://localhost:3000/games/${gameId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
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

    const {
        player_left,
        player_right,
        shared_stats,
    } = gameData;
    return (
        <div className="stats">
            <table>
                <thead>
                    <h1>
                        score 2:2
                    </h1>
                </thead>
                <tbody>
                <tr>
                    <td className="stats-column">
                        <h2>Headline 1</h2>
                        <div className="pie-charts">
                            <PieChart values={gameData.player_left.lossReasons} labels={['hit floor first', 'double bounce', '2 seconds', '4th reason']}/>
                            <PieChart values={gameData.player_right.lossReasons} labels={['hit floor first', 'double bounce', '2 seconds', '4th reason']}/>
                        </div>
                    </td>
                    <td className="stats-column">
                        <h2>Headline 2</h2>
                        {/*<GameInfo gameStats={gameStats} playerStats={playerStatsData}/>*/}
                    </td>
                </tr>
                <tr>
                    <td className="stats-column">
                        <h2>Headline 3</h2>
                        <NavigableChart dataSets={[
                            gameData.player_left.depthOfHits, gameData.player_left.depthOfHits
                        ]}>
                            <BarChart/>
                        </NavigableChart>
                    </td>
                    <td className="stats-column">
                        <h2>Headline 4</h2>
                        <div>
                            <h2>My Video</h2>
                            <video controls width="600">
                                <source src="video.mp4" type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
