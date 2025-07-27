import React from "react";
import {
  Drawer,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import dayjs from "../dayjsSetup";
import type { OHLCV } from "../types";

interface DashboardPanelProps {
  open: boolean;
  onClose: () => void;
  date: Date;
  data?: OHLCV;
  nearbyData?: OHLCV[];
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({
  open,
  onClose,
  date,
  data,
  nearbyData = [],
}) => {
  if (!data) return null;

  // Daily performance
  const performance = ((data.close - data.open) / data.open) * 100;
  const intradayVolatility = ((data.high - data.low) / data.open) * 100;

  // Prepare Trend Data for nearby days
  const trendData = nearbyData.map((d) => ({
    date: dayjs(d.date).format("MMM D"),
    volatility: ((d.high - d.low) / d.open) * 100,
    volume: d.volume,
  }));

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 380, p: 2 }}>
        {/* Selected Date */}
        <Typography variant="h6" gutterBottom>
          {dayjs(date).format("MMMM D, YYYY")}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* OHLCV Details */}
        <Typography variant="body2">Open: {data.open.toFixed(2)}</Typography>
        <Typography variant="body2">High: {data.high.toFixed(2)}</Typography>
        <Typography variant="body2">Low: {data.low.toFixed(2)}</Typography>
        <Typography variant="body2">Close: {data.close.toFixed(2)}</Typography>
        <Typography variant="body2">
          Volume: {data.volume.toLocaleString()}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* Daily Performance Metrics */}
        <Typography variant="body2" color={performance >= 0 ? "green" : "red"}>
          Daily Performance: {performance.toFixed(2)}%
        </Typography>
        <Typography variant="body2">
          Intraday Volatility: {intradayVolatility.toFixed(2)}%
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Volatility Trend Chart */}
        <Typography variant="subtitle2" gutterBottom>
          📈 Volatility Trend (Nearby Days)
        </Typography>
        <Box sx={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="volatility"
                stroke="#ff7300"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Volume Trend Chart */}
        <Typography variant="subtitle2" gutterBottom>
          📊 Volume Trend (Nearby Days)
        </Typography>
        <Box sx={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volume" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DashboardPanel;
