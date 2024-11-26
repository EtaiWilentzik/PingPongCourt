// PieChart.js

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

// Register necessary components
ChartJS.register(ArcElement, Tooltip);

export const PieChart = ({ name, values, labels, miss, options }) => {
  const [headline, setHeadline] = useState(name ? `${name}'s faults` : "My faults");

  // Initialize activeIndices to keep track of which labels are active
  const [activeIndices, setActiveIndices] = useState(Array(values.length).fill(true));

  useEffect(() => {
    if (miss) {
      setHeadline(name ? `${name}'s faults` : "My faults");
    } else {
      setHeadline("My Points");
    }
  }, [miss, name]);

  const loseReasons = ["Double bounce", "Miss the ball", "Response failed", "Bad serve"];

  const chartLabels = miss ? loseReasons : labels;

  // Compute dataValues based on activeIndices
  const dataValues = values.map((value, index) => (activeIndices[index] ? value : 0));

  const data = {
    labels: chartLabels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const handleLegendClick = (index) => {
    const newActiveIndices = [...activeIndices];
    newActiveIndices[index] = !newActiveIndices[index];
    setActiveIndices(newActiveIndices);
  };

  return (
    <div className="chart-container">
      <h2 className="chart-headline">{headline}</h2>
      <div className="pie-chart-canvas">
        <Pie data={data} options={options} />
      </div>
      <div className="custom-legend">
        {chartLabels.map((label, index) => (
          <div
            key={index}
            className={`legend-item ${!activeIndices[index] ? "inactive" : ""}`}
            onClick={() => handleLegendClick(index)}
          >
            <span
              className="legend-color"
              style={{
                backgroundColor: data.datasets[0].backgroundColor[index],
                opacity: activeIndices[index] ? 1 : 0.5,
              }}
            ></span>
            <span className="legend-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
