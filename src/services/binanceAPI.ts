import axios from "axios";

const BASE_URL = "https://api.binance.com/api/v3";

// Fetch OHLCV (Open/High/Low/Close/Volume)
export async function fetchKlines(
  symbol = "BTCUSDT",
  interval = "1d",
  limit = 90
) {
  const res = await axios.get(`${BASE_URL}/klines`, {
    params: { symbol, interval, limit },
  });

  return res.data.map((k: any) => ({
    date: new Date(k[0]),
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5]),
  }));
}
