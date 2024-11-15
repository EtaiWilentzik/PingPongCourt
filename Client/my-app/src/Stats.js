import React from 'react';
// import './Charts/Charts.css'
import {PieChart} from "./Charts/PieChart";
import "./Stats.css"

export function Stats() {
    return (
        <div className="stats">
            <div className="stats-row">
                <div className="stats-column">{<PieChart />}</div>
                <div className="stats-column">2 will be cut to half</div>
            </div>
            <div className="stats-row">
                <div className="stats-column">3</div>
                <div className="stats-column">{<PieChart />}</div>
            </div>
        </div>
    );
}