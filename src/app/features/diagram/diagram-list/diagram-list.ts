import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DiagramService } from '../../../core/services/diagram.service';
import { Diagram, DiagramType } from '../../../shared/models/diagram.model';
import { HeaderComponent } from '../../../shared/components/header/header';
import { LoadingComponent } from '../../../shared/components/loading/loading';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-diagram-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HeaderComponent,
    LoadingComponent,
    ConfirmModalComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <app-header />

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Mis Diagramas
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
              Gestiona y edita todos tus diagramas técnicos
            </p>
          </div>

          <a
            routerLink="/diagrams/new"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
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
            Nuevo Diagrama
          </a>
        </div>

        <!-- Filters -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 mb-6"
        >
          <div class="flex flex-wrap items-center gap-4">
            <!-- Search -->
            <div class="flex-1 min-w-64">
              <div class="relative">
                <input
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="onSearch()"
                  type="text"
                  placeholder="Buscar diagramas..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <!-- Type Filter -->
            <select
              [(ngModel)]="selectedType"
              (ngModelChange)="onFilterChange()"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="aws">AWS Architecture</option>
              <option value="er">Entity Relationship</option>
              <option value="json">JSON Structure</option>
              <option value="mermaid">Mermaid</option>
              <option value="sql">SQL Schema</option>
            </select>

            <!-- Sort -->
            <select
              [(ngModel)]="sortBy"
              (ngModelChange)="onFilterChange()"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="updatedAt">Más recientes</option>
              <option value="createdAt">Más antiguos</option>
              <option value="title">Nombre A-Z</option>
            </select>
          </div>
        </div>

        <!-- Diagrams Grid -->
        @if (diagramService.isLoading()) {
        <app-loading type="dots" size="lg" message="Cargando diagramas..." />
        } @else if (filteredDiagrams().length > 0) {
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (diagram of filteredDiagrams(); track diagram.id) {
          <div
            class="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <!-- Diagram Preview -->
            <div
              class="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden"
            >
              @if (diagram.imageUrl) {
              <img
                [src]="diagram.imageUrl"
                [alt]="diagram.title"
                class="w-full h-full object-cover"
                (error)="onImageError($event)"
              />
              } @else {
              <div class="w-full h-full flex items-center justify-center">
                <svg
                  class="w-12 h-12 text-gray-400"
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
              }

              <!-- Overlay with actions -->
              <div
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2"
              >
                <a
                  [routerLink]="['/diagrams', diagram.id, 'edit']"
                  class="p-2 bg-white/20 backdrop-blur rounded-lg text-white hover:bg-white/30 transition-colors"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </a>
                <button
                  (click)="deleteDiagram(diagram)"
                  class="p-2 bg-red-500/20 backdrop-blur rounded-lg text-white hover:bg-red-500/30 transition-colors"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Diagram Info -->
            <div class="p-4">
              <div class="flex items-center justify-between mb-2">
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white truncate"
                >
                  {{ diagram.title }}
                </h3>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  [class]="getTypeColorClass(diagram.type)"
                >
                  {{ getDiagramTypeLabel(diagram.type) }}
                </span>
              </div>

              @if (diagram.description) {
              <p
                class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
              >
                {{ diagram.description }}
              </p>
              }

              <div
                class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
              >
                <span
                  >Actualizado {{ getRelativeTime(diagram.updatedAt) }}</span
                >
                <span>{{ getRelativeTime(diagram.createdAt) }}</span>
              </div>
            </div>
          </div>
          }
        </div>
        } @else {
        <!-- Empty State -->
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
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            @if (searchQuery()) { No se encontraron diagramas } @else { No hay
            diagramas aún }
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            @if (searchQuery()) { Intenta cambiar los filtros de búsqueda }
            @else { Crea tu primer diagrama para empezar }
          </p>
          @if (!searchQuery()) {
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
          }
        </div>
        }
      </main>

      <!-- Delete Confirmation Modal -->
      @if (showDeleteModal()) {
      <app-confirm-modal
        title="Eliminar Diagrama"
        [message]="getDeleteMessage()"
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        (confirm)="confirmDelete()"
        (cancel)="cancelDelete()"
      />
      }
    </div>
  `,
})
export class DiagramListComponent {
  protected readonly diagramService = inject(DiagramService);
  private readonly toastService = inject(ToastService);

  // Filters
  searchQuery = signal('');
  selectedType = signal('');
  sortBy = signal('updatedAt');

  // Modal states
  showDeleteModal = signal(false);
  diagramToDelete = signal<Diagram | null>(null);

  // Computed
  filteredDiagrams = signal<Diagram[]>([]);

  ngOnInit() {
    this.loadDiagrams();
  }

  private loadDiagrams() {
    // Si es usuario demo, usar datos de prueba
    if (this.diagramService.diagrams().length === 0) {
      // Verificar si es usuario demo
      const user = JSON.parse(
        localStorage.getItem('utec_diagram_user') || '{}'
      );
      if (user.user_id === 'demo-user-123') {
        this.diagramService.loadDemoData();
      }
    }

    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  private applyFilters() {
    let diagrams = [...this.diagramService.diagrams()];

    // Apply search filter
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      diagrams = diagrams.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.description?.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (this.selectedType()) {
      diagrams = diagrams.filter((d) => d.type === this.selectedType());
    }

    // Apply sorting
    diagrams.sort((a, b) => {
      switch (this.sortBy()) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case 'updatedAt':
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });

    this.filteredDiagrams.set(diagrams);
  }

  deleteDiagram(diagram: Diagram) {
    this.diagramToDelete.set(diagram);
    this.showDeleteModal.set(true);
  }

  confirmDelete() {
    const diagram = this.diagramToDelete();
    if (!diagram) return;

    // Simular eliminación exitosa para datos demo
    const currentDiagrams = this.diagramService.diagrams();
    const updatedDiagrams = currentDiagrams.filter((d) => d.id !== diagram.id);
    this.diagramService.diagrams.set(updatedDiagrams);

    this.toastService.success(
      'Diagrama eliminado',
      `El diagrama "${diagram.title}" se ha eliminado exitosamente`
    );

    this.showDeleteModal.set(false);
    this.diagramToDelete.set(null);
    this.applyFilters();
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.diagramToDelete.set(null);
  }

  getDeleteMessage(): string {
    const diagram = this.diagramToDelete();
    if (!diagram) return '';
    return `¿Estás seguro de que quieres eliminar "${diagram.title}"? Esta acción no se puede deshacer.`;
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  getDiagramTypeLabel(type: DiagramType): string {
    const typeMap: Record<DiagramType, string> = {
      [DiagramType.AWS]: 'AWS',
      [DiagramType.ER]: 'ER',
      [DiagramType.JSON]: 'JSON',
      [DiagramType.MERMAID]: 'Mermaid',
      [DiagramType.SQL]: 'SQL',
    };
    return typeMap[type] || type;
  }

  getTypeColorClass(type: DiagramType): string {
    const colorMap: Record<DiagramType, string> = {
      [DiagramType.AWS]:
        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      [DiagramType.ER]:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      [DiagramType.JSON]:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      [DiagramType.MERMAID]:
        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      [DiagramType.SQL]:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    };
    return (
      colorMap[type] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    );
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'hoy';
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `hace ${diffDays}d`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)}sem`;
    return `hace ${Math.floor(diffDays / 30)}m`;
  }
}
