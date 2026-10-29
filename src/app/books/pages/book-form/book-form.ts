import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../services/book';
import { CreateBook, UpdateBook } from '../../../models/book.model';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './book-form.html',
  styleUrl: './book-form.scss'
})
export class BookForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookService = inject(BookService);

  form!: FormGroup;
  isEditMode = signal<boolean>(false);
  bookId = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
    this.checkRouteMode();
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.required]],
      pageCount: [0, [Validators.required, Validators.min(1)]],
      excerpt: [''],
      publishDate: [new Date().toISOString().substring(0, 10), [Validators.required]]
    });
  }

  private checkRouteMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.isEditMode.set(true);
        this.bookId.set(id);
        this.loadBook(id);
      }
    }
  }

  private loadBook(id: number): void {
    this.isLoading.set(true);
    this.bookService.getById(id).subscribe({
      next: (book) => {
        this.form.patchValue({
          title: book.title,
          description: book.description,
          pageCount: book.pageCount,
          excerpt: book.excerpt,
          publishDate: book.publishDate ? book.publishDate.substring(0, 10) : ''
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('No se pudo cargar la información del libro.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.form.value;

    const payload: CreateBook | UpdateBook = {
      title: formValue.title,
      description: formValue.description,
      pageCount: Number(formValue.pageCount),
      excerpt: formValue.excerpt || '',
      publishDate: new Date(formValue.publishDate).toISOString()
    };

    if (this.isEditMode()) {
      const id = this.bookId()!;
      this.bookService.update(id, payload).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Error al actualizar el libro.');
          this.isLoading.set(false);
        }
      });
    } else {
      this.bookService.create(payload).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Error al registrar el nuevo libro.');
          this.isLoading.set(false);
        }
      });
    }
  }
}
