import { Component, signal, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header
      class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/dashboard" class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21l3-9 9-3-3 9-9 3zm2.5-5.5l1.5 1.5"
                  />
                </svg>
              </div>
              <span
                class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                UTEC Diagrams
              </span>
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <a
              routerLink="/dashboard"
              routerLinkActive="text-blue-600 border-blue-600"
              class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border-b-2 border-transparent transition-colors"
            >
              Dashboard
            </a>
            <a
              routerLink="/diagrams"
              routerLinkActive="text-blue-600 border-blue-600"
              class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border-b-2 border-transparent transition-colors"
            >
              Diagramas
            </a>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <button
              (click)="toggleTheme()"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              @if (isDark()) {
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              } @else {
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              }
            </button>

            <!-- User Avatar & Dropdown -->
            <div class="relative">
              <button
                (click)="toggleUserMenu()"
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div
                  class="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                >
                  <span class="text-sm font-medium text-white">
                    {{ getUserInitial() }}
                  </span>
                </div>
                <span
                  class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {{ authService.currentUser()?.name }}
                </span>
                <svg
                  class="w-4 h-4 text-gray-500 transition-transform"
                  [class.rotate-180]="showUserMenu()"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              @if (showUserMenu()) {
              <div
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              >
                <div class="py-1">
                  <div
                    class="px-4 py-2 border-b border-gray-200 dark:border-gray-700"
                  >
                    <p
                      class="text-sm text-gray-900 dark:text-white font-medium"
                    >
                      {{ authService.currentUser()?.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ authService.currentUser()?.email }}
                    </p>
                  </div>
                  <button
                    (click)="logout()"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showUserMenu = signal(false);
  isDark = signal(false);

  ngOnInit() {
    // Detectar tema inicial
    this.isDark.set(document.documentElement.classList.contains('dark'));
  }

  toggleUserMenu() {
    this.showUserMenu.update((show) => !show);
  }

  toggleTheme() {
    const html = document.documentElement;
    const isDarkMode = html.classList.contains('dark');

    if (isDarkMode) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }

    this.isDark.set(!isDarkMode);
  }

  logout() {
    this.authService.logout();
    this.showUserMenu.set(false);
  }

  getUserInitial(): string {
    const name = this.authService.currentUser()?.name;
    return name ? name.charAt(0).toUpperCase() : 'U';
  }
}
