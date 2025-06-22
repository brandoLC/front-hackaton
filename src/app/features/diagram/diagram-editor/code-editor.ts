import {
  Component,
  signal,
  inject,
  viewChild,
  ElementRef,
  effect,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorView } from '@codemirror/view';
import { EditorState, StateEffect, Compartment } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { python } from '@codemirror/lang-python';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { DiagramType } from '../../../shared/models/diagram.model';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
      >
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ getLanguageName() }}
          </span>
        </div>

        <div class="flex items-center space-x-2">
          <!-- Language Selector -->
          <select
            [value]="diagramType()"
            (change)="onTypeChange($event)"
            class="text-xs bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="aws">AWS Architecture</option>
            <option value="er">Entity Relationship</option>
            <option value="json">JSON Structure</option>
            <option value="mermaid">Mermaid</option>
            <option value="sql">SQL (D2)</option>
          </select>

          <!-- Actions -->
          <button
            (click)="formatCode()"
            class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Format Code"
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
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>

          <button
            (click)="clearCode()"
            class="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Clear Code"
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

      <!-- Editor Container -->
      <div class="flex-1 relative">
        <div #editorContainer class="h-full w-full"></div>

        <!-- Loading Overlay -->
        @if (isLoading()) {
        <div
          class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center"
        >
          <div class="text-center">
            <div
              class="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"
            ></div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ loadingMessage() }}
            </p>
          </div>
        </div>
        }
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400"
      >
        <div class="flex items-center space-x-4">
          <span>Lines: {{ lineCount() }}</span>
          <span>Characters: {{ charCount() }}</span>
        </div>
        <div class="flex items-center space-x-2">
          @if (hasErrors()) {
          <span class="text-red-500 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            Errors
          </span>
          }
          <span>Ready</span>
        </div>
      </div>
    </div>
  `,
})
export class CodeEditorComponent {
  private editorContainer = viewChild.required<ElementRef>('editorContainer');
  private editorView: EditorView | null = null;
  private languageCompartment = new Compartment();

  // Inputs
  code = input<string>('');
  diagramType = input<DiagramType>(DiagramType.AWS);
  isLoading = input<boolean>(false);
  loadingMessage = input<string>('Loading...');
  hasErrors = input<boolean>(false);

  // Outputs
  codeChange = output<string>();
  typeChange = output<DiagramType>();

  // Signals
  lineCount = signal(1);
  charCount = signal(0);

  constructor() {
    // Effect para inicializar el editor cuando el container esté listo
    effect(() => {
      const container = this.editorContainer();
      if (container && !this.editorView) {
        this.initializeEditor();
      }
    });

    // Effect para actualizar el código cuando cambie el input
    effect(() => {
      const newCode = this.code();
      if (this.editorView && newCode !== this.getCurrentCode()) {
        this.editorView.dispatch({
          changes: {
            from: 0,
            to: this.editorView.state.doc.length,
            insert: newCode,
          },
        });
      }
    });
  }

  private initializeEditor() {
    const isDark = document.documentElement.classList.contains('dark');

    const extensions = [
      basicSetup,
      this.languageCompartment.of(this.getLanguageExtension()),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const code = update.state.doc.toString();
          this.codeChange.emit(code);
          this.updateStats(code);
        }
      }),
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: '14px',
        },
        '.cm-content': {
          padding: '16px',
          minHeight: '100%',
        },
        '.cm-focused': {
          outline: 'none',
        },
      }),
    ];

    if (isDark) {
      extensions.push(oneDark);
    }

    const state = EditorState.create({
      doc: this.code(),
      extensions,
    });

    this.editorView = new EditorView({
      state,
      parent: this.editorContainer().nativeElement,
    });

    this.updateStats(this.code());
  }

  private getLanguageExtension() {
    switch (this.diagramType()) {
      case DiagramType.AWS:
      case DiagramType.ER:
      case DiagramType.SQL:
        return python();
      case DiagramType.JSON:
        return json();
      default:
        return python();
    }
  }

  private getCurrentCode(): string {
    return this.editorView?.state.doc.toString() || '';
  }

  private updateStats(code: string) {
    this.lineCount.set(code.split('\n').length);
    this.charCount.set(code.length);
  }

  getLanguageName(): string {
    switch (this.diagramType()) {
      case DiagramType.AWS:
        return 'Python (AWS Diagrams)';
      case DiagramType.ER:
        return 'Python (ER Diagrams)';
      case DiagramType.JSON:
        return 'JSON';
      case DiagramType.MERMAID:
        return 'Mermaid';
      case DiagramType.SQL:
        return 'D2 (SQL Diagrams)';
      default:
        return 'Code';
    }
  }

  onTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newType = target.value as DiagramType;
    this.typeChange.emit(newType);

    // Actualizar extensión del lenguaje
    if (this.editorView) {
      this.editorView.dispatch({
        effects: this.languageCompartment.reconfigure(
          this.getLanguageExtension()
        ),
      });
    }
  }

  formatCode() {
    // TODO: Implementar formateo específico por tipo de diagrama
    console.log('Format code');
  }

  clearCode() {
    if (this.editorView) {
      this.editorView.dispatch({
        changes: {
          from: 0,
          to: this.editorView.state.doc.length,
          insert: '',
        },
      });
    }
  }

  insertText(text: string) {
    if (this.editorView) {
      const selection = this.editorView.state.selection.main;
      this.editorView.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: text,
        },
      });
    }
  }

  ngOnDestroy() {
    if (this.editorView) {
      this.editorView.destroy();
    }
  }
}
