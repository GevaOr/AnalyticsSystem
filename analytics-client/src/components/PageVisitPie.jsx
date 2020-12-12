import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#EBC634"];

function PageVisitPie() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/pageviews")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Typography variant="h4">Visitors Per Page:</Typography>
      {data && (
        <PieChart width={500} height={400}>
          <Pie
            data={data}
            cx={200}
            cy={200}
            labelLine={true}
            label={true}
            outerRadius={130}
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      )}
    </>
  );
}

export default PageVisitPie;
