export default function MyLibraryPage() {
    const myBooks = [
      { id: 1, title: "1984", author: "George Orwell" },
      { id: 2, title: "Sapiens", author: "Yuval Noah Harari" },
    ];
  
    return (
      <main style={{ padding: "20px" }}>
        <h1>내 서재</h1>
        <ul>
          {myBooks.map((book) => (
            <li key={book.id}>
              {book.title} by {book.author}
            </li>
          ))}
        </ul>
      </main>
    );
  }
  