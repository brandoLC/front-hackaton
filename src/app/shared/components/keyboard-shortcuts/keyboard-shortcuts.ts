import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

interface Shortcut {
  keys: string[];
  description: string;
  action: () => void;
}

@Component({
  selector: 'app-keyboard-shortcuts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Botón de ayuda flotante -->
    <button
      (click)="toggleHelp()"
      class="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
      title="Atajos de teclado (?)"
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
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </button>

    <!-- Modal de ayuda -->
    @if (showHelp()) {
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      (click)="closeHelp()"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        (click)="$event.stopPropagation()"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Atajos de Teclado
            </h3>
            <button
              (click)="closeHelp()"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div class="space-y-3">
            @for (shortcut of shortcuts; track shortcut.description) {
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {{ shortcut.description }}
              </span>
              <div class="flex gap-1">
                @for (key of shortcut.keys; track key) {
                <kbd
                  class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                >
                  {{ key }}
                </kbd>
                }
              </div>
            </div>
            }
          </div>

          <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              <strong>Tip:</strong> Presiona
              <kbd
                class="px-1 py-0.5 text-xs bg-blue-200 dark:bg-blue-700 rounded"
                >?</kbd
              >
              en cualquier momento para ver esta ayuda.
            </p>
          </div>
        </div>
      </div>
    </div>
    }
  `,
})
export class KeyboardShortcutsComponent implements OnInit, OnDestroy {
  private toastService = inject(ToastService);

  showHelp = signal(false);

  shortcuts: Shortcut[] = [
    {
      keys: ['Ctrl', 'S'],
      description: 'Guardar diagrama',
      action: () => this.handleSave(),
    },
    {
      keys: ['Ctrl', 'N'],
      description: 'Nuevo diagrama',
      action: () => this.handleNew(),
    },
    {
      keys: ['Ctrl', 'E'],
      description: 'Exportar diagrama',
      action: () => this.handleExport(),
    },
    {
      keys: ['Ctrl', 'Z'],
      description: 'Deshacer',
      action: () => this.handleUndo(),
    },
    {
      keys: ['Ctrl', 'Y'],
      description: 'Rehacer',
      action: () => this.handleRedo(),
    },
    {
      keys: ['F11'],
      description: 'Pantalla completa',
      action: () => this.handleFullscreen(),
    },
    {
      keys: ['?'],
      description: 'Mostrar atajos',
      action: () => this.toggleHelp(),
    },
    {
      keys: ['Esc'],
      description: 'Cerrar modales',
      action: () => this.handleEscape(),
    },
  ];

  ngOnInit() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    // Ignorar si estamos en un input/textarea
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    // Manejar atajos específicos
    if (
      event.key === '?' &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      this.toggleHelp();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.handleEscape();
      return;
    }

    // Atajos con Ctrl
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 's':
          event.preventDefault();
          this.handleSave();
          break;
        case 'n':
          event.preventDefault();
          this.handleNew();
          break;
        case 'e':
          event.preventDefault();
          this.handleExport();
          break;
        case 'z':
          if (!event.shiftKey) {
            event.preventDefault();
            this.handleUndo();
          }
          break;
        case 'y':
          event.preventDefault();
          this.handleRedo();
          break;
      }
    }

    // Teclas especiales
    if (event.key === 'F11') {
      event.preventDefault();
      this.handleFullscreen();
    }
  }

  toggleHelp() {
    this.showHelp.update((show) => !show);
  }

  closeHelp() {
    this.showHelp.set(false);
  }

  private handleSave() {
    // Emitir evento personalizado para que otros componentes lo escuchen
    window.dispatchEvent(new CustomEvent('keyboard-save'));
    this.toastService.info('Atajo', 'Ctrl+S presionado - Guardando...');
  }

  private handleNew() {
    window.dispatchEvent(new CustomEvent('keyboard-new'));
    this.toastService.info('Atajo', 'Ctrl+N presionado - Nuevo diagrama');
  }

  private handleExport() {
    window.dispatchEvent(new CustomEvent('keyboard-export'));
    this.toastService.info('Atajo', 'Ctrl+E presionado - Exportando...');
  }

  private handleUndo() {
    window.dispatchEvent(new CustomEvent('keyboard-undo'));
    this.toastService.info('Atajo', 'Ctrl+Z presionado - Deshacer');
  }

  private handleRedo() {
    window.dispatchEvent(new CustomEvent('keyboard-redo'));
    this.toastService.info('Atajo', 'Ctrl+Y presionado - Rehacer');
  }

  private handleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.toastService.info(
        'Pantalla completa',
        'Modo pantalla completa activado'
      );
    } else {
      document.exitFullscreen();
      this.toastService.info(
        'Pantalla completa',
        'Modo pantalla completa desactivado'
      );
    }
  }

  private handleEscape() {
    if (this.showHelp()) {
      this.closeHelp();
    } else {
      window.dispatchEvent(new CustomEvent('keyboard-escape'));
    }
  }
}
