import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie, Bar } from 'react-chartjs-2';

// Register chart elements
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ChartPage = () => {
  const { UserID } = useParams();
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/Budget/${UserID}`)
      .then(res => setBudgets(res.data))
      .catch(err => console.error(err));
  }, [UserID]);

  const labels = budgets.map(b => b.BudgetName);

  // === PIE CHART DATA ===
  const pieData = {
    labels,
    datasets: [
      {
        label: 'Used',
        data: budgets.map(b => b.UsedAmount),
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#fff' }, // white labels
      },
      datalabels: {
        formatter: (value, ctx) => {
          const total = ctx.chart._metasets[0].total;
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        },
        color: '#fff',
      },
    },
  };

  // === BAR CHART DATA ===
  const barData = {
    labels,
    datasets: [
      {
        label: 'Used Amount',
        data: budgets.map(b => b.UsedAmount),
        backgroundColor: '#ef4444',
      },
      {
        label: 'Remaining Amount',
        data: budgets.map(b => b.CurrentAmount),
        backgroundColor: '#10b981',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#fff' }, // white legend
      },
    },
    scales: {
      x: {
        ticks: { color: '#fff' }, // white axis labels
        grid: { color: '#334155' }, // soft gray grid lines
      },
      y: {
        ticks: { color: '#fff' },
        grid: { color: '#334155' },
      },
    },
  };

  // === Link style object ===
  const linkStyle = {
    marginRight: '1rem',
    textDecoration: 'none',
    fontWeight: 'bold',
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'center' }}>
     
     <Navbar />

      <h2 style={{ color: '#10b981' }}>📊 Budget Usage (Pie)</h2>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Pie data={pieData} options={pieOptions} />
      </div>

      <h2 style={{ color: '#3b82f6', marginTop: '3rem' }}>📉 Used vs Remaining (Bar)</h2>
      <Bar data={barData} options={barOptions} />
    </div>
  );
};

export default ChartPage;