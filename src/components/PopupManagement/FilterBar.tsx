"use client"

import React, { useState } from "react";

import styles from "./PopupManagement.module.css";

type Props = {
  onSearch: (filters: any) => void;
};

export default function FilterBar({ onSearch }: Props) {
  const [filters, setFilters] = useState({
    userType: "",
    startDate: "",
    endDate: "",
    condition: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchClick = () => {
    onSearch(filters);
  };

  return (
    <div className={styles.filterBar}>
      <label>
        사용자 분류
        <select name="userType" onChange={handleInputChange}>
          <option value="">선택</option>
          <option value="user">사용자</option>
          <option value="admin">관리자</option>
        </select>
      </label>

      <label>
        기간
        <input type="date" name="startDate" onChange={handleInputChange} />
        ~
        <input type="date" name="endDate" onChange={handleInputChange} />
      </label>

      <label>
        조건
        <select name="condition" onChange={handleInputChange}>
          <option value="">조절 조건</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
      </label>

      <button onClick={handleSearchClick}>검색</button>
    </div>
  );
}
