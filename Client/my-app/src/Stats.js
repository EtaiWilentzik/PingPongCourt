import React, { useState } from 'react';
import { PieChart } from "./Charts/PieChart";
import { BarChart } from "./Charts/BarChart";
import { GameInfo } from "./Charts/GameInfo";
import "./Stats.css";

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

export function Stats() {
    const barChartData = [
        [3, 5, 2, 7, 6, 4, 8, 1],
        [4, 6, 3, 8, 7, 5, 9, 2]
    ];

    const gameStats = {
        longestRally: "15 shots",
        numberOfPoints: 45,
        result: "Player A won 21-19",
        time: "30 mins",
    };

    const playerStatsData = [
        {
            avgSpeed: "25 km/h",
            longestPointsRally: "15 shots",
        },
        {
            avgSpeed: "23 km/h",
            longestPointsRally: "12 shots",
        },
    ];

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
                            <PieChart values={[15, 20, 30]} labels={['hit floor first', 'double bounce', '2 seconds']}/>
                            <PieChart values={[40, 10, 3]} labels={['stat1', 'stats2', 'stats3']}/>
                        </div>
                    </td>
                    <td className="stats-column">
                        <h2>Headline 2</h2>
                        <GameInfo gameStats={gameStats} playerStats={playerStatsData}/>
                    </td>
                </tr>
                <tr>
                    <td className="stats-column">
                        <h2>Headline 3</h2>
                        <NavigableChart dataSets={barChartData}>
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
