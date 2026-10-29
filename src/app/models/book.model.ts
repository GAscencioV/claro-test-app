export interface Book {
  id: number;
  title: string;
  description: string;
  pageCount: number;
  excerpt: string;
  publishDate: string;
}

export type CreateBook = Omit<Book, 'id'>;
export type UpdateBook = Omit<Book, 'id'>;
