import { Component } from "@angular/core";
import { StockList } from "./components/stock-list/stock-list";

@Component({
  selector: 'page',
  templateUrl: 'page.html',
  imports: [
    StockList
  ]

})
export class Page {

}
