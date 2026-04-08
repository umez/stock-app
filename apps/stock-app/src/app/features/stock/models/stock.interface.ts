export type Stock = {
  symbol: string;
  name: string;
  current: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number,
  previousClose: number,
  timestamp: number
  active: boolean
}
