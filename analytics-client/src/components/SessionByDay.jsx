import { useState, useEffect } from "react";
// import { Grid } from "@material-ui/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function SessionByDay() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/sessionsByHour").then((response) => {
      setData(response);
    });
  }, []);

  return (
    <ResponsiveContainer>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="sessions"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SessionByDay;
