import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Diagram,
  DiagramCreateRequest,
  DiagramGenerateRequest,
  DiagramGenerateResponse,
  ExportOptions,
  DiagramType,
} from '../../shared/models/diagram.model';
import {
  ApiResponse,
  PaginatedResponse,
} from '../../shared/models/api-response.model';
import { ToastService } from '../../shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class DiagramService {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  private readonly API_URL = 'https://your-api-gateway-url.amazonaws.com/dev';

  // Signals para estado reactivo
  diagrams = signal<Diagram[]>([]);
  currentDiagram = signal<Diagram | null>(null);
  isGenerating = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  // Obtener todos los diagramas del usuario
  getDiagrams(page = 1, limit = 10): Observable<PaginatedResponse<Diagram>> {
    this.isLoading.set(true);

    return this.http
      .get<PaginatedResponse<Diagram>>(
        `${this.API_URL}/diagrams?page=${page}&limit=${limit}`
      )
      .pipe(
        tap((response) => {
          this.isLoading.set(false);
          if (response.success && response.data) {
            this.diagrams.set(response.data);
          }
        })
      );
  }

  // Obtener un diagrama específico
  getDiagram(id: string): Observable<ApiResponse<Diagram>> {
    return this.http
      .get<ApiResponse<Diagram>>(`${this.API_URL}/diagrams/${id}`)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.currentDiagram.set(response.data);
          }
        })
      );
  }

  // Generar diagrama a partir del código
  generateDiagram(
    request: DiagramGenerateRequest
  ): Observable<ApiResponse<DiagramGenerateResponse>> {
    this.isGenerating.set(true);

    return this.http
      .post<ApiResponse<DiagramGenerateResponse>>(
        `${this.API_URL}/diagrams/generate`,
        request
      )
      .pipe(tap(() => this.isGenerating.set(false)));
  }

  // Crear y guardar diagrama
  createDiagram(
    request: DiagramCreateRequest
  ): Observable<ApiResponse<Diagram>> {
    this.isLoading.set(true);

    return this.http
      .post<ApiResponse<Diagram>>(`${this.API_URL}/diagrams`, request)
      .pipe(
        tap((response) => {
          this.isLoading.set(false);
          if (response.success && response.data) {
            // Actualizar la lista de diagramas
            const current = this.diagrams();
            this.diagrams.set([response.data, ...current]);
            this.toastService.success(
              'Diagrama creado',
              'El diagrama se ha guardado exitosamente'
            );
          } else {
            this.toastService.error(
              'Error al crear',
              'No se pudo crear el diagrama'
            );
          }
        })
      );
  }

  // Actualizar diagrama
  updateDiagram(
    id: string,
    request: Partial<DiagramCreateRequest>
  ): Observable<ApiResponse<Diagram>> {
    return this.http
      .put<ApiResponse<Diagram>>(`${this.API_URL}/diagrams/${id}`, request)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            // Actualizar en la lista
            const current = this.diagrams();
            const index = current.findIndex((d) => d.id === id);
            if (index !== -1) {
              current[index] = response.data;
              this.diagrams.set([...current]);
            }
            this.currentDiagram.set(response.data);
            this.toastService.success(
              'Diagrama actualizado',
              'Los cambios se han guardado correctamente'
            );
          } else {
            this.toastService.error(
              'Error al actualizar',
              'No se pudieron guardar los cambios'
            );
          }
        })
      );
  }

  // Eliminar diagrama
  deleteDiagram(id: string): Observable<ApiResponse<void>> {
    return this.http
      .delete<ApiResponse<void>>(`${this.API_URL}/diagrams/${id}`)
      .pipe(
        tap((response) => {
          if (response.success) {
            // Remover de la lista
            const current = this.diagrams();
            this.diagrams.set(current.filter((d) => d.id !== id));

            // Limpiar current si es el mismo
            if (this.currentDiagram()?.id === id) {
              this.currentDiagram.set(null);
            }
            this.toastService.success(
              'Diagrama eliminado',
              'El diagrama se ha eliminado correctamente'
            );
          } else {
            this.toastService.error(
              'Error al eliminar',
              'No se pudo eliminar el diagrama'
            );
          }
        })
      );
  }

  // Exportar diagrama
  exportDiagram(id: string, options: ExportOptions): Observable<Blob> {
    return this.http.post(`${this.API_URL}/diagrams/${id}/export`, options, {
      responseType: 'blob',
    });
  }

  // Validar código de diagrama
  validateCode(
    code: string,
    type: DiagramType
  ): Observable<ApiResponse<{ valid: boolean; errors?: string[] }>> {
    return this.http.post<ApiResponse<{ valid: boolean; errors?: string[] }>>(
      `${this.API_URL}/diagrams/validate`,
      {
        code,
        type,
      }
    );
  }

  // Cargar código desde GitHub URL
  loadFromGitHub(
    url: string
  ): Observable<ApiResponse<{ code: string; filename: string }>> {
    return this.http.post<ApiResponse<{ code: string; filename: string }>>(
      `${this.API_URL}/diagrams/load-from-github`,
      {
        url,
      }
    );
  }

  // Método para datos demo (desarrollo)
  loadDemoData(): void {
    const demoDiagrams: Diagram[] = [
      {
        id: 'demo-1',
        title: 'Arquitectura Web AWS',
        description: 'Diagrama de arquitectura web escalable en AWS',
        type: DiagramType.AWS,
        code: '# Demo AWS Architecture',
        imageUrl:
          'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=AWS+Diagram',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
        userId: 'demo-user-123',
      },
      {
        id: 'demo-2',
        title: 'Base de Datos E-Commerce',
        description:
          'Esquema de base de datos para plataforma de comercio electrónico',
        type: DiagramType.ER,
        code: '# Demo ER Diagram',
        imageUrl:
          'https://via.placeholder.com/400x300/10B981/FFFFFF?text=ER+Diagram',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
        userId: 'demo-user-123',
      },
      {
        id: 'demo-3',
        title: 'API Configuration',
        description: 'Estructura JSON de configuración de microservicios',
        type: DiagramType.JSON,
        code: '{}',
        imageUrl:
          'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=JSON+Structure',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 días atrás
        userId: 'demo-user-123',
      },
      {
        id: 'demo-4',
        title: 'Flujo de Autenticación',
        description:
          'Diagrama de flujo del proceso de autenticación de usuarios',
        type: DiagramType.MERMAID,
        code: 'graph TD\n  A[Start] --> B[Login]',
        imageUrl:
          'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Mermaid+Flow',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 días atrás
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 días atrás
        userId: 'demo-user-123',
      },
    ];

    this.diagrams.set(demoDiagrams);
  }
}
