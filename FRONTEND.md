# UTEC Diagrams - Frontend

Frontend moderno para la plataforma UTEC Diagrams, construido con Angular 20, Tailwind CSS v4 y CodeMirror 6.

## 🚀 Características

- **Angular 20** con señales (zoneless) para máximo rendimiento
- **Tailwind CSS v4** para diseño moderno y responsive
- **CodeMirror 6** como editor de código ligero y elegante
- **Diseño Dark/Light Mode** automático
- **Arquitectura modular** con lazy loading
- **Autenticación JWT** con interceptores
- **TypeScript strict mode** para mayor seguridad

## 🛠️ Tecnologías

- **Framework**: Angular 20
- **Styling**: Tailwind CSS v4
- **Editor**: CodeMirror 6
- **HTTP Client**: Angular HttpClient con interceptores
- **Routing**: Angular Router con guards
- **State Management**: Angular Signals
- **Build Tool**: Angular CLI + Vite

## 📋 Tipos de Diagramas Soportados

1. **AWS Architecture** - Diagramas de arquitectura de AWS usando Python
2. **Entity Relationship** - Diagramas ER para bases de datos
3. **JSON Structure** - Visualización de estructuras JSON
4. **Mermaid** - Diagramas versátiles con sintaxis Mermaid

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── core/                     # Servicios core y guards
│   │   ├── services/            # AuthService, DiagramService
│   │   ├── guards/              # AuthGuard
│   │   └── interceptors/        # AuthInterceptor
│   ├── shared/                  # Componentes y modelos compartidos
│   │   ├── components/          # Header, Loading, etc.
│   │   ├── models/              # Interfaces TypeScript
│   │   └── constants/           # Ejemplos de código
│   ├── features/                # Módulos de funcionalidades
│   │   ├── auth/               # Login/Register
│   │   ├── dashboard/          # Dashboard principal
│   │   └── diagram/            # Editor y lista de diagramas
│   └── layouts/                # Layouts de la aplicación
```

## ⚙️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o bun

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repo-url>
   cd utec-diagramas
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   bun install
   ```

3. **Configurar variables de entorno**

   Edita el archivo `src/app/core/services/auth.service.ts` y actualiza la URL de la API:

   ```typescript
   private readonly API_URL = 'https://your-api-gateway-url.amazonaws.com/dev';
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm start
   # o
   bun start
   ```

### Compilación para Producción

```bash
npm run build
# o
bun run build
```

Los archivos compilados estarán en `dist/` listos para ser desplegados en S3.

## 🎨 Características de UI/UX

### Diseño

- **Minimalista y tecnológico** con gradientes sutiles
- **Responsive design** que funciona en todos los dispositivos
- **Dark/Light mode** automático según preferencias del sistema
- **Animaciones suaves** con Tailwind CSS
- **Iconografía consistente** con Heroicons

### Editor de Código

- **CodeMirror 6** - Editor ligero y potente
- **Syntax highlighting** por tipo de diagrama
- **Autocompletado** y validación en tiempo real
- **Shortcuts de teclado** para productividad
- **Vista previa en tiempo real**

### Componentes Principales

1. **AuthComponent** - Login/Register con validación
2. **DashboardComponent** - Vista principal con estadísticas
3. **DiagramEditorComponent** - Editor principal de diagramas
4. **DiagramListComponent** - Lista y gestión de diagramas
5. **HeaderComponent** - Navegación y perfil de usuario

## 🔐 Autenticación

El sistema utiliza JWT tokens con las siguientes características:

- **Multi-tenancy** - Soporte para múltiples usuarios
- **Token refresh** automático
- **Guards de ruta** para proteger páginas
- **Interceptores HTTP** para agregar tokens automáticamente
- **Logout automático** al expirar tokens

## 📱 Características Avanzadas

### Gestión de Estado

- **Angular Signals** para estado reactivo
- **Computed signals** para datos derivados
- **Effect hooks** para efectos secundarios

### Carga de Archivos

- **Drag & drop** para archivos de código
- **Carga desde GitHub** usando URLs públicas
- **Validación de formato** antes de procesar

### Exportación

- **PNG, SVG, PDF** - Múltiples formatos de exportación
- **Calidad configurable** para imágenes
- **Descarga directa** desde el navegador

## 🚀 Despliegue en AWS S3

### Configuración de S3

1. **Crear bucket S3**

   ```bash
   aws s3 mb s3://utec-diagrams-frontend
   ```

2. **Configurar para hosting estático**

   ```bash
   aws s3 website s3://utec-diagrams-frontend --index-document index.html --error-document index.html
   ```

3. **Subir archivos**

   ```bash
   aws s3 sync dist/ s3://utec-diagrams-frontend --delete
   ```

4. **Configurar CloudFront** (recomendado)
   - Crear distribución de CloudFront
   - Configurar dominio personalizado
   - Habilitar HTTPS

## 🔧 Configuración de API

### URLs de Endpoints

El frontend espera los siguientes endpoints de la API:

```typescript
// Autenticación
POST /auth/login
POST /auth/register
POST /auth/refresh

// Diagramas
GET /diagrams
POST /diagrams
PUT /diagrams/:id
DELETE /diagrams/:id
POST /diagrams/generate
POST /diagrams/validate
POST /diagrams/:id/export
POST /diagrams/load-from-github
```

### Formato de Respuestas

```typescript
// Respuesta estándar
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Respuesta paginada
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 👥 Equipo

- **Frontend Developer** - Desarrollo de la interfaz y UX
- **Backend Team** - APIs y infraestructura AWS
- **DevOps Team** - Despliegue y configuración

---

**UTEC Diagrams** - Convierte código en diagramas hermosos ✨
