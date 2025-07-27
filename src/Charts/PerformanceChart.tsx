import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

interface PerformanceChartProps {
  data: { date: Date; open: number; close: number }[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data.map((d) => ({
    date: d.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    open: d.open,
    close: d.close,
  }));

  return (
    <div style={{ width: "100%", height: 200, marginTop: "16px" }}>
      <h4 style={{ marginBottom: "8px" }}>Price Performance</h4>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="date" hide />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="open" stroke="#8884d8" dot={false} />
          <Line type="monotone" dataKey="close" stroke="#82ca9d" dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
