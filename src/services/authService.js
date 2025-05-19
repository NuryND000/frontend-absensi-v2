import { useState, useEffect, useCallback } from "react";
import api from "./Api"; // Gunakan API dari api.js
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { getUserById } from "./userService";

const useAuth = () => {
  const [nama, setNama] = useState("");
  const [dataUser, setData] = useState(null);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();

  // 🔹 Ambil Data User berdasarkan ID & Role
  const fetchUserData = useCallback(
    async (id) => {
      if (!token) return; // Pastikan token sudah tersedia

      try {
        const response = await getUserById(token, id);

        setData(response);
        setNama(response?.name || "Unknown");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    [token] // Tambahkan token sebagai dependency
  );

  // 🔹 Refresh Token
  const refreshToken = useCallback(async () => {
    try {
      const response = await api.get("/token", { withCredentials: true });
      const accessToken = response.data.accessToken;
      setToken(accessToken);

      const decoded = jwtDecode(accessToken);
      setUserId(decoded.userId);
      setRole(decoded.role);
      setExpire(decoded.exp);

      fetchUserData(decoded.userId);
    } catch (error) {
      console.error("Error refreshing token:", error);
      navigate("/login");
    }
  }, [fetchUserData, navigate]);

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  // 🔹 Cek apakah pengguna masih login
  const isLoggedIn = () => token && new Date().getTime() < expire * 1000;

  return {
    role,
    nama,
    dataUser,
    userId,
    token,
    refreshToken,
    isLoggedIn,
  };
};

export default useAuth;
