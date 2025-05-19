import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaChalkboardTeacher,
  FaBook,
  FaUsers,
  FaHome,
  FaClipboardList,
} from "react-icons/fa";
import { BsFillJournalBookmarkFill, BsFillPersonFill } from "react-icons/bs";
import logo from "./../assets/logo-text-02.png";
import useAuth from "../services/authService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { nama, role } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Logout = async () => {
    try {
      await axios.delete("http://localhost:1122/logout");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/home">
          <img src={logo} alt="Logo" />
        </a>

        {/* Navbar Burger untuk Mobile */}
        <button
          className={`navbar-burger ${isActive ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded={isActive}
          onClick={() => setIsActive(!isActive)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div className={`navbar-menu ${isActive ? "is-active" : ""}`}>
        <div className="navbar-end">
          {/* Navbar untuk Admin */}
          {role === "admin" && (
            <>
              <a className="navbar-item" href="/dashboard">
                <span>
                  <FaHome className="mr-2 has-text-white" />
                </span>
                Dashboard
              </a>

              {/* Jika layar kecil, tampilkan sebagai item biasa */}
              {isMobile ? (
                <>
                  <a href="/user" className="navbar-item">
                    <FaUser className="mr-2" /> User
                  </a>
                  <a href="/siswa" className="navbar-item">
                    <FaUsers className="mr-2" /> Siswa
                  </a>
                  <a href="/guru" className="navbar-item">
                    <FaChalkboardTeacher className="mr-2" /> Guru
                  </a>
                  <hr className="navbar-divider" />
                  <a href="/kelas" className="navbar-item">
                    <FaBook className="mr-2" /> Kelas
                  </a>
                  <a href="/mapel" className="navbar-item">
                    <BsFillJournalBookmarkFill className="mr-2" /> Mata
                    Pelajaran
                  </a>
                  <a href="/tahun" className="navbar-item">
                    <BsFillJournalBookmarkFill className="mr-2" /> Tahun Ajar
                  </a>
                  <hr className="navbar-divider" />
                  <a href="/siswa/import-update" className="navbar-item">
                    <FaBook className="mr-2" /> Update Kelas
                  </a>
                </>
              ) : (
                <div className="navbar-item has-dropdown is-hoverable">
                  <button className="navbar-link">
                    <FaUsers className="mr-2 has-text-white" />
                    <p>Data</p>
                  </button>
                  <div className="navbar-dropdown is-boxed">
                    <a href="/user" className="navbar-item">
                      <FaUser className="mr-2" /> User
                    </a>
                    <a href="/siswa" className="navbar-item">
                      <FaUsers className="mr-2" /> Siswa
                    </a>
                    <a href="/guru" className="navbar-item">
                      <FaChalkboardTeacher className="mr-2" /> Guru
                    </a>
                    <hr className="navbar-divider" />
                    <a href="/kelas" className="navbar-item">
                      <FaBook className="mr-2" /> Kelas
                    </a>
                    <a href="/mapel" className="navbar-item">
                      <BsFillJournalBookmarkFill className="mr-2" /> Mata
                      Pelajaran
                    </a>
                    <a href="/tahun" className="navbar-item">
                      <BsFillJournalBookmarkFill className="mr-2" /> Tahun Ajar
                    </a>
                  <hr className="navbar-divider" />
                  <a href="/siswa/import-update" className="navbar-item">
                    <FaBook className="mr-2" /> Update Kelas
                  </a>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navbar untuk Admin & Guru */}
          {(role === "admin" || role === "guru") && (
            <>
              {isMobile ? (
                <>
                  <a href="/absensi/add" className="navbar-item">
                    <FaClipboardList className="mr-2" /> Tambah Absensi
                  </a>
                  <a href="/absensi" className="navbar-item">
                    <FaClipboardList className="mr-2" /> Data Absensi
                  </a>
                  <a href="/laporan" className="navbar-item">
                    <BsFillJournalBookmarkFill className="mr-2" /> Laporan
                  </a>
                </>
              ) : (
                <div className="navbar-item has-dropdown is-hoverable">
                  <button className="navbar-link">
                    <FaClipboardList className="mr-2 has-text-white" />
                    <p>Absensi</p>
                  </button>
                  <div className="navbar-dropdown is-boxed">
                    <a href="/absensi/add" className="navbar-item">
                      <FaClipboardList className="mr-2" /> Tambah Absensi
                    </a>
                    <a href="/absensi" className="navbar-item">
                      <FaClipboardList className="mr-2" /> Data Absensi
                    </a>
                    <a href="/laporan" className="navbar-item">
                      <BsFillJournalBookmarkFill className="mr-2" /> Laporan
                    </a>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navbar untuk Siswa */}
          {role === "siswa" && (
            <a className="navbar-item" href="/absensi-siswa">
              <span>
                <FaClipboardList className="mr-2 has-text-white" />
              </span>
              Data Absensi
            </a>
          )}
          {isMobile ? (
            <>
              <a className="navbar-item" href="/change-password">
                <span>🔑</span> Ganti Password
              </a>
              <hr className="navbar-divider" />
              <button
                className="navbar-item is-white has-text-danger"
                onClick={Logout}
              >
                <span>🚪</span> Keluar
              </button>
            </>
          ) : (
            <div className="navbar-item has-dropdown is-hoverable">
              <button className="navbar-link">
                <div className="is-flex is-align-items-center">
                  <BsFillPersonFill className="mr-2 has-text-white" />
                  <span className="has-text-weight-bold has-text-white">
                    {nama}
                  </span>
                </div>
              </button>
              <div className="navbar-dropdown is-boxed">
                <a className="navbar-item" href="/change-password">
                  <span>🔑</span> Ganti Password
                </a>
                <hr className="navbar-divider" />
                <button
                  className="navbar-item is-white has-text-danger"
                  onClick={Logout}
                >
                  <span>🚪</span> Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
