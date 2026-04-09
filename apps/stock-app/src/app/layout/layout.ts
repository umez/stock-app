import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PageHeader } from "./page-header/page-header";

@Component({
  selector: 'layout',
  templateUrl: './layout.html',
  imports: [RouterModule, PageHeader]
})
export class Layout{}
