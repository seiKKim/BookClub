// Book 타입 정의
export interface Book {
  bookId: number;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  format: string;
  genre: string;
  contentUrl: string;
  categories: { name: string }[]; // 카테고리 추가
  createdAt: string;
}
