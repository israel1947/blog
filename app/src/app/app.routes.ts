import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./pages/post/post.component').then(m => m.PostComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/routes').then(r => r.routes)
  }
];
