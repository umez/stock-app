import { Injectable, signal, computed, inject } from '@angular/core';
import { StockWsService } from './stock-ws.service';
import { debounceTime, map, shareReplay, throttleTime } from 'rxjs';
import { Stock, STOCK_NAME_MAP } from '../models';

@Injectable({ providedIn: 'root' })
export class StockStore {

  private stockWsService = inject(StockWsService);
  private _stocks = signal<Stock[]>([]);
  stocksWs$ = this.stockWsService.stocks$
  // readonly stocks = computed(() => this._stocks());

  connect() {
    this.stockWsService.connectSocket();
    return this.stocksWs$.pipe(
      throttleTime(3000),
      shareReplay(),
      map(res =>  this.update(res))
    )
  }

  update(data: Stock[]) {
    const current = this._stocks();
    const updated = data.map((stock:Stock) => {
      const prev = current.find(previous => previous.symbol === stock.symbol);
      if (prev && !prev.active) return prev;
      return {
        ...stock,
        name: STOCK_NAME_MAP[stock.symbol] ?? stock.symbol,
        active: prev?.active ?? true
      };
    });
    this._stocks.set(updated);
    return this._stocks();
  }

  toggle(symbol: string) {
    this._stocks.update(stocks =>
      stocks.map(stock =>
        stock.symbol === symbol
          ? { ...stock, active: !stock.active }
          : stock
      )
    );
  }

  disconnectSocket() {
    this.stockWsService.disconnectSocket()
  }
}
