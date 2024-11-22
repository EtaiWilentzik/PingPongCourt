import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({ name, values, labels, miss }) => {
  const [headline, setHead] = React.useState(
    name ? `${name}'s faults` : "My faults",
  );
  useEffect(() => {
    if (miss) {
      setHead(name ? `${name}'s faults` : "My faults");
    } else {
      setHead("My Points");
    }
  }, [miss, name]);

  const lose_reasons = [
    "Double bounce",
    "Miss the ball",
    "Response failed",
    "Bad server",
  ];
  const data = {
    labels: miss ? lose_reasons : labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 16, // Increase legend font size
          },
        },
      },
      tooltip: {
        titleFont: {
          size: 14, // Increase tooltip title font size
        },
        bodyFont: {
          size: 14, // Increase tooltip body font size
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h2 style={{ fontSize: "24px" }}>{headline}</h2>{" "}
      {/* Increased headline font size */}
      <Pie data={data} options={options} />
    </div>
  );
};
