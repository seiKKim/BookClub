import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface User {
  email: string;
  name?: string;
  role?: "R" | "U"; // 관리자(R) 또는 사용자(U)
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean; // 로딩 상태 추가
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      // 현재 사용자 정보 가져오기
      setIsLoading(true); // 로딩 시작
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user");
          return res.json();
        })
        .then((response) => {
          console.log("Fetched user data:", response); // 디버깅
          if (response.success && response.data) {
            setUser({
              email: response.data.email,
              name: response.data.name,
              role: response.data.role, // role 추가
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false); // 로딩 종료
        });
    } else {
      setIsLoading(false); // 토큰이 없으면 로딩 종료
    }
  }, []);

  const login = useCallback((user: User, token: string) => {
    setUser(user);
    localStorage.setItem("accessToken", token);
    console.log("User after login:", user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("accessToken");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
