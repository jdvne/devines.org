import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './Accountability.module.css';
import { useState, useEffect } from 'react';
import accountabilityData from '../data/accountability.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Accountability() {
  const [weightData, setWeightData] = useState([]);
  const [caloriesData, setCaloriesData] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    setWeightData(accountabilityData.map(item => item.weight));
    setCaloriesData(accountabilityData.map(item => item.calories));
    setHealthData(accountabilityData.map(item => item.health));
    setActivityData(accountabilityData.map(item => item.activity));
  }, []);

  const labels = accountabilityData.map(item => item.month);

  return (
    <div className={styles.accountability}>
      <h1>Accountability</h1>
      <p>Track your progress towards your life goals.</p>
      <div style={{height: '300px', width: '500px'}}>
        <Line data={{
          labels: labels,
          datasets: [
            {
              label: 'Weight',
              data: weightData,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        }} options={{
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Weight Progress',
            },
          },
        }} />
      </div>
      <div style={{height: '300px', width: '500px'}}>
        <Line data={{
          labels: labels,
          datasets: [
            {
              label: 'Calories',
              data: caloriesData,
              fill: false,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            }
          ]
        }} options={{
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Calorie Intake',
            },
          },
        }} />
      </div>
      <div style={{height: '300px', width: '500px'}}>
        <Line data={{
          labels: labels,
          datasets: [
            {
              label: 'Health',
              data: healthData,
              fill: false,
              borderColor: 'rgb(54, 162, 235)',
              tension: 0.1
            }
          ]
        }} options={{
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Health Score',
            },
          },
        }} />
      </div>
      <div style={{height: '300px', width: '500px'}}>
        <Line data={{
          labels: labels,
          datasets: [
            {
              label: 'Activity',
              data: activityData,
              fill: false,
              borderColor: 'rgb(255, 205, 86)',
              tension: 0.1
            }
          ]
        }} options={{
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Activity Level',
            },
          },
        }} />
      </div>
    </div>
  );
}

export default Accountability;
