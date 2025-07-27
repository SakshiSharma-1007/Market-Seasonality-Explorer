import { Box, Typography, Tooltip } from "@mui/material";
import { getVolatilityColor } from "../../utils/volatilityUtils";

interface CalendarCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: () => void;
  volatilityLevel?: "low" | "medium" | "high";
  performance?: number;
  extraInfo?: { open: number; close: number; high: number; low: number; volume: number };
}

export default function CalendarCell({
  date,
  isCurrentMonth,
  isToday,
  onClick,
  volatilityLevel,
  performance,
  extraInfo
}: CalendarCellProps) {
  const tooltip = extraInfo ? (
    <>
      <strong>{date.toDateString()}</strong><br />
      Open: {extraInfo.open.toFixed(2)}<br />
      Close: {extraInfo.close.toFixed(2)}<br />
      High: {extraInfo.high.toFixed(2)}<br />
      Low: {extraInfo.low.toFixed(2)}<br />
      Volume: {extraInfo.volume.toFixed(0)}
    </>
  ) : "No data";

  return (
    <Tooltip title={tooltip} arrow placement="top">
      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          bgcolor: isToday ? "lightblue" : getVolatilityColor(volatilityLevel),
          cursor: "pointer",
          textAlign: "center",
          minHeight: 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.2s ease-in-out",
          "&:hover": { transform: "scale(1.05)", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },
          opacity: isCurrentMonth ? 1 : 0.4,
        }}
        onClick={onClick}
      >
        <Typography variant="subtitle2" fontWeight={isToday ? "bold" : "normal"}>
          {date.getDate()}
        </Typography>
        {performance !== undefined && (
          <Typography
            variant="caption"
            fontWeight="bold"
            color={performance > 0 ? "green" : performance < 0 ? "red" : "gray"}
          >
            {performance > 0 ? `↑ ${performance.toFixed(1)}%` :
             performance < 0 ? `↓ ${performance.toFixed(1)}%` : "•"}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}
