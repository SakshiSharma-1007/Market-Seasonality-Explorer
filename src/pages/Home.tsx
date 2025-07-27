import { useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useCryptoData } from "../hooks/useCryptoData";
import Calendar from "../components/calendar/calendar";
import DashboardPanel from "../components/DashboardPanel";
import dayjs from "../dayjsSetup";
import type { OHLCV } from "../types";

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT"];

export default function Home() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const { data = [], isLoading } = useCryptoData(symbol, "1d");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calendar States
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  // Convert API array -> Record<string, OHLCV>
  const dataByDate: Record<string, OHLCV> = data.reduce(
    (acc: Record<string, OHLCV>, d: OHLCV) => {
      const key = dayjs(d.date).format("YYYY-MM-DD");
      acc[key] = d;
      return acc;
    },
    {}
  );

  // Selected day's data
  const selectedData = data.find(
    (d: OHLCV) =>
      dayjs(d.date).format("YYYY-MM-DD") ===
      dayjs(selectedDate).format("YYYY-MM-DD")
  );

  // Find nearby 7 days for Volatility & Volume charts
  let nearbyData: OHLCV[] = [];
  if (selectedDate && selectedData) {
    const selectedIndex = data.findIndex(
      (d: OHLCV) =>
        dayjs(d.date).format("YYYY-MM-DD") ===
        dayjs(selectedDate).format("YYYY-MM-DD")
    );
    if (selectedIndex !== -1) {
      nearbyData = data.slice(
        Math.max(0, selectedIndex - 3),
        Math.min(data.length, selectedIndex + 4)
      );
    }
  }

  // Month Navigation Handlers
  const goToPrevMonth = () => setCurrentMonth((prev) => prev.subtract(1, "month"));
  const goToNextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));
  const resetToToday = () => setCurrentMonth(dayjs()); // reset to current month

  if (isLoading) return <Typography>Loading data...</Typography>;

  return (
    <Box p={3}>
      {/* Symbol Dropdown */}
      <Box mb={2} display="flex" gap={2}>
        <FormControl size="small">
          <Select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {SYMBOLS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Month Navigation Controls */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <IconButton onClick={goToPrevMonth}>
          <ChevronLeft />
        </IconButton>

        <Typography variant="h6" mx={2}>
          {currentMonth.format("MMMM YYYY")}
        </Typography>

        <IconButton onClick={goToNextMonth}>
          <ChevronRight />
        </IconButton>

        {/* Optional Reset to Today Button */}
        <Typography
          variant="body2"
          sx={{ ml: 2, cursor: "pointer", color: "primary.main" }}
          onClick={resetToToday}
        >
          Today
        </Typography>
      </Box>

      {/*Calendar (even for months with no data) */}
      <Calendar
        currentMonth={currentMonth}
        dataByDate={dataByDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onDateSelect={setSelectedDate}
      />

      {/* Side Panel with Charts */}
      <DashboardPanel
        open={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        date={selectedDate || new Date()}
        data={selectedData}
        nearbyData={nearbyData}
      />
    </Box>
  );
}
