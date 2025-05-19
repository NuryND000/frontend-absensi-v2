// src/pages/NotFoundRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(-1); // kembali ke halaman sebelumnya
  }, [navigate]);

  return null; // atau tampilkan pesan seperti "Mengalihkan..."
};

export default NotFoundRedirect;
