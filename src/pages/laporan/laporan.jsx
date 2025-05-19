import React, { useState, useEffect } from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import useAuth from "../../services/authService.js";
import AuthLayouts from "../../layouts/AuthLayouts.jsx";

const Laporan = () => {
  const { token, axiosJWT } = useAuth();
  const [kelas, setKelas] = useState([]);
  const [absensi, setAbsensi] = useState([]);
  const [detail, setDetailAbsensi] = useState([]);
  const [kelas_id, setKelasId] = useState("");
  const [tanggal, setTanggal] = useState("");

  useEffect(() => {
    getKelas();
  }, []);

  const getKelas = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/kelass", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setKelas(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAbsensi = async () => {
    try {
      const response = await axiosJWT.get(
        `http://localhost:5000/laporan/${kelas_id}/${tanggal}`,
        {
          kelas,
          tanggal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const absensiIds = response.data.map((absensi) => absensi._id);
      setAbsensi(absensiIds);
      console.log(absensiIds);
      getDetailAbsensi();
    } catch (error) {
      console.log(error);
    }
  };

  const getDetailAbsensi = async () => {
    try {
      const response = await axiosJWT.get(
        `http://localhost:5000/detail/many`,
        absensi,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDetailAbsensi(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayouts name={"Laporan"}>
      <div className="columns mt-5 is-mobile is-centered">
        <div className="column is-four-fifths">
          <div className=" box">
            <div className="columns">
              <div className="column">
                <div class="field is-horizontal">
                  <div class="field-body">
                    <div className="field">
                      <label className="label">KELAS</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={kelas_id}
                            onChange={(e) => {
                              setKelasId(e.target.value);
                              getAbsensi();
                            }}
                          >
                            <option value=""> </option>
                            {kelas.map((kelas, index) => (
                              <option value={kelas._id}>{kelas.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">TANGGAL</label>
                      <div className="control">
                        <input
                          dateFormat="YYYY-MM-DD"
                          timeFormat="HH:mm"
                          type="datetime-local"
                          className="input"
                          onChange={(e) => {
                            setTanggal(e.target.value);
                            getAbsensi();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="box mt-1 table-container"
            style={{
              maxHeight: "350px",
              overflowY: "auto",
            }}
          >
            <table className="table is-striped is-fullwidth">
              <thead>
                <tr>
                  <th>NO</th>
                  <th>NAMA</th>
                  <th>KELAS</th>
                  <th>H</th>
                  <th>I</th>
                  <th>S</th>
                  <th>A</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthLayouts>
  );
};

export default Laporan;
