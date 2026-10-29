import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book'; // Ajusta la ruta a tu book.service si varía
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss'
})
export class BookList implements OnInit {
  private readonly bookService = inject(BookService);

  books = signal<Book[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.bookService.getAll().subscribe({
      next: (data) => {
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Error al cargar la lista de libros.');
        this.isLoading.set(false);
      }
    });
  }

  onDelete(id: number): void {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar este libro?');
    if (!confirmed) return;

    this.bookService.delete(id).subscribe({
      next: () => {
        this.books.update((list) => list.filter((b) => b.id !== id));
      },
      error: (err) => {
        console.error(err);
        alert('Ocurrió un error al intentar eliminar el libro.');
      }
    });
  }
}
