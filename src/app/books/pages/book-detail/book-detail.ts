import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BookService } from '../../services/book';
import { AuthorService } from '../../../authors/services/author';
import { Book } from '../../../models/book.model';
import { Author } from '../../../models/author.model';

@Component({
  selector: 'app-book-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss'
})
export class BookDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);
  private readonly authorService = inject(AuthorService);

  book = signal<Book | null>(null);
  author = signal<Author | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const bookId = Number(idParam);

    if (isNaN(bookId)) {
      this.errorMessage.set('Identificador de libro inválido.');
      this.isLoading.set(false);
      return;
    }

    this.loadData(bookId);
  }

  private loadData(bookId: number): void {
    this.isLoading.set(true);

    this.bookService.getById(bookId).subscribe({
      next: (bookData) => {
        this.book.set(bookData);

        // Obtenemos los autores para encontrar el que está vinculado a este libro
        this.authorService.getAll().subscribe({
          next: (authors) => {
            const relatedAuthor = authors.find(a => a.idBook === bookId) || null;
            this.author.set(relatedAuthor);
            this.isLoading.set(false);
          },
          error: () => {
            // Si falla la carga del autor, aún permitimos ver los datos del libro
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('No se pudo cargar la información del libro.');
        this.isLoading.set(false);
      }
    });
  }
}
