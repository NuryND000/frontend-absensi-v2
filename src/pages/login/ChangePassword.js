import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../services/authService";
import api from "../../services/Api";
import AuthLayouts from "../../layouts/AuthLayouts";

const ChangePassword = () => {
  const { token } = useAuth();
  const navigate = useNavigate(); // Navigasi halaman
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      const response = await api.put(
        "/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(response.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Navigasi setelah sukses (misalnya ke dashboard)
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  return (
    <AuthLayouts>
      <div className="container">
        <div className="columns is-centered m-5">
          <div className="column is-half">
            <h2 className="title has-text-centered">Ganti Password</h2>
            {error && <p className="notification is-danger">{error}</p>}
            {success && <p className="notification is-success">{success}</p>}
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Password Lama</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Password Baru</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Konfirmasi Password Baru</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="buttons">
                <button type="submit" className="button is-primary">
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  className="button is-light"
                  onClick={() => navigate(-1)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthLayouts>
  );
};

export default ChangePassword;
