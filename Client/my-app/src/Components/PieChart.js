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
            size: 18, // Increased font size
          },
          color: "#FFFFFF", // Set font color to white
        },
      },
      tooltip: {
        titleFont: {
          size: 16, // Increased tooltip title font size
        },
        bodyFont: {
          size: 16, // Increased tooltip body font size
        },
        callbacks: {
          labelTextColor: () => "#FFFFFF", // Set tooltip font color to white
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h2 style={{ fontSize: "24px", color: "#000" }}>{headline}</h2>{" "}
      {/* Headline remains black */}
      <Pie data={data} options={options} />
    </div>
  );
};
