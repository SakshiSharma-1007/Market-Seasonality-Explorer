import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Tooltip,
  Paper,
  Fade,
} from "@mui/material";
import dayjs from "../../dayjsSetup";
import CalendarCell from "./CalendarCell";
import type { OHLCV } from "../../types";
import {
  calculateVolatility,
  getVolatilityPercent,
} from "../../utils/volatilityUtils";

interface CalendarProps {
  currentMonth: dayjs.Dayjs;
  dataByDate: Record<string, OHLCV>;
  viewMode: "day" | "week" | "month";
  onViewModeChange: (mode: "day" | "week" | "month") => void;
  onDateSelect: (date: Date) => void;
  onMonthChange?: (newMonth: dayjs.Dayjs) => void; // ✅ To allow month navigation
}

const CELL_HEIGHT = "90px";

const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  dataByDate,
  viewMode,
  onViewModeChange,
  onDateSelect,
  onMonthChange,
}) => {
  const [fadeKey, setFadeKey] = useState(viewMode);
  useEffect(() => {
    setFadeKey(viewMode);
  }, [viewMode]);

  const startOfMonth = currentMonth.startOf("month");
  const startDay = startOfMonth.day(); // 0 = Sunday
  const calendarDays = Array.from({ length: 42 }).map((_, idx) =>
    startOfMonth.add(idx - startDay, "day")
  );
  const weeks: dayjs.Dayjs[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  function aggregateWeek(weekDays: dayjs.Dayjs[]) {
    let totalVolume = 0;
    let totalVolatility = 0;
    let count = 0;

    weekDays.forEach((day) => {
      const key = day.format("YYYY-MM-DD");
      const d = dataByDate[key];
      if (d) {
        const v = getVolatilityPercent(d.open, d.high, d.low) || 0;
        totalVolume += d.volume;
        totalVolatility += v;
        count++;
      }
    });

    return {
      avgVolatility: count ? totalVolatility / count : 0,
      totalVolume,
    };
  }

  function aggregateMonth(monthDays: dayjs.Dayjs[]) {
    let totalVolume = 0;
    let totalVolatility = 0;
    let count = 0;

    monthDays.forEach((day) => {
      const key = day.format("YYYY-MM-DD");
      const d = dataByDate[key];
      if (d) {
        const v = getVolatilityPercent(d.open, d.high, d.low) || 0;
        totalVolume += d.volume;
        totalVolatility += v;
        count++;
      }
    });

    return {
      avgVolatility: count ? totalVolatility / count : 0,
      totalVolume,
    };
  }

  //Month Navigation Handlers
  const goPrevMonth = () =>
    onMonthChange?.(currentMonth.subtract(1, "month"));
  const goNextMonth = () =>
    onMonthChange?.(currentMonth.add(1, "month"));

  //Keyboard Navigation
  const handleKeyNavigation = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrevMonth();
      if (e.key === "ArrowRight") goNextMonth();
      if (e.key === "ArrowUp") {
        if (viewMode === "day") onViewModeChange("week");
        else if (viewMode === "week") onViewModeChange("month");
      }
      if (e.key === "ArrowDown") {
        if (viewMode === "month") onViewModeChange("week");
        else if (viewMode === "week") onViewModeChange("day");
      }
      if (e.key === "Enter") onDateSelect(dayjs().toDate());
      if (e.key === "Escape") onDateSelect(new Date(""));
    },
    [viewMode, currentMonth]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);

  return (
    <Box>
      {/* Toggle Buttons for Views */}
      <Box display="flex" justifyContent="center" mb={2}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => val && onViewModeChange(val)}
        >
          <ToggleButton value="day">DAILY</ToggleButton>
          <ToggleButton value="week">WEEKLY</ToggleButton>
          <ToggleButton value="month">MONTHLY</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Smooth Fade Transition between views */}
      <Fade in key={fadeKey} timeout={400}>
        <Box>
          {/* === DAILY VIEW === */}
          {viewMode === "day" && (
            <>
              {/* Weekday Headers */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  textAlign: "center",
                  fontWeight: "bold",
                  background: "#f5f5f5",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <Box
                      key={day}
                      sx={{
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {day}
                    </Box>
                  )
                )}
              </Box>

              {/* Calendar Grid */}
              <Box>
                {weeks.map((weekDays, weekIdx) => (
                  <Box
                    key={weekIdx}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {weekDays.map((day) => {
                      const key = day.format("YYYY-MM-DD");
                      const dayData = dataByDate[key];

                      const volatility = dayData
                        ? calculateVolatility(
                            dayData.open,
                            dayData.high,
                            dayData.low
                          )
                        : undefined;

                      const performance = dayData
                        ? ((dayData.close - dayData.open) / dayData.open) * 100
                        : undefined;

                      const isCurrentMonth =
                        day.month() === currentMonth.month();

                      return (
                        <Tooltip
                          key={key}
                          title={
                            dayData ? (
                              <Box>
                                <Typography variant="body2">
                                  Volatility:{" "}
                                  {getVolatilityPercent(
                                    dayData.open,
                                    dayData.high,
                                    dayData.low
                                  ).toFixed(2)}
                                  %
                                </Typography>
                                <Typography variant="body2">
                                  Volume: {dayData.volume.toLocaleString()}
                                </Typography>
                                <Typography variant="body2">
                                  Perf:{" "}
                                  {performance ? performance.toFixed(2) : "0.00"}
                                  %
                                </Typography>
                              </Box>
                            ) : (
                              "No data"
                            )
                          }
                          arrow
                        >
                          <Box
                            sx={{
                              height: CELL_HEIGHT,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "flex-start",
                              borderRight: "1px solid #f0f0f0",
                            }}
                          >
                            <CalendarCell
                              date={day.toDate()}
                              isCurrentMonth={isCurrentMonth}
                              isToday={day.isSame(dayjs(), "day")}
                              volatilityLevel={volatility}
                              performance={performance}
                              extraInfo={dayData}
                              onClick={() => onDateSelect(day.toDate())}
                            />
                          </Box>
                        </Tooltip>
                      );
                    })}
                  </Box>
                ))}
              </Box>

              {/* Mini Legend */}
              <Box mt={2} textAlign="center">
                <Typography variant="body2">
                  <span style={{ background: "#d4edda", padding: "4px" }}>
                    Low
                  </span>{" "}
                  <span style={{ background: "#fff3cd", padding: "4px" }}>
                    Medium
                  </span>{" "}
                  <span style={{ background: "#f8d7da", padding: "4px" }}>
                    High
                  </span>{" "}
                  Volatility
                </Typography>
              </Box>
            </>
          )}

          {/* === WEEKLY VIEW === */}
          {viewMode === "week" && (
           <Box mt={2}>
    <Typography variant="h6" align="center" gutterBottom>
      Weekly Summary (Avg Volatility + Total Volume + Performance)
    </Typography>

    {weeks.map((weekDays, idx) => {
      const { avgVolatility, totalVolume } = aggregateWeek(weekDays);

      //  Get weekly performance (Mon Open → Sun Close)
      const validDays = weekDays
        .map((d) => dataByDate[d.format("YYYY-MM-DD")])
        .filter(Boolean);

      let weeklyPerformance = 0;
      if (validDays.length > 1) {
        const firstOpen = validDays[0].open;
        const lastClose = validDays[validDays.length - 1].close;
        weeklyPerformance = ((lastClose - firstOpen) / firstOpen) * 100;
      }

      return (
        <Paper
          key={idx}
          sx={{
            p: 2,
            m: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography>
            Week {idx + 1}: {weekDays[0].format("MMM D")} -{" "}
            {weekDays[6].format("MMM D")}
          </Typography>

          <Typography>
            Volatility: {avgVolatility.toFixed(2)}% | Volume:{" "}
            {totalVolume.toLocaleString()} | Perf:{" "}
            {weeklyPerformance.toFixed(2)}%
          </Typography>
        </Paper>
      );
    })}
  </Box>
          )}

          {/* === MONTHLY VIEW === */}
          {viewMode === "month" && (
           <Box mt={2}>
    <Typography variant="h6" align="center" gutterBottom>
      Monthly Summary (Volatility + Liquidity + Performance)
    </Typography>

    {(() => {
      const { avgVolatility, totalVolume } = aggregateMonth(calendarDays);

      //  Get monthly performance (1st day → last day)
      const validDays = calendarDays
        .map((d) => dataByDate[d.format("YYYY-MM-DD")])
        .filter(Boolean);

      let monthlyPerformance = 0;
      if (validDays.length > 1) {
        const firstOpen = validDays[0].open;
        const lastClose = validDays[validDays.length - 1].close;
        monthlyPerformance = ((lastClose - firstOpen) / firstOpen) * 100;
      }

      return (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1">
            Avg Volatility: {avgVolatility.toFixed(2)}%
          </Typography>
          <Typography variant="body1">
            Total Volume: {totalVolume.toLocaleString()}
          </Typography>
          <Typography variant="body1">
            Monthly Performance: {monthlyPerformance.toFixed(2)}%
          </Typography>
        </Paper>
      );
    })()}
  </Box>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default Calendar;
