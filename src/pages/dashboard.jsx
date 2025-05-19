import React, { useState, useEffect } from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import { BsBoxArrowRight } from "react-icons/bs";
import { AiOutlineUser, AiOutlineBook } from "react-icons/ai";
import { MdClass, MdPeople } from "react-icons/md";
import AuthLayouts from "../layouts/AuthLayouts.jsx";
import useAuth from "../services/authService.js";
import { Link } from "react-router-dom";
import { getAllDataCount } from "../services/attendanceService.js";

const Dashboard = () => {
  const { token, refreshToken } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllDataCount(token);
        setData(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    refreshToken();
  }, [token, refreshToken]);

  // Fungsi untuk memilih ikon berdasarkan nama data
  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case "guru":
        return <AiOutlineUser size={60} color="#ff5733" />;
      case "siswa":
        return <MdPeople size={60} color="#3498db" />;
      case "mapel":
        return <AiOutlineBook size={60} color="#27ae60" />;
      case "kelas":
        return <MdClass size={60} color="#f39c12" />;
      default:
        return <BsBoxArrowRight size={60} color="#9b59b6" />;
    }
  };

  return (
    <AuthLayouts name={"Dashboard"}>
      {/* Wrapper untuk membuat grid responsif */}
      <div className="columns mt-5 is-mobile is-multiline is-flex-wrap-wrap is-centered">
        {data.map((item, index) => (
          <div
            key={index}
            className="column is-3-desktop is-6-tablet is-12-mobile"
          >
            <div className="card has-text-centered">
              <p className="is-size-5 has-text-weight-bold mt-4">{item.name}</p>
              <div className="content is-flex is-align-items-center is-justify-content-center">
                {getIcon(item.name)}
                <p className="is-size-3 ml-4 has-text-weight-bold">
                  {item.count}
                </p>
              </div>
              <footer className="card-footer">
                <Link to={`/${item.name}`} className="card-footer-item">
                  <p>Selengkapnya</p>
                  <span className="icon">
                    <BsBoxArrowRight />
                  </span>
                </Link>
              </footer>
            </div>
          </div>
        ))}
      </div>

      {/* Informasi Sekolah */}
      <div className="columns is-mobile is-centered  is-multiline is-flex-wrap-wrap">
        <div className="column m-3">
          <div className="card">
            <div className="card-content">
              <p className="title is-size-5">Informasi Sekolah</p>
              <hr />
              <table>
                <tbody>
                  <tr>
                    <th>NPSN</th>
                    <td>: 20514407</td>
                  </tr>
                  <tr>
                    <th>Nama Sekolah</th>
                    <td>: UPT SMPN 3 Srengat</td>
                  </tr>
                  <tr>
                    <th>Alamat</th>
                    <td>
                      : Jl. A. Yani Selokajang, Selokajang, Kecamatan Srengat,
                      Kabupaten Blitar, Provinsi Jawa Timur
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthLayouts>
  );
};

export default Dashboard;
