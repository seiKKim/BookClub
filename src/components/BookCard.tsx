import Link from 'next/link';
import styles from './BookCard.module.css';

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  cover: string;
}

const BookCard: React.FC<BookCardProps> = ({ id, title, author, cover }) => {
  return (
    <Link href={`/book/${id}`}>
      <div className={styles.bookCard}>
        <img src={cover} alt={`${title} Cover`} />
        <h3>{title}</h3>
        <p>{author}</p>
      </div>
    </Link>
  );
};

export default BookCard;
