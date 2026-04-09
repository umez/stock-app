// export type Stock = {
//   symbol: string;
//   name: string;
//   current: number;
//   change: number;
//   percentChange: number;
//   high: number;
//   low: number;
//   open: number;
//   previousClose: number;
//   timestamp: number;
//   active: boolean;
//   activate: boolean;
// }
export class Stock {
  constructor(
    public symbol: string,
    public name: string,
    public current: number,
    public change: number,
    public percentChange: number,
    public high: number,
    public low: number,
    public open: number,
    public previousClose: number,
    public timestamp: number,
    public activate: boolean = true,
    public active?: boolean,
  ) { }
}
