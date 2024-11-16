import React, { useState } from 'react';
import { PieChart } from "./Charts/PieChart";
import { BarChart } from "./Charts/BarChart";
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
            {React.cloneElement(children, { values: dataSets[currentStatIndex] })}
            <button className="arrow" onClick={() => navigate('right')}>{">"}</button>
        </div>
    );
};

export function Stats() {
    const barChartData = [
        [3, 5, 2, 7, 6, 4, 8, 1],
        [4, 6, 3, 8, 7, 5, 9, 2]
    ]; // Example sets of statistics

    return (
        <div className="stats">
            <div className="stats-row">
                <div className="stats-column">{<PieChart />}</div>
                <div className="stats-column">2 will be cut to half</div>
            </div>
            <div className="stats-row">
                <div className="stats-column">
                    <NavigableChart dataSets={barChartData}>
                        <BarChart />
                    </NavigableChart>
                </div>
                <div className="stats-column">{<PieChart />}</div>
            </div>
        </div>
    );
}
