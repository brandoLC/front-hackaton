import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [class]="containerClass()">
      @if (type() === 'spinner') {
      <div
        class="animate-spin rounded-full border-2 border-primary/20 border-t-primary"
        [class]="spinnerClass()"
      ></div>
      } @else if (type() === 'dots') {
      <div class="flex space-x-2">
        <div
          class="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"
        ></div>
        <div
          class="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"
        ></div>
        <div class="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
      </div>
      } @else if (type() === 'pulse') {
      <div
        class="animate-pulse bg-primary/20 rounded-lg"
        [class]="pulseClass()"
      ></div>
      } @if (message()) {
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
        {{ message() }}
      </p>
      }
    </div>
  `,
  styles: [
    `
      @keyframes bounce {
        0%,
        80%,
        100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
    `,
  ],
})
export class LoadingComponent {
  type = input<'spinner' | 'dots' | 'pulse'>('spinner');
  size = input<'sm' | 'md' | 'lg'>('md');
  message = input<string>('');
  containerClass = input<string>('p-8');

  spinnerClass = () => {
    const sizes = {
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    };
    return sizes[this.size()];
  };

  pulseClass = () => {
    const sizes = {
      sm: 'w-16 h-4',
      md: 'w-24 h-6',
      lg: 'w-32 h-8',
    };
    return sizes[this.size()];
  };
}
