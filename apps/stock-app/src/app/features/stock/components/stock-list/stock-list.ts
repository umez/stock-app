import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, effect, inject, OnDestroy, OnInit } from "@angular/core";
;
import { StockStore } from "../../state/stock.state";
import { Stock } from '../../models';
import { StockCard } from '../stock-card/stock-card';

@Component({
  selector: 'stock-list',
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.scss',
  imports: [StockCard]

})
export class StockList implements OnDestroy {

  private stockStore = inject(StockStore);

  readonly stockList = toSignal(this.stockStore.connect());

  readonly sortedStocks = computed(() => {
    return [...this.stockList() ?? []].sort(
      (a, b) => (a.symbol ?? '').localeCompare(b.symbol ?? '')
    );
  });

  // constructor() {
  //   effect(() => {
  //     console.log(this.sortedStocks()[3])
  //   });
  // }

  toggle(stock: Stock) {

    console.log(stock)
    this.stockStore.toggle(stock.symbol)
  }



  ngOnDestroy(): void {
    this.stockStore.disconnectSocket()
  }
}
