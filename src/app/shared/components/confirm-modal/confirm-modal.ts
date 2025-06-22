import { Component, signal, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      (click)="onBackdropClick($event)"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all duration-200 scale-100"
        (click)="$event.stopPropagation()"
      >
        <!-- Icon -->
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4"
          [class]="getIconClasses()"
        >
          @if (type() === 'danger') {
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          } @else if (type() === 'warning') {
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          } @else {
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          }
        </div>

        <!-- Title & Message -->
        <div class="text-center mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ title() }}
          </h3>
          @if (message()) {
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ message() }}
          </p>
          }
        </div>

        <!-- Actions -->
        <div class="flex space-x-3">
          <button
            (click)="onCancel()"
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            {{ cancelText() }}
          </button>
          <button
            (click)="onConfirm()"
            class="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            [class]="getConfirmButtonClasses()"
          >
            {{ confirmText() }}
          </button>
        </div>
      </div>
    </div>
    }
  `,
})
export class ConfirmModalComponent {
  // Inputs
  isOpen = input<boolean>(false);
  type = input<'info' | 'warning' | 'danger'>('info');
  title = input<string>('Confirmar acción');
  message = input<string>('');
  confirmText = input<string>('Confirmar');
  cancelText = input<string>('Cancelar');

  // Outputs
  confirm = output<void>();
  cancel = output<void>();

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  getIconClasses(): string {
    switch (this.type()) {
      case 'danger':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    }
  }

  getConfirmButtonClasses(): string {
    switch (this.type()) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  }
}
