
import { Injectable, signal, inject, computed } from '@angular/core';
import { debounceTime, interval, map, shareReplay } from 'rxjs';
import { Stock, STOCK_NAME_MAP } from '../models';
import { StockWsService } from './stock-ws.service';
import { environment } from 'apps/stock-app/src/environments/environment';

@Injectable()
export class StockStore {

  private stockWsService = inject(StockWsService);

  private _stocks = signal<Stock[]>([]);

  stocksWs$ = this.stockWsService.stocks$;

  private readonly stocksState = signal<Stock[]>([])

  public useMockData = signal<boolean>(environment.USE_MOCK);

  public readonly isConnected = computed(() => this.stockWsService.connectionStatus() || this.useMockData());


  connect() {

    if (this.useMockData()) {
      const MOCK_STOCKS: Stock[] = [
        new Stock('AAPL', '', +1.12, +0.61, 186.0, 186.0, 186.0, 183.5, 184.2, Date.now(), true, true),
        new Stock('GOOGL', '', -12.45, -0.45, 2750.0, 2750.0, 2750.0, 2740.0, 2748.0, Date.now(), true, true),
        new Stock('MSFT', '', +3.25, +0.81, 405.0, 398.0, 398.0, 398.0, 398.86, Date.now(), true, true),
        new Stock('TSLA', '', -4.12, -2.32, 178.0, 170.5, 170.5, 170.5, 177.0, Date.now(), true, true)
      ];

      this._stocks.set(MOCK_STOCKS)
      return interval(5000).pipe(
        shareReplay(1),
        map(() => this.generateMockUpdates()),
        map((res: any) => this.update(res))
      );
    } else {
      this.stockWsService.connectSocket();
      return this.stocksWs$.pipe(
        shareReplay(1),
        debounceTime(4000),
        map(res => this.update(res))
      )
    }
  }

  private update(data: Stock[]) {
    const current = this._stocks();
    const updated = data.map((stock: Stock) => {
      stock.active === undefined ? true : stock.active;
      const prev = current.find(previous => previous.symbol === stock.symbol);
      if (prev && !prev.active) return prev;
      return {
        ...stock,
        name: STOCK_NAME_MAP[stock.symbol] ?? stock.symbol,
        active: prev?.active ?? true,
        activate: false
      };
    });
    this._stocks.set(updated);
    return this._stocks();
  }

  toggle(stockItem: Stock) {
    this._stocks.update(stocks =>
      stocks.map(stock =>
        stock.symbol === stockItem.symbol
          ? { ...stock, active: stockItem.active }
          : stock
      )
    );
  }

  disconnectSocket() {
    this.stockWsService.disconnectSocket()
  }

  private generateMockUpdates(): Stock[] {

    return this._stocks().map(stock => {
      const change = +(Math.random() * 4 - 2).toFixed(2); // -2 to +2
      const current = +(stock.current + change).toFixed(2);

      return new Stock(
        stock.symbol,
        '',
        current,
        change,
        +(change / stock.current * 100).toFixed(2),
        Math.max(stock.high, current),
        Math.min(stock.low || current, current),
        stock.open,
        stock.previousClose,
        Date.now(),
        true
      );
    });
  }

}
