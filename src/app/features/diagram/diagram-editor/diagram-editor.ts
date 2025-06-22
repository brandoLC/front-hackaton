import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DiagramService } from '../../../core/services/diagram.service';
import { ToastService } from '../../../shared/services/toast.service';
import {
  DiagramType,
  DiagramCreateRequest,
  DiagramGenerateRequest,
} from '../../../shared/models/diagram.model';
import { CodeEditorComponent } from './code-editor';
import { LoadingComponent } from '../../../shared/components/loading/loading';
import {
  DIAGRAM_EXAMPLES,
  DIAGRAM_INSTRUCTIONS,
} from '../../../shared/constants/examples';

@Component({
  selector: 'app-diagram-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CodeEditorComponent, LoadingComponent],
  template: `
    <div class="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <div
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              (click)="goBack()"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div>
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ diagramTitle() || 'Nuevo Diagrama' }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Crea y edita tu diagrama con código
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <!-- File Upload -->
            <input
              #fileInput
              type="file"
              accept=".txt,.py,.json,.md"
              (change)="uploadFile($event)"
              class="hidden"
            />
            <button
              (click)="fileInput.click()"
              class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <svg
                class="w-4 h-4 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Subir archivo
            </button>

            <!-- Load from GitHub -->
            <button
              (click)="showGitHubModal.set(true)"
              class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <svg
                class="w-4 h-4 mr-2 inline"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              GitHub
            </button>

            <!-- Load Example -->
            <button
              (click)="loadExample()"
              class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <svg
                class="w-4 h-4 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Ejemplo
            </button>

            <!-- Generate Button -->
            <button
              (click)="generateDiagram()"
              [disabled]="!currentCode() || diagramService.isGenerating()"
              class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              @if (diagramService.isGenerating()) {
              <svg
                class="animate-spin w-4 h-4 mr-2 inline"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generando... } @else {
              <svg
                class="w-4 h-4 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Generar }
            </button>

            <!-- Save Button -->
            @if (generatedImageUrl()) {
            <button
              (click)="saveDiagram()"
              [disabled]="diagramService.isLoading()"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              @if (diagramService.isLoading()) {
              <svg
                class="animate-spin w-4 h-4 mr-2 inline"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              } @else {
              <svg
                class="w-4 h-4 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              } Guardar
            </button>
            }
          </div>
        </div>
      </div>

      <!-- Diagram Type Selector -->
      <div
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4"
      >
        <div class="max-w-7xl mx-auto flex items-center space-x-4">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Tipo de diagrama:</span
          >
          <div class="flex space-x-2">
            <button
              (click)="changeType('aws')"
              [class]="getTypeButtonClass('aws')"
              class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
            >
              AWS
            </button>
            <button
              (click)="changeType('er')"
              [class]="getTypeButtonClass('er')"
              class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
            >
              ER
            </button>
            <button
              (click)="changeType('json')"
              [class]="getTypeButtonClass('json')"
              class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
            >
              JSON
            </button>
            <button
              (click)="changeType('mermaid')"
              [class]="getTypeButtonClass('mermaid')"
              class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
            >
              Mermaid
            </button>
            <button
              (click)="changeType('sql')"
              [class]="getTypeButtonClass('sql')"
              class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
            >
              SQL
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Editor Panel -->
        <div class="w-1/2 p-4">
          <app-code-editor
            [code]="currentCode()"
            [diagramType]="currentDiagramType()"
            [isLoading]="diagramService.isGenerating()"
            [loadingMessage]="'Validando código...'"
            (codeChange)="onCodeChange($event)"
            (typeChange)="onTypeChange($event)"
            class="h-full block"
          />
        </div>

        <!-- Divider -->
        <div class="w-1 bg-gray-200 dark:bg-gray-700 cursor-col-resize"></div>

        <!-- Preview Panel -->
        <div class="w-1/2 p-4">
          <div
            class="h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col"
          >
            <!-- Preview Header -->
            <div
              class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
            >
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Vista previa
              </h3>

              @if (generatedImageUrl()) {
              <div class="flex items-center space-x-2">
                <!-- Export Options -->
                <button
                  (click)="exportDiagram('png')"
                  class="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  PNG
                </button>
                <button
                  (click)="exportDiagram('svg')"
                  class="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  SVG
                </button>
                <button
                  (click)="exportDiagram('pdf')"
                  class="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  PDF
                </button>
              </div>
              }
            </div>

            <!-- Preview Content -->
            <div class="flex-1 p-6 overflow-auto">
              @if (generatedImageUrl()) {
              <div class="flex items-center justify-center h-full">
                <img
                  [src]="generatedImageUrl()"
                  [alt]="'Diagrama ' + getDiagramTypeName()"
                  class="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  (error)="onImageError()"
                />
              </div>
              } @else if (diagramService.isGenerating()) {
              <app-loading
                type="dots"
                size="lg"
                message="Generando tu diagrama..."
                containerClass="h-full"
              />
              } @else {
              <div class="h-full flex items-center justify-center text-center">
                <div class="max-w-sm">
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
                    Escribe tu código
                  </h3>
                  <p class="text-gray-500 dark:text-gray-400 text-sm">
                    Escribe el código para tu diagrama en el editor y presiona
                    "Generar" para ver el resultado
                  </p>
                </div>
              </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- GitHub Modal -->
      @if (showGitHubModal()) {
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Cargar desde GitHub
            </h3>
            <button
              (click)="showGitHubModal.set(false)"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="mb-4">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              URL del archivo
            </label>
            <input
              [(ngModel)]="githubUrl"
              type="text"
              placeholder="https://github.com/user/repo/blob/main/file.py"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex justify-end space-x-3">
            <button
              (click)="showGitHubModal.set(false)"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              (click)="loadFromGitHub()"
              [disabled]="!githubUrl().trim()"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg transition-colors"
            >
              Cargar
            </button>
          </div>
        </div>
      </div>
      }

      <!-- Save Modal -->
      @if (showSaveModal()) {
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Guardar diagrama
          </h3>

          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Título
              </label>
              <input
                [(ngModel)]="diagramTitle"
                type="text"
                placeholder="Mi diagrama increíble"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Descripción (opcional)
              </label>
              <textarea
                [(ngModel)]="diagramDescription"
                rows="3"
                placeholder="Descripción del diagrama..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              >
              </textarea>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              (click)="showSaveModal.set(false)"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              (click)="confirmSave()"
              [disabled]="!diagramTitle().trim()"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 rounded-lg transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class DiagramEditorComponent {
  protected readonly diagramService = inject(DiagramService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  // Signals
  currentCode = signal<string>('');
  currentDiagramType = signal<DiagramType>(DiagramType.AWS);
  generatedImageUrl = signal<string>('');

  // Modal states
  showGitHubModal = signal(false);
  showSaveModal = signal(false);

  // Form data
  githubUrl = signal('');
  diagramTitle = signal('');
  diagramDescription = signal('');

  ngOnInit() {
    // Cargar ejemplo inicial
    this.loadInitialExample();
  }

  loadExample() {
    const example = (DIAGRAM_EXAMPLES as any)[this.currentDiagramType()];
    this.currentCode.set(example);
  }

  private loadInitialExample() {
    if (!this.currentCode()) {
      const example = (DIAGRAM_EXAMPLES as any)[this.currentDiagramType()];
      this.currentCode.set(example);
    }
  }

  onCodeChange(code: string) {
    this.currentCode.set(code);
  }

  onTypeChange(type: DiagramType) {
    this.currentDiagramType.set(type);
    // Cargar ejemplo para el nuevo tipo
    const example = (DIAGRAM_EXAMPLES as any)[type];
    this.currentCode.set(example);
  }

  generateDiagram() {
    if (!this.currentCode().trim()) return;

    const request: DiagramGenerateRequest = {
      code: this.currentCode(),
      type: this.currentDiagramType(),
    };

    this.diagramService.generateDiagram(request).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.generatedImageUrl.set(response.data.imageUrl);
        }
      },
      error: (error) => {
        console.error('Error generating diagram:', error);
        // TODO: Show error toast
      },
    });
  }

  saveDiagram() {
    this.showSaveModal.set(true);
  }

  confirmSave() {
    if (!this.diagramTitle().trim() || !this.generatedImageUrl()) {
      this.toastService.warning(
        'Datos incompletos',
        'Por favor ingresa un título y genera el diagrama primero'
      );
      return;
    }

    const request: DiagramCreateRequest = {
      title: this.diagramTitle(),
      description: this.diagramDescription(),
      type: this.currentDiagramType(),
      code: this.currentCode(),
    };

    this.diagramService.createDiagram(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSaveModal.set(false);
          this.router.navigate(['/diagrams']);
        }
      },
      error: (error) => {
        console.error('Error saving diagram:', error);
        this.toastService.error(
          'Error al guardar',
          'No se pudo guardar el diagrama. Inténtalo de nuevo.'
        );
      },
    });
  }

  uploadFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (file.size > 1024 * 1024) {
        // 1MB limit
        this.toastService.warning(
          'Archivo muy grande',
          'El archivo no debe exceder 1MB'
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        this.currentCode.set(content);
        this.diagramTitle.set(file.name.replace(/\.[^/.]+$/, ''));
        this.toastService.success(
          'Archivo cargado',
          `Archivo "${file.name}" cargado correctamente`
        );
      };

      reader.onerror = () => {
        this.toastService.error(
          'Error al cargar',
          'No se pudo leer el archivo'
        );
      };

      reader.readAsText(file);
    }
  }

  loadFromGitHub() {
    if (!this.githubUrl().trim()) return;

    this.diagramService.loadFromGitHub(this.githubUrl()).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentCode.set(response.data.code);
          this.diagramTitle.set(response.data.filename);
          this.showGitHubModal.set(false);
          this.githubUrl.set('');
        }
      },
      error: (error) => {
        console.error('Error loading from GitHub:', error);
      },
    });
  }

  exportDiagram(format: 'png' | 'svg' | 'pdf') {
    // TODO: Implement export functionality
    console.log('Export as:', format);
  }

  onImageError() {
    console.error('Error loading generated image');
    this.generatedImageUrl.set('');
  }

  getDiagramTypeName(): string {
    switch (this.currentDiagramType()) {
      case DiagramType.AWS:
        return 'AWS Architecture';
      case DiagramType.ER:
        return 'Entity Relationship';
      case DiagramType.JSON:
        return 'JSON Structure';
      case DiagramType.MERMAID:
        return 'Mermaid';
      case DiagramType.SQL:
        return 'SQL Schema';
      default:
        return 'Diagrama';
    }
  }

  goBack() {
    this.router.navigate(['/diagrams']);
  }

  changeType(type: string) {
    const diagramType = type as DiagramType;
    this.currentDiagramType.set(diagramType);
    // Cargar ejemplo para el nuevo tipo
    const example = (DIAGRAM_EXAMPLES as any)[diagramType];
    if (example) {
      this.currentCode.set(example);
    }
    // Limpiar imagen generada ya que cambió el tipo
    this.generatedImageUrl.set('');
  }

  getTypeButtonClass(type: string): string {
    const isActive = this.currentDiagramType() === type;
    return isActive
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600';
  }
}
