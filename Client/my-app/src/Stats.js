import React, { useState } from 'react';
import { PieChart } from "./Charts/PieChart";
import { BarChart } from "./Charts/BarChart";
import { GameInfo } from "./Charts/GameInfo";
import "./Stats.css";
import Video from "./Video";

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
            // Add more metrics as needed
        },
        {
            avgSpeed: "23 km/h",
            longestPointsRally: "12 shots",
            // Add more metrics as needed
        },
    ];

    return (
        <div className="stats">
            <div className="stats-row">
                <div className="stats-column">
                    <div className="pie-charts">
                        <PieChart values={[15,20,30]} labels={['hit floor first', 'double bounce', '2 seconds']}/>
                        <PieChart values={[40,10,3]} labels={['stat1', 'stats2', 'stats3']}/>
                    </div>
                </div>
                <div className="stats-column">
                    <GameInfo gameStats={gameStats} playerStats={playerStatsData} />;
                </div>
            </div>
            <div className="stats-row">
                <div className="stats-column">
                    <NavigableChart dataSets={barChartData}>
                        <BarChart />
                    </NavigableChart>
                </div>
                <div className="stats-column">
                    <div>
                        <h2>My Video</h2>
                        <video controls width="600">
                            <source src="video.mp4" type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </div>
    );
}
