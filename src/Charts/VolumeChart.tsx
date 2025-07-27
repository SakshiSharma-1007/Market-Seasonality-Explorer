import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface VolumeChartProps {
  data: { date: Date; volume: number }[];
}

export default function VolumeChart({ data }: VolumeChartProps) {
  const chartData = data.map((d) => ({
    date: d.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    volume: d.volume,
  }));

  return (
    <div style={{ width: "100%", height: 200 }}>
      <h4 style={{ marginBottom: "8px" }}>Trading Volume</h4>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="date" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="volume" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
