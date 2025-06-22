import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'diagrams',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/diagram/diagram-list/diagram-list').then(
            (m) => m.DiagramListComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/diagram/diagram-editor/diagram-editor').then(
            (m) => m.DiagramEditorComponent
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./features/diagram/diagram-editor/diagram-editor').then(
            (m) => m.DiagramEditorComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
