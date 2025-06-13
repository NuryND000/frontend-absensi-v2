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
import { Link, useNavigate } from "react-router-dom";

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
      await axios.delete("https://student-attendance.myuniv.cloud/api/logout");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/home">
          <img src={logo} alt="Logo" />
        </Link>

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
              <Link className="navbar-item" to="/dashboard">
                <span>
                  <FaHome className="mr-2 has-text-white" />
                </span>
                Dashboard
              </Link>

              {/* Jika layar kecil, tampilkan sebagai item biasa */}
              {isMobile ? (
                <>
                  <Link to="/user" className="navbar-item">
                    <FaUser className="mr-2" /> User
                  </Link>
                  <Link to="/siswa" className="navbar-item">
                    <FaUsers className="mr-2" /> Siswa
                  </Link>
                  <Link to="/guru" className="navbar-item">
                    <FaChalkboardTeacher className="mr-2" /> Guru
                  </Link>
                  <hr className="navbar-divider" />
                  <Link to="/kelas" className="navbar-item">
                    <FaBook className="mr-2" /> Kelas
                  </Link>
                  <Link to="/mapel" className="navbar-item">
                    <BsFillJournalBookmarkFill className="mr-2" /> Mata
                    Pelajaran
                  </Link>
                  <Link to="/tahun" className="navbar-item">
                    <BsFillJournalBookmarkFill className="mr-2" /> Tahun Ajar
                  </Link>
                  <hr className="navbar-divider" />
                  <Link to="/siswa/import-update" className="navbar-item">
                    <FaBook className="mr-2" /> Update Kelas
                  </Link>
                </>
              ) : (
                <div className="navbar-item has-dropdown is-hoverable">
                  <button className="navbar-link">
                    <FaUsers className="mr-2 has-text-white" />
                    <p>Data</p>
                  </button>
                  <div className="navbar-dropdown is-boxed">
                    <Link to="/user" className="navbar-item">
                      <FaUser className="mr-2" /> User
                    </Link>
                    <Link to="/siswa" className="navbar-item">
                      <FaUsers className="mr-2" /> Siswa
                    </Link>
                    <Link to="/guru" className="navbar-item">
                      <FaChalkboardTeacher className="mr-2" /> Guru
                    </Link>
                    <hr className="navbar-divider" />
                    <Link to="/kelas" className="navbar-item">
                      <FaBook className="mr-2" /> Kelas
                    </Link>
                    <Link to="/mapel" className="navbar-item">
                      <BsFillJournalBookmarkFill className="mr-2" /> Mata
                      Pelajaran
                    </Link>
                    <Link to="/tahun" className="navbar-item">
                      <BsFillJournalBookmarkFill className="mr-2" /> Tahun Ajar
                    </Link>
                  <hr className="navbar-divider" />
                  <Link to="/siswa/import-update" className="navbar-item">
                    <FaBook className="mr-2" /> Update Kelas
                  </Link>
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
                  <Link to="/absensi/add" className="navbar-item">
                    <FaClipboardList className="mr-2" /> Tambah Absensi
                  </Link>
                  <Link to="/absensi" className="navbar-item">
                    <FaClipboardList className="mr-2" /> Data Absensi
                  </Link>
                  <Link to="/laporan" className="navbar-item">
                    <BsFillJournalBookmarkFill className="mr-2" /> Laporan
                  </Link>
                </>
              ) : (
                <div className="navbar-item has-dropdown is-hoverable">
                  <button className="navbar-link">
                    <FaClipboardList className="mr-2 has-text-white" />
                    <p>Absensi</p>
                  </button>
                  <div className="navbar-dropdown is-boxed">
                    <Link to="/absensi/add" className="navbar-item">
                      <FaClipboardList className="mr-2" /> Tambah Absensi
                    </Link>
                    <Link to="/absensi" className="navbar-item">
                      <FaClipboardList className="mr-2" /> Data Absensi
                    </Link>
                    <Link to="/laporan" className="navbar-item">
                      <BsFillJournalBookmarkFill className="mr-2" /> Laporan
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navbar untuk Siswa */}
          {role === "siswa" && (
            <Link className="navbar-item" to="/absensi-siswa">
              <span>
                <FaClipboardList className="mr-2 has-text-white" />
              </span>
              Data Absensi
            </Link>
          )}
          {isMobile ? (
            <>
              <Link className="navbar-item" to="/change-password">
                <span>🔑</span> Ganti Password
              </Link>
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
                <Link className="navbar-item" to="/change-password">
                  <span>🔑</span> Ganti Password
                </Link>
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
