import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const labels = ["Close to me", "", "", "Left of net", "Right to net", "", "", "Far from me"];

export const BarChart = ({ values }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Depth of the Ball",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
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
            size: 0, // Increase legend font size
          },
        },
      },
      tooltip: {
        titleFont: {
          size: 20, // Increase tooltip title font size
        },
        bodyFont: {
          size: 20, // Increase tooltip body font size
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 20, // Increase x-axis tick font size
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 20, // Increase y-axis tick font size
          },
        },
      },
    },
  };

  return (
    <>
      <Bar data={data} options={options} />
    </>
  );
};
