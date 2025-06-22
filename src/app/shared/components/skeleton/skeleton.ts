import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (type() === 'card') {
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
    >
      <!-- Image skeleton -->
      <div
        class="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"
      ></div>
      <!-- Title skeleton -->
      <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
      <!-- Description skeleton -->
      <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
      <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
    } @else if (type() === 'list') {
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
    >
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        <div class="flex-1">
          <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
        </div>
      </div>
    </div>
    } @else if (type() === 'text') {
    <div class="animate-pulse">
      @for (line of lines(); track $index) {
      <div
        class="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"
        [style.width.%]="line"
      ></div>
      }
    </div>
    } @else {
    <!-- Custom skeleton -->
    <div
      class="animate-pulse"
      [style.width]="width()"
      [style.height]="height()"
    >
      <div
        class="bg-gray-300 dark:bg-gray-700 rounded"
        [style.width]="width()"
        [style.height]="height()"
      ></div>
    </div>
    }
  `,
})
export class SkeletonComponent {
  type = input<'card' | 'list' | 'text' | 'custom'>('custom');
  width = input<string>('100%');
  height = input<string>('20px');
  lines = input<number[]>([100, 80, 60]); // Porcentajes de ancho para líneas de texto
}
