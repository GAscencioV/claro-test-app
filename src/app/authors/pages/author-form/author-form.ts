import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthorService } from '../../services/author';
import { BookService } from '../../../books/services/book';
import { Book } from '../../../models/book.model';
import { CreateAuthor, UpdateAuthor } from '../../../models/author.model';

@Component({
  selector: 'app-author-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './author-form.html',
  styleUrl: './author-form.scss'
})
export class AuthorForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authorService = inject(AuthorService);
  private readonly bookService = inject(BookService);

  form!: FormGroup;
  isEditMode = signal<boolean>(false);
  authorId = signal<number | null>(null);
  books = signal<Book[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
    this.loadAvailableBooks();
    this.checkRouteMode();
  }

  private initForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      idBook: [null, [Validators.required]]
    });
  }

  private loadAvailableBooks(): void {
    this.bookService.getAll().subscribe({
      next: (data) => this.books.set(data),
      error: (err) => console.error('Error al cargar libros para el selector', err)
    });
  }

  private checkRouteMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.isEditMode.set(true);
        this.authorId.set(id);
        this.loadAuthor(id);
      }
    }
  }

  private loadAuthor(id: number): void {
    this.isLoading.set(true);
    this.authorService.getById(id).subscribe({
      next: (author) => {
        this.form.patchValue({
          firstName: author.firstName,
          lastName: author.lastName,
          idBook: author.idBook
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('No se pudo cargar la información del autor.');
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

    const payload: CreateAuthor | UpdateAuthor = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      idBook: Number(formValue.idBook)
    };

    if (this.isEditMode()) {
      const id = this.authorId()!;
      this.authorService.update(id, payload).subscribe({
        next: () => {
          this.router.navigate(['/authors']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Error al actualizar el autor.');
          this.isLoading.set(false);
        }
      });
    } else {
      this.authorService.create(payload).subscribe({
        next: () => {
          this.router.navigate(['/authors']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Error al registrar el nuevo autor.');
          this.isLoading.set(false);
        }
      });
    }
  }
}
