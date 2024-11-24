// PieChart.js

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({ name, values, labels, miss, options, width, height }) => {
  const [headline, setHeadline] = useState(name ? `${name}'s faults` : "My faults");

  useEffect(() => {
    if (miss) {
      setHeadline(name ? `${name}'s faults` : "My faults");
    } else {
      setHeadline("My Points");
    }
  }, [miss, name]);

  const loseReasons = ["Double bounce", "Miss the ball", "Response failed", "Bad serve"];

  const data = {
    labels: miss ? loseReasons : labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2 className="chart-headline">{headline}</h2>
      <Pie data={data} options={options} width={width} height={height} />
    </div>
  );
};
