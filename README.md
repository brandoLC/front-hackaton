# 🚀 UTEC Diagramas - Frontend

Una aplicación web moderna para crear y gestionar diagramas técnicos con soporte para múltiples tipos de sintaxis.

![Angular](https://img.shields.io/badge/Angular-18.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-cyan)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green)

## ✨ Características

### 🎨 **Tipos de Diagramas Soportados**
- **AWS Architecture**: Diagramas de arquitectura en AWS
- **Entity Relationship**: Diagramas de base de datos ER
- **JSON Structure**: Visualización de estructuras JSON
- **Mermaid**: Diagramas con sintaxis Mermaid
- **SQL (D2)**: Esquemas de base de datos con sintaxis D2

### 🔧 **Funcionalidades**
- ✅ **Editor de código** con syntax highlighting
- ✅ **Vista previa en tiempo real** de diagramas
- ✅ **Dashboard** con estadísticas y gestión
- ✅ **Sistema de autenticación** JWT
- ✅ **Lista de diagramas** con filtros y búsqueda
- ✅ **Tema oscuro/claro** automático
- ✅ **Notificaciones toast** mejoradas
- ✅ **Diseño responsive** para móviles
- ✅ **Carga de archivos** desde local o GitHub
- ✅ **Exportación** PNG, SVG, PDF

## 🚀 **Inicio Rápido**

### **Instalación**

```bash
# Clonar el repositorio
git clone https://github.com/brandoLC/front-hackaton.git
cd front-hackaton

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# La app estará disponible en http://localhost:4200
```

## 🔌 **Integración con API**

```typescript
// URL Base de la API
API_URL = 'https://36sde0kxka.execute-api.us-east-1.amazonaws.com/dev'

// Endpoints
POST /auth/login     # Autenticación
POST /auth/signup    # Registro de usuario
```

## 🛠️ **Tecnologías**

- **Angular 18** - Framework principal
- **TypeScript** - Lenguaje de programación
- **TailwindCSS** - Framework de CSS
- **CodeMirror** - Editor de código

---

⭐ **¡Dale una estrella si te gusta el proyecto!**

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
