// Book 타입 정의
export interface Book {
    id: number;
    title: string;
    subtitle?: string; // 부제목 추가
    author: string;
    cover: string;
    publishDate?: string; // 출판일 추가
    pages?: number; // 페이지수
    description?: string; // 설명
  }

// 가상 데이터 정의
export const booksData = {
  bestBooks: [
    {
      id: 1,
      title: "The Great Gatsby",
      subtitle: "트럼프의 과거를 넘어서는 본질 탐구",
      author: "F. Scott Fitzgerald",
      cover: "/Thumbnail/A_Visit_to_the_Zoo.png",
      publishDate: "1925-04-10",
      pages: 218,
      description: "This is a story of the Jazz Age in the 1920s...",
    },
    {
      id: 2,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      cover: "/Thumbnail/A_Visit_to_the_Zoo.png",
      publishDate: "1925-04-10",
      pages: 218,
      description: "This is a story of the Jazz Age in the 1920s...",
    },
    {
      id: 3,
      title: "Educated",
      author: "Tara Westover",
      cover: "/Thumbnail/A_Visit_to_the_Zoo.png",
      publishDate: "1925-04-10",
      pages: 218,
      description: "This is a story of the Jazz Age in the 1920s...",
    },
    {
      id: 4,
      title: "Becoming",
      author: "Michelle Obama",
      cover: "/Thumbnail/A_Visit_to_the_Zoo.png",
      publishDate: "1925-04-10",
      pages: 218,
      description: "This is a story of the Jazz Age in the 1920s...",
    },
  ],
  newBooks: [
    {
      id: 5,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "/Thumbnail/A_Visit_to_the_Zoo.png",
      publishDate: "1925-04-10",
      pages: 218,
      description: "This is a story of the Jazz Age in the 1920s...",
    },
    {
      id: 6,
      title: "The Alchemist",
      author: "Paulo Coelho",
      cover: "/Thumbnail/A_Visit_to_the_Zoo.png",
      publishDate: "1925-04-10",
      pages: 218,
      description: "This is a story of the Jazz Age in the 1920s...",
    },
    {
      id: 7,
      title: "Invisible Man",
      author: "Ralph Ellison",
      cover: "/Thumbnail/A_Visit_to_the_Zoo.png",
      publishDate: "1925-04-10",
      pages: 218,
      description: "This is a story of the Jazz Age in the 1920s...",
    },
    {
      id: 8,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "/Thumbnail/A_Visit_to_the_Zoo.png",
      publishDate: "1925-04-10",
      pages: 218,
      description: "This is a story of the Jazz Age in the 1920s...",
    },
  ],
  kidsBooks: [
    {
      id: 9,
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      cover: "/Thumbnail/A_Visit_to_the_Zoo.png",
      publishDate: "1925-04-10",
      pages: 218,
      description: "This is a story of the Jazz Age in the 1920s...",
    },
    {
      id: 10,
      title: "The Very Hungry Caterpillar",
      author: "Eric Carle",
      cover: "/Thumbnail/A_Visit_to_the_Zoo.png",
      publishDate: "1925-04-10",
      pages: 218,
      description: "This is a story of the Jazz Age in the 1920s...",
    },
    {
      id: 11,
      title: "Charlotte's Web",
      author: "E.B. White",
      cover: "/Thumbnail/A_Visit_to_the_Zoo.png",
      publishDate: "1925-04-10",
      pages: 218,
      description: "This is a story of the Jazz Age in the 1920s...",
    },
    {
      id: 12,
      title: "Where the Wild Things Are",
      author: "Maurice Sendak",
      cover: "/Thumbnail/A_Visit_to_the_Zoo.png",
      publishDate: "1925-04-10",
      pages: 218,
      description: "This is a story of the Jazz Age in the 1920s...",
    },
  ],
};

// Promise 기반 fetch 함수 (전체 책 데이터)
export const fetchBooks = async (): Promise<typeof booksData> => {
  // 네트워크 지연 흉내내기
  await new Promise((resolve) => setTimeout(resolve, 500));
  return booksData;
};

// 특정 책 ID로 책 데이터를 반환하는 함수
export const fetchBookById = async (id: number): Promise<Book | undefined> => {
  // 네트워크 지연 흉내내기
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 모든 책을 하나의 배열로 합치기
  const allBooks = [
    ...booksData.bestBooks,
    ...booksData.newBooks,
    ...booksData.kidsBooks,
  ];

  // ID에 해당하는 책 찾기
  return allBooks.find((book) => book.id === id);
};
