import dayjs from "../dayjsSetup";

export interface OHLCV {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Group by Week (ISO week)
export function aggregateWeekly(data: OHLCV[]) {
  const grouped: Record<string, OHLCV[]> = {};

  data.forEach((d) => {
    const weekKey = `${dayjs(d.date).year()}-W${dayjs(d.date).week()}`;
    if (!grouped[weekKey]) grouped[weekKey] = [];
    grouped[weekKey].push(d);
  });

  return Object.entries(grouped).map(([weekKey, items]) => {
    const sorted = items.sort((a, b) => a.date.getTime() - b.date.getTime());
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const totalVolume = items.reduce((sum, d) => sum + d.volume, 0);
    const avgVolatility =
      items.reduce(
        (sum, d) => sum + (d.open ? (d.high - d.low) / d.open : 0),
        0
      ) / items.length;

    const performance = ((last.close - first.open) / first.open) * 100;

    return {
      period: weekKey,
      startDate: first.date,
      endDate: last.date,
      open: first.open,
      close: last.close,
      high: Math.max(...items.map((d) => d.high)),
      low: Math.min(...items.map((d) => d.low)),
      volume: totalVolume,
      avgVolatilityPercent: avgVolatility * 100,
      performance,
    };
  });
}

// Group by Month
export function aggregateMonthly(data: OHLCV[]) {
  const grouped: Record<string, OHLCV[]> = {};

  data.forEach((d) => {
    const monthKey = dayjs(d.date).format("YYYY-MM");
    if (!grouped[monthKey]) grouped[monthKey] = [];
    grouped[monthKey].push(d);
  });

  return Object.entries(grouped).map(([monthKey, items]) => {
    const sorted = items.sort((a, b) => a.date.getTime() - b.date.getTime());
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const totalVolume = items.reduce((sum, d) => sum + d.volume, 0);
    const avgVolatility =
      items.reduce(
        (sum, d) => sum + (d.open ? (d.high - d.low) / d.open : 0),
        0
      ) / items.length;

    const performance = ((last.close - first.open) / first.open) * 100;

    return {
      period: monthKey,
      startDate: first.date,
      endDate: last.date,
      open: first.open,
      close: last.close,
      high: Math.max(...items.map((d) => d.high)),
      low: Math.min(...items.map((d) => d.low)),
      volume: totalVolume,
      avgVolatilityPercent: avgVolatility * 100,
      performance,
    };
  });
}
