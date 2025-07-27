export function calculateVolatility(open: number, high: number, low: number) {
  const intradayRange = high - low;
  const volatilityPercent = (intradayRange / open) * 100;

  if (volatilityPercent < 2) return "low";
  if (volatilityPercent < 5) return "medium";
  return "high";
}

export function getVolatilityPercent(
  open: number,
  high: number,
  low: number
): number {
  if (!open || !high || !low) return 0;
  return ((high - low) / open) * 100;
}

export function getVolatilityColor(level?: string) {
  switch (level) {
    case "low":
      return "#d4edda"; // ✅ Green
    case "medium":
      return "#fff3cd"; // ✅ Yellow/Orange
    case "high":
      return "#f8d7da"; // ✅ Red
    default:
      return "white";
  }
}
