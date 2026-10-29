import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthorService } from '../../services/author';
import { BookService } from '../../../books/services/book';
import { Author } from '../../../models/author.model';
import { Book } from '../../../models/book.model';

export interface AuthorViewModel extends Author {
  publishedBooksCount: number;
}

@Component({
  selector: 'app-author-list',
  imports: [RouterLink],
  templateUrl: './author-list.html',
  styleUrl: './author-list.scss'
})
export class AuthorList implements OnInit {
  private readonly authorService = inject(AuthorService);
  private readonly bookService = inject(BookService);

  authors = signal<AuthorViewModel[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      authors: this.authorService.getAll(),
      books: this.bookService.getAll()
    }).subscribe({
      next: ({ authors, books }) => {
        const enrichedAuthors = authors.map((author) => {
          const count = books.filter((b) => b.id === author.idBook).length;
          return {
            ...author,
            publishedBooksCount: count
          };
        });

        this.authors.set(enrichedAuthors);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Error al cargar la lista de autores.');
        this.isLoading.set(false);
      }
    });
  }

  onDelete(id: number): void {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar este autor?');
    if (!confirmed) return;

    this.authorService.delete(id).subscribe({
      next: () => {
        this.authors.update((list) => list.filter((a) => a.id !== id));
      },
      error: (err) => {
        console.error(err);
        alert('Ocurrió un error al intentar eliminar el autor.');
      }
    });
  }
}
