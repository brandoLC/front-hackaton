import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DiagramService } from '../../core/services/diagram.service';
import { HeaderComponent } from '../../shared/components/header/header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <app-header />

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Hola, {{ authService.currentUser()?.name }}! 👋
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Bienvenido a UTEC Diagrams. Aquí puedes crear y gestionar todos tus
            diagramas técnicos.
          </p>
        </div>

        <!-- Quick Actions -->
        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <!-- Create New Diagram -->
          <a
            routerLink="/diagrams/new"
            class="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold">Crear diagrama</h3>
                <p class="text-blue-100">Empieza un nuevo proyecto</p>
              </div>
            </div>
          </a>

          <!-- View All Diagrams -->
          <a
            routerLink="/diagrams"
            class="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 transform hover:scale-105"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors"
              >
                <svg
                  class="w-6 h-6 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Mis diagramas
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Ver todos los diagramas
                </p>
              </div>
            </div>
          </a>
        </div>

        <!-- Statistics Cards -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Diagrams -->
          <div
            class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ totalDiagrams() }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Total diagramas
                </p>
              </div>
            </div>
          </div>

          <!-- This Week -->
          <div
            class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ weeklyCount() }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Esta semana
                </p>
              </div>
            </div>
          </div>

          <!-- Most Used Type -->
          <div
            class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-purple-600 dark:text-purple-400"
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
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ mostUsedType() }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Más popular
                </p>
              </div>
            </div>
          </div>

          <!-- Average Time -->
          <div
            class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ averageTime() }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Tiempo promedio
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Diagrams -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Diagramas recientes
              </h2>
              <a
                routerLink="/diagrams"
                class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                Ver todos →
              </a>
            </div>
          </div>

          <div class="p-6">
            @if (recentDiagrams().length > 0) {
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (diagram of recentDiagrams(); track diagram.id) {
              <div
                class="group p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all cursor-pointer"
              >
                <div class="flex items-center space-x-3 mb-3">
                  <div
                    class="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
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
                  <div class="flex-1 min-w-0">
                    <h3
                      class="text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                      {{ diagram.title }}
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ getDiagramTypeLabel(diagram.type) }}
                    </p>
                  </div>
                </div>
                <p
                  class="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
                >
                  {{ diagram.description || 'Sin descripción' }}
                </p>
                <div
                  class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
                >
                  <span>{{ getRelativeTime(diagram.updatedAt) }}</span>
                  <button
                    class="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-opacity"
                  >
                    Editar
                  </button>
                </div>
              </div>
              }
            </div>
            } @else {
            <div class="text-center py-12">
              <svg
                class="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3
                class="text-lg font-medium text-gray-900 dark:text-white mb-2"
              >
                No hay diagramas aún
              </h3>
              <p class="text-gray-500 dark:text-gray-400 mb-6">
                Crea tu primer diagrama para empezar
              </p>
              <a
                routerLink="/diagrams/new"
                class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Crear diagrama
              </a>
            </div>
            }
          </div>
        </div>

        <!-- Diagram Types Info -->
        <div class="mt-8 grid md:grid-cols-4 gap-6">
          @for (type of diagramTypes; track type.key) {
          <div
            class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700"
          >
            <div
              class="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-3"
            ></div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-1">
              {{ type.name }}
            </h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              {{ type.description }}
            </p>
          </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class DashboardComponent {
  protected readonly authService = inject(AuthService);
  private readonly diagramService = inject(DiagramService);

  totalDiagrams = signal(0);
  recentDiagrams = signal<any[]>([]);
  weeklyCount = signal(0);
  mostUsedType = signal('AWS');
  averageTime = signal('15 min');

  diagramTypes = [
    {
      key: 'aws',
      name: 'AWS Architecture',
      description: 'Diagramas de arquitectura de AWS con servicios en la nube',
    },
    {
      key: 'er',
      name: 'Entity Relationship',
      description: 'Diagramas de base de datos y relaciones entre entidades',
    },
    {
      key: 'json',
      name: 'JSON Structure',
      description: 'Visualización de estructuras JSON complejas',
    },
    {
      key: 'mermaid',
      name: 'Mermaid',
      description: 'Diagramas versátiles con sintaxis Mermaid',
    },
    {
      key: 'sql',
      name: 'SQL Schema',
      description: 'Esquemas de base de datos con tablas y relaciones',
    },
  ];

  ngOnInit() {
    this.loadRecentDiagrams();
  }

  private loadRecentDiagrams() {
    // Si es usuario demo, cargar datos de prueba
    if (this.authService.currentUser()?.user_id === 'demo-user-123') {
      this.diagramService.loadDemoData();
      const demoDiagrams = this.diagramService.diagrams().slice(0, 6);
      this.recentDiagrams.set(demoDiagrams);
      this.totalDiagrams.set(this.diagramService.diagrams().length);

      // Calcular estadísticas demo
      this.calculateStats(this.diagramService.diagrams());
      return;
    }

    // Carga normal desde API
    this.diagramService.getDiagrams(1, 6).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.recentDiagrams.set(response.data);
          this.totalDiagrams.set(response.pagination?.total || 0);
          this.calculateStats(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading recent diagrams:', error);
      },
    });
  }

  private calculateStats(diagrams: any[]) {
    // Calcular diagramas de esta semana
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyDiagrams = diagrams.filter(
      (d) => new Date(d.createdAt) >= oneWeekAgo
    );
    this.weeklyCount.set(weeklyDiagrams.length);

    // Encontrar tipo más usado
    const typeCounts = diagrams.reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1;
      return acc;
    }, {});

    const mostUsed = Object.entries(typeCounts).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    )[0];

    if (mostUsed) {
      this.mostUsedType.set(this.getDiagramTypeLabel(mostUsed[0]));
    }
  }

  getDiagramTypeLabel(type: string): string {
    const typeMap: Record<string, string> = {
      aws: 'AWS Architecture',
      er: 'Entity Relationship',
      json: 'JSON Structure',
      mermaid: 'Mermaid',
      sql: 'SQL Schema',
    };
    return typeMap[type] || type;
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  }
}
