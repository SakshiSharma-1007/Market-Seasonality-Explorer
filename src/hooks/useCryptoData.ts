import { useQuery } from "@tanstack/react-query";
import { fetchKlines } from "../services/binanceAPI";

export function useCryptoData(symbol = "BTCUSDT", interval = "1d") {
  return useQuery({
    queryKey: ["cryptoData", symbol, interval],
    queryFn: () => fetchKlines(symbol, interval),
    refetchInterval: 60000, // refresh every minute
  });
}
