// src/components/login/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GuestLayouts from "../../layouts/GuestLayouts.jsx";
import useAuth from "../../services/authService.js";
import { login } from "../../services/userService.js";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/home"); // Redirect jika sudah login
    }
  }, [isLoggedIn, navigate]);

  const Auth = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate("/home");
    } catch (error) {
      setMsg(error.response?.data?.msg || "Terjadi kesalahan saat login.");
    }
  };

  return (
    <GuestLayouts>
      <section className="hero is-fullheight is-flex is-align-items-center is-justify-content-center m-2">
        <div className="container">
          <div className="columns is-centered mt-5">
            <div className="column is-5">
              {/* Judul */}
              <h1 className="title is-4 has-text-weight-bold has-text-centered mt-6 has-text-white">
                UPT SMP NEGERI 3 SRENGAT
              </h1>

              <div className="box has-text-centered m-3">
                {/* Notifikasi Error */}
                {msg && <p className="notification is-danger">{msg}</p>}

                {/* Form Login */}
                <form onSubmit={Auth}>
                  <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        placeholder="Masukkan NIP / NISN"
                        required
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Hanya angka
                          setUsername(value);
                        }}
                        value={username}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input
                        type="password"
                        className="input "
                        placeholder="*******"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                    </div>
                  </div>

                  {/* Tombol Login */}
                  <hr />
                  <div className="field">
                    <button className="button is-success is-fullwidth is-small">
                      Login
                    </button>
                  </div>
                </form>

                {/* Tambahkan link "Lupa Password" */}
                <p className="is-size-7 mt-2">Sistem absensi siswa</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GuestLayouts>
  );
};

export default Login;
