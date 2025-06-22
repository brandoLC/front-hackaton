import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <button
        (click)="toggleTooltip()"
        (mouseenter)="showTooltip()"
        (mouseleave)="hideTooltip()"
        class="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        type="button"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>

      @if (isVisible()) {
      <div
        class="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700 transition-opacity duration-200"
        [class]="getTooltipPosition()"
      >
        <div class="max-w-xs">
          {{ content }}
        </div>
        <div class="tooltip-arrow" [class]="getArrowPosition()"></div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .tooltip-arrow {
        position: absolute;
        width: 0;
        height: 0;
      }

      .tooltip-arrow.bottom {
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #111827;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
      }

      .tooltip-arrow.top {
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid #111827;
        top: -5px;
        left: 50%;
        transform: translateX(-50%);
      }

      .tooltip-arrow.left {
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-right: 5px solid #111827;
        left: -5px;
        top: 50%;
        transform: translateY(-50%);
      }

      .tooltip-arrow.right {
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid #111827;
        right: -5px;
        top: 50%;
        transform: translateY(-50%);
      }

      .dark .tooltip-arrow.bottom {
        border-top-color: #374151;
      }

      .dark .tooltip-arrow.top {
        border-bottom-color: #374151;
      }

      .dark .tooltip-arrow.left {
        border-right-color: #374151;
      }

      .dark .tooltip-arrow.right {
        border-left-color: #374151;
      }
    `,
  ],
})
export class HelpTooltipComponent {
  @Input() content: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  isVisible = signal(false);
  private hideTimeout?: number;

  showTooltip() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.isVisible.set(true);
  }

  hideTooltip() {
    this.hideTimeout = window.setTimeout(() => {
      this.isVisible.set(false);
    }, 300);
  }

  toggleTooltip() {
    this.isVisible.update((visible) => !visible);
  }

  getTooltipPosition(): string {
    switch (this.position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
    }
  }

  getArrowPosition(): string {
    return this.position;
  }
}
