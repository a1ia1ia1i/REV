import React from 'react';
import "./styling/Rev.css"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';

const RevenueChart = ({ data }) => {
  return (
    < div className="graph-container">
    <ResponsiveContainer width="70%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 50,
          right: 30,
          left: 20,
          bottom: 35, 
        }}
        style={{ backgroundColor: 'white' }} 
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year">
         
        </XAxis>
        <YAxis label={{ value: 'Revenue', angle: -90, position: 'insideLeft' }} /> {/* Y-axis label */}
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
