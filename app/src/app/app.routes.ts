import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'blog',
    pathMatch: 'full'
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./pages/post/post.component').then(m => m.PostComponent)
  },
  {
    path:'favorites',
    loadComponent:()=> import ('./components/favorites/favorites.component').then( m => m.FavoritesComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/routes').then(r => r.routes)
  },
  {
    path:'admin',
    canActivateChild:[adminGuard],
    loadChildren:()=> import('./admin/routes').then(m=>m.routes)
  }
];
