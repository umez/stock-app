

import { Component, effect, input, output } from "@angular/core";
import { Stock } from "../../models";
import { CurrencyPipe } from "@angular/common";
import { InfoBlockComponent, MbCard, BadgeComponent, HeaderRightBlockDirective, ToggleComponent } from 'libs/ui/src';

@Component({
  selector: 'stock-card',
  templateUrl: './stock-card.html',
  styleUrl: './stock-card.scss',
  imports: [CurrencyPipe, MbCard, InfoBlockComponent, BadgeComponent, HeaderRightBlockDirective, ToggleComponent],
  host: {
    '[class.activate]': 'addClass()',
  }
})
export class StockCard{

  stock = input.required<Stock>();

  toggle = output<Stock>()

  addClass() {
    this.stock()?.activate
  }

  // constructor() {
  //   effect(() => {
  //     // console.log(this.stock())
  //   })
  // }

}
