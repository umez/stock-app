import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Page } from './features/stock/page';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'stock-app';
}
