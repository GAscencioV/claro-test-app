import { Routes } from '@angular/router';

export const AUTHORS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/author-list/author-list').then(m => m.AuthorList)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/author-form/author-form').then(m => m.AuthorForm)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/author-form/author-form').then(m => m.AuthorForm)
  }
];
