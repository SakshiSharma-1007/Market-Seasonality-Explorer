export interface OHLCV {
  date: Date; // The date of the data point
  open: number; // Opening price
  high: number; // Highest price in the period
  low: number; // Lowest price in the period
  close: number; // Closing price
  volume: number; // Trading volume
}
