// toggle.component.ts
import {
  Component, input, model,
  computed, output, ChangeDetectionStrategy
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'mb-toggle',
  template: `
    <button
      type="button"
      role="switch"
      class="mb-toggle__track"
      [class.on]="value()"
      [class.off]="!value()"
      [attr.aria-checked]="value()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-disabled]="disabled()"
      [attr.aria-readonly]="readonly()"
      (click)="handleClick()"
      (keydown.space)="$event.preventDefault(); handleClick()"
      (keydown.enter)="$event.preventDefault(); handleClick()"
    >
      <span class="mb-toggle__thumb"></span>

      @if (showLabel()) {
        <span class="mb-toggle__label">
          {{ value() ? onLabel() : offLabel() }}
        </span>
      }
    </button>
  `,
  styleUrl: './toggle.component.scss',
  host: {
    '[class.mb-toggle]': 'true',
    '[class.mb-toggle--on]': 'value()',
    '[class.mb-toggle--off]': '!value()',
    '[class.mb-toggle--disabled]': 'disabled()',
    '[class.mb-toggle--readonly]': 'readonly()',
    '[class.mb-toggle--sm]': 'size() === "sm"',
    '[class.mb-toggle--md]': 'size() === "md"',
    '[class.mb-toggle--lg]': 'size() === "lg"',
  },
})
export class ToggleComponent implements FormValueControl<boolean> {

  // --- FormValueControl contract ---
  readonly value    = model<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);

  // --- extra inputs ---
  readonly size      = input<'sm' | 'md' | 'lg'>('md');
  readonly onLabel   = input<string>('On');
  readonly offLabel  = input<string>('Off');
  readonly showLabel = input<boolean>(false);
  readonly ariaLabel = input<string>('toggle');

  // --- outputs ---
  readonly toggled = output<boolean>();
  // readonly touched = output<void>();

  // --- computed ---
  readonly isActive = computed(() => this.value() && !this.disabled());

  handleClick(): void {
    if (this.disabled() || this.readonly()) return;
    const next = !this.value();
    this.value.set(next);
    this.toggled.emit(next);
  }

  // handleBlur(): void {
  //   this.touched.emit();
  // }

  setValue(val: boolean): void {
    if (this.disabled() || this.readonly()) return;
    this.value.set(val);
  }

  toggle(): void {
    this.setValue(!this.value());
  }

  setOn(): void {
    this.setValue(true);
  }

  setOff(): void {
    this.setValue(false);
  }
}
