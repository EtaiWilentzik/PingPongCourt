import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({ name, values, labels }) => {
    // Correctly initialize the headline
    const [headline, setHead] = React.useState(name ? `${name}'s faults` : 'My faults');

    const data = {
        labels: labels,
        datasets: [
            {
                data: values,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
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
        <div className="chart-container">
            <h2>{headline}</h2>
            <Pie data={data} options={options} />
        </div>
    );
};
