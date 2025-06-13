import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../services/authService.js";
import AuthLayouts from "../../layouts/AuthLayouts.jsx";
import {
  getAttendanceById,
  updateAttendanceById,
} from "../../services/attendanceService.js";
import {
  getDetailAttendanceByAbsensiId,
  updateManyAttendance,
} from "../../services/detailAttendanceService.js";
import { getMapel } from "../../services/mapelService.js";

function convertDateTimeFormat(datetime) {
  const originalDate = new Date(datetime);
  const day = originalDate.getDate();
  const days = originalDate.getDay();
  const month = originalDate.getMonth();
  const year = originalDate.getFullYear();
  const hours = originalDate.getHours().toString().padStart(2, "0");
  const minutes = originalDate.getMinutes().toString().padStart(2, "0");

  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return `${hari[days]}, ${day} ${bulan[month]} ${year} ${hours}:${minutes}`;
}

const EditAbsensi = () => {
  const [kelas_id, setKelas] = useState("");
  const [mapel_id, setMapel] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [mapels, setMapels] = useState([]);
  const [detailAbsensi, setDetail] = useState([]);

  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const formattedTanggal = convertDateTimeFormat(tanggal);

  useEffect(() => {
    getAbsensiById();
    getMapels();
    getDetailAbsensi();
  }, []);

  const getAbsensiById = async () => {
    try {
      const response = await getAttendanceById(token, id);
      if (response) {
        setKelas(response.kelas_id || {});
        setMapel(response.mapel_id?._id || "");
        setTanggal(response.tanggal || "");
        setKeterangan(response.keterangan || "");
      }
    } catch (error) {
      console.error("Gagal ambil data absensi", error);
    }
  };

  const getMapels = async () => {
    try {
      const response = await getMapel(token);
      setMapels(response);
    } catch (error) {
      console.error("Gagal ambil data mapel", error);
    }
  };

  const getDetailAbsensi = async () => {
    try {
      const response = await getDetailAttendanceByAbsensiId(token, id);
      const sorted = response.sort((a, b) =>
        (a.user_id?.name || "").localeCompare(b.user_id?.name || "")
      );
      setDetail(sorted);
    } catch (error) {
      console.error("Gagal ambil detail absensi", error);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedList = [...detailAbsensi];
    updatedList[index][name] = value;
    setDetail(updatedList);
  };

  const handleStatusChange = (e, index) => {
    const value = e.target.value;
    const updatedList = [...detailAbsensi];
    updatedList[index].status = value;
    setDetail(updatedList);
  };

  const updateAbsensi = async (e) => {
    e.preventDefault();
    try {
      if (!id) {
        alert("ID absensi tidak ditemukan");
        return;
      }

      await updateAttendanceById(token, id, {
        mapel_id,
        keterangan,
        detailAbsensi,
      });

      navigate("/absensi");
    } catch (error) {
      console.error("Gagal update absensi:", error);
    }
  };

  if (!kelas_id) return <p className="has-text-centered">Loading data absensi...</p>;

  return (
    <AuthLayouts>
      <section className="section">
        <div className="container">
          <div className="column is-10 is-offset-1">
            <div className="box">
              <h1 className="title has-text-centered is-size-4">Edit Absensi</h1>
              <form onSubmit={updateAbsensi}>
                <div className="field mb-2">
                  <label className="label is-small">Kelas</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input is-medium"
                      value={kelas_id?.name}
                      disabled
                    />
                  </div>
                </div>

                <div className="field mb-2">
  <label className="label is-small">Mata Pelajaran</label>
  <div className="control">
    <div className="select is-fullwidth is-medium">
      <select
        value={mapel_id}
        onChange={(e) => setMapel(e.target.value)}
      >
        <option value="">Pilih Mapel</option>
        {mapels.map((mapel) => (
          <option key={mapel._id} value={mapel._id}>
            {mapel.name}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>
<div className="field mb-2">
  <label className="label is-small">Tanggal</label>
  <div className="control">
    <input
      type="text"
      className="input is-medium"
      value={formattedTanggal}
      disabled
    />
  </div>
</div>


                <div className="field mb-3">
                  <label className="label is-small">Keterangan</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input is-medium"
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                      placeholder="Keterangan umum"
                    />
                  </div>
                </div>

                <div className="box mt-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table className="table is-fullwidth is-striped is-hoverable is-narrow">
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>H</th>
                        <th>I</th>
                        <th>S</th>
                        <th>A</th>
                        <th>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailAbsensi.map((e, index) => (
                        <tr key={e._id}>
                          <td>{e.user_id?.name}</td>
                          {["h", "i", "s", "a"].map((status) => (
                            <td key={status}>
                              <input
                                type="radio"
                                name={`status-${index}`}
                                value={status}
                                onChange={(e) => handleStatusChange(e, index)}
                                checked={e.status === status}
                              />
                            </td>
                          ))}
                          <td>
                            <input
                              type="text"
                              name="keterangan"
                              className="input is-small"
                              value={e.keterangan}
                              onChange={(e) => handleInputChange(e, index)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="field is-grouped is-grouped-right mt-4">
                  <div className="control">
                    <button type="submit" className="button is-success is-medium">
                      Simpan
                    </button>
                  </div>
                  <div className="control">
                    <Link to="/absensi" className="button is-medium">
                      Batal
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </AuthLayouts>
  );
};

export default EditAbsensi;
