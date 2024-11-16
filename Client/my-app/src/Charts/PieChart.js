import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = () => {
    const data = {
        labels: ['Hit Table First', 'Double Bounce', 'Miss the Ball'],
        datasets: [
            {
                data: [30, 20, 50],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <>
            <h2>Shot Outcome</h2>
            <Pie data={data} options={options} />
        </>
    );
};
