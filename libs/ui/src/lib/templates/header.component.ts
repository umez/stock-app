@Directive({
  selector: 'mb-header-right-block',
  host: {
    class: 'mb-header-right-block',
  },
})
export class HeaderRightBlockDirective {}


import {
  Component,
  Directive,
  HostBinding,
  input,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: `mb-header`,
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'md-header',
  },
})
export class MbHeader {

  headline = input<string>();
  subline = input<string>();
  centered = input(false);
}



