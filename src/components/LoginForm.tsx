import React from "react";
import styles from "../../src/app/auth/login/Login.module.css";

interface LoginFormProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  isLoading,
}) => (
  <form onSubmit={onSubmit}>
    <div className={styles.input}>
      <label htmlFor="email" className={styles.label}>
        이메일
      </label>
      <input
        type="email"
        id="email"
        className={styles.inputField}
        value={email}
        placeholder="이메일을 입력하세요"
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div className={styles.input}>
      <label htmlFor="password" className={styles.label}>
        비밀번호
      </label>
      <input
        type="password"
        id="password"
        className={styles.inputField}
        value={password}
        placeholder="비밀번호를 입력하세요"
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
    <button
      type="submit"
      className={styles.button}
      disabled={isLoading || !email || !password} // 입력값이 없거나 로딩 상태일 때 버튼 비활성화
    >
      {isLoading ? "로그인 중..." : "로그인"}
    </button>
  </form>
);

export default LoginForm;
