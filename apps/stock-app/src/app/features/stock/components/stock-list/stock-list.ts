import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from "@angular/core";
;
import { StockStore } from "../../state/stock.state";
import { Stock } from '../../models';
import { StockCard } from '../stock-card/stock-card';
import { StockWsService } from '../../state/stock-ws.service';

@Component({
  selector: 'stock-list',
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.scss',
  imports: [StockCard],
  providers: [StockWsService, StockStore,]

})
export class StockList implements OnDestroy {

  private stockStore = inject(StockStore);

  readonly stockList = toSignal(this.stockStore.connect(), { initialValue: [] });

  readonly isConnected = computed(() => this.stockStore.isConnected() );

  readonly sortedStocks = computed(() => {
    return [...this.stockList() ?? []].sort(
      (a, b) => (a.symbol ?? '').localeCompare(b.symbol ?? '')
    );
  });

  readonly dataLoaded = computed(() => {
    const list = this.stockList();
    return list.length > 0;
  });


  // constructor(){
  //   effect(() => {
  //     console.log(this.isConnected())
  //   })
  // }

  toggle(stock: Stock) {
    this.stockStore.toggle(stock)
  }

  ngOnDestroy(): void {
    this.stockStore.disconnectSocket()
  }
}
