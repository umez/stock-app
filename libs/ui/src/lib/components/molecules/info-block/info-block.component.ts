import {
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'mb-info-block',
  host: {
    class: 'mb-info-block',
  },
  templateUrl: 'info-block.component.html',
  styleUrl: 'info-block.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class InfoBlockComponent {
  name = input()
  label = input.required()
}
