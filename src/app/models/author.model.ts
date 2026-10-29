export interface Author {
  id: number;
  idBook: number;
  firstName: string;
  lastName: string;
}

export type CreateAuthor = Omit<Author, 'id'>;
export type UpdateAuthor = Omit<Author, 'id'>;
