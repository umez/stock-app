export class StockModel {
  constructor(
    public symbol: string,
    public current: number,
    public change: number,
    public percentChange: number,
    public high: number,
    public low: number,
    public open: number,
    public previousClose: number,
    public timestamp: number

  ){}
}
