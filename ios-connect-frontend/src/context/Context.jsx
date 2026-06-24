import { createContext, useState, useEffect } from "react";
import API from "../services/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session on application mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await API.get("/users/profile");
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.warn("Session check failed, user not authenticated.", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    try {
      await API.post("/users/logout");
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
