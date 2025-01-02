// types/BookNew.ts
export type BookData = {
    title: string;
    subTitle: string;
    author: string;
    publisher: string;
    publicationDate: string;
    isbn: string;
    categories: string[];
    description: string;
    thumbnail: File | null;
    pdf: File | null;
  };
  