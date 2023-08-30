import React, { useState } from 'react';
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { dateFormat } from '../../utils/dateFormat';


ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Chart() {
  const { incomes, expenses } = useGlobalContext();
  const [chartType, setChartType] = useState('pie');

  const incomeCategories = {};
  const expenseCategories = {};

  incomes.forEach((income) => {
    if (income.category in incomeCategories) {
      incomeCategories[income.category] += income.amount;
    } else {
      incomeCategories[income.category] = income.amount;
    }
  });

  expenses.forEach((expense) => {
    if (expense.category in expenseCategories) {
      expenseCategories[expense.category] += expense.amount;
    } else {
      expenseCategories[expense.category] = expense.amount;
    }
  });

  const incomeData = Object.values(incomeCategories);
  const expenseData = Object.values(expenseCategories);
  const incomeLabels = Object.keys(incomeCategories);
  const expenseLabels = Object.keys(expenseCategories);

  const pieChartData = {
    labels: [...incomeLabels, ...expenseLabels],
    datasets: [
      {
        data: [...incomeData, ...expenseData],
        backgroundColor: [
          ...Array(incomeLabels.length).fill('green'),
          ...Array(expenseLabels.length).fill('red'),
        ],
      },
    ],
  };

  const lineChartData = {
    labels: [
      ...incomes.map((inc) => dateFormat(inc.date)),
      ...expenses.map((exp) => dateFormat(exp.date)),
    ],
    datasets: [
      {
        label: 'Income',
        data: incomes.map((income) => income.amount),
        borderColor: 'green',
        tension: 0.2,
      },
      {
        label: 'Expenses',
        data: expenses.map((expense) => expense.amount),
        borderColor: 'red',
        tension: 0.2,
      },
    ],
  };
  

  const handleChartTypeToggle = () => {
    setChartType((prevType) => (prevType === 'pie' ? 'line' : 'pie'));
  };

  return (
      <ChartStyled>
          
      {chartType === 'pie' ? (
        <Pie data={pieChartData} options={{
            responsive: true,
            maintainAspectRatio: false,
          }} />
      ) : (
        <Line data={lineChartData} options={{
            responsive: true,
            //maintainAspectRatio: false, 
           
          }} />
          )}
          
          <ToggleButton onClick={handleChartTypeToggle}>
        {chartType === 'pie' ? 'View Line Chart' : 'View Pie Chart'}
          </ToggleButton>
      
    </ChartStyled>
  );
}


const ChartStyled = styled.div`
  background: #fcf6f9;
  border: 2px solid #ffffff;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  padding: 3rem;
  border-radius: 10px;
  height: 500px;
`;



const ToggleButton = styled.button`
  margin-top: 1rem;
  background: #ccc;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

export default Chart;