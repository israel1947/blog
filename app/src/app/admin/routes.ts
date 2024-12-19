import { Routes } from '@angular/router';

export const routes: Routes = [
 {
  path:'create',
  loadComponent: ()=>import('./create-post/create-post.component').then(c=>c.CreatePostComponent)
 },
 {
  path:'dashboard',
  loadComponent: ()=>import('./dashboard/dashboard.component').then(c=>c.DashboardComponent)
 }
];