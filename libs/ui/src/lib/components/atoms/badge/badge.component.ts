import {
  Component,
  HostBinding,
  input,
  ViewEncapsulation,
} from '@angular/core';

type BadgeType = 'status' | 'tag';

@Component({
  selector: 'mb-badge',
  host: {
    class: 'mb-badge',
  },
  templateUrl: 'badge.component.html',
  styleUrl: 'badge.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BadgeComponent {

  @HostBinding('attr.data-type')

  type = input<BadgeType>('tag');

}
