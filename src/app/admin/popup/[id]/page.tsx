// /pages/admin/popup/[id].tsx

import React, { useEffect, useState } from "react";

import { Popup } from "@/types/popup"; // Popup 타입 가져오기
import styles from "@/components/PopupManagement/PopupManagement.module.css";
import { useRouter } from "next/router";

const EditPopupPage = () => {
  const router = useRouter();
  const { id } = router.query; // URL에서 ID 가져오기
  const [popup, setPopup] = useState<Popup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPopup = async () => {
        if (id) {
          try {
            const response = await fetch(`/api/popups/${id}`);
            if (!response.ok) throw new Error("팝업을 가져오는 데 실패했습니다.");
            const data = await response.json();
            setPopup(data);
          } catch (err: unknown) { // err의 타입을 unknown으로 지정
            if (err instanceof Error) { // Error 인스턴스인지 확인
              setError(err.message); // 에러 메시지 설정
            } else {
              setError("알 수 없는 오류가 발생했습니다."); // 기본 에러 메시지
            }
          } finally {
            setLoading(false);
          }
        }
      };

    fetchPopup();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (popup) {
      setPopup({ ...popup, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (popup) {
      try {
        const response = await fetch(`/api/popups/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(popup),
        });
        if (!response.ok) throw new Error("수정에 실패했습니다.");
        router.push("/admin/popup"); // 수정 후 목록 페이지로 이동
    } catch (err: unknown) { // err의 타입을 unknown으로 지정
        if (err instanceof Error) { // Error 인스턴스인지 확인
          setError(err.message); // 에러 메시지 설정
        } else {
          setError("알 수 없는 오류가 발생했습니다."); // 기본 에러 메시지
        }
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!popup) return <div>팝업을 찾을 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>팝업 수정</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목:</label>
          <input
            type="text"
            name="title"
            value={popup.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>시작일:</label>
          <input
            type="date"
            name="startDate"
            value={popup.startDate.split("T")[0]} // 날짜 형식 맞추기
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>종료일:</label>
          <input
            type="date"
            name="endDate"
            value={popup.endDate.split("T")[0]} // 날짜 형식 맞추기
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>사용 여부:</label>
          <select
            name="isVisible"
            value={popup.isVisible ? "true" : "false"}
            onChange={handleChange}
          >
            <option value="true">활성화</option>
            <option value="false">비활성화</option>
          </select>
        </div>
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

export default EditPopupPage;
