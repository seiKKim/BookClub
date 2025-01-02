import React from "react";

type Props = {
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ total, currentPage, onPageChange }: Props) {
  const totalPages = Math.ceil(total / 10);

  return (
    <div>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            fontWeight: currentPage === page ? "bold" : "normal",
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
