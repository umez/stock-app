

import { Component, effect, input, output } from "@angular/core";
import { Stock } from "../../models";
import { CurrencyPipe } from "@angular/common";
import { InfoBlockComponent, MbCard, BadgeComponent, HeaderRightBlockDirective, ToggleComponent } from 'libs/ui/src';

@Component({
  selector: 'stock-card',
  templateUrl: './stock-card.html',
  styleUrl: './stock-card.scss',
  imports: [CurrencyPipe, MbCard, InfoBlockComponent, BadgeComponent, HeaderRightBlockDirective, ToggleComponent]
})
export class StockCard{

  stock = input.required<Stock>();

  toggle = output<Stock>()

  constructor() {
    effect(() => {
      console.log(this.stock())
    })
  }




}
