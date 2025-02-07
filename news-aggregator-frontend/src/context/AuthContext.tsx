import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<any>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = useCallback((newToken: string, userData: any) => {
    console.log("Setting token:", newToken);
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const response = await fetch("http://localhost:8000/api/user", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setToken(storedToken);
            setUser(userData);
            console.log("Token validated, user set:", userData);
          } else {
            console.log("Token validation failed, response not ok");
            logout();
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
        }
      } else {
        console.log("No token found in localStorage");
      }
    };

    validateToken();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
