import { Routes } from '@angular/router';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/book-list/book-list').then(m => m.BookList)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/book-form/book-form').then(m => m.BookForm)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/book-detail/book-detail').then(m => m.BookDetail)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/book-form/book-form').then(m => m.BookForm)
  }
];
