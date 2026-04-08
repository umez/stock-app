import { Component, input, ViewEncapsulation } from '@angular/core';
import { HeaderRightBlockDirective, MbHeader} from '../../../templates/header.component';

@Component({
  selector: 'mb-card',
  templateUrl: './card.html',
  styleUrl: './card.scss',
   host: {
    class: 'mb-card pd-p6 flex-column',
  },
  imports: [MbHeader],
  encapsulation: ViewEncapsulation.None
})
export class MbCard {
  headline = input<string>();
  subline = input<string>();
}
