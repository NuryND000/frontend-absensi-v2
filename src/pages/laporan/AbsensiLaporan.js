import React, { useState, useEffect, useCallback } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import useAuth from "../../services/authService.js";
import AuthLayouts from "../../layouts/AuthLayouts.jsx";
import { getAttendanceLap } from "../../services/attendanceService.js";
import { getKelas } from "../../services/kelasService.js";
import { getMapel } from "../../services/mapelService.js";
import { getTahun } from "../../services/tahunAjarSevice.js";
import { getUsers } from "../../services/userService.js";

const AddAbsensi = () => {
  const [kelas_id, setKelas] = useState("");
  const [mapel_id, setMapel] = useState("");
  const [tahun_id, setTahun] = useState("");
  const { token, userId, nama, role } = useAuth();
  const navigate = useNavigate();
  const [kelass, setKelass] = useState([]);
  const [mapels, setMapels] = useState([]);
  const [tahuns, setTahuns] = useState([]);
  const [users, setUsers] = useState([]);
  const [absensis, setAbsensi] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    if (userId) {
      setSelectedUserId(userId);
    }
  }, [userId]);

  useEffect(() => {
    getKelass();
    getMapels();
    getTahunAjar();
    getUser();
  }, []);

  useEffect(() => {
    if (selectedUserId && kelas_id && mapel_id && tahun_id) {
      getAbsensi();
    }
  }, [selectedUserId, kelas_id, mapel_id, tahun_id]);

  const getAbsensi = async () => {
    try {
      const response = await getAttendanceLap(token, {
        user_id: selectedUserId,
        kelas_id,
        mapel_id,
        tahun_id,
      });
      setAbsensi(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const getTahunAjar = async () => {
    const response = await getTahun();
    setTahuns(response);
  };
  const getKelass = async () => {
    const response = await getKelas();
    setKelass(response);
  };
  const getMapels = async () => {
    const response = await getMapel();
    setMapels(response);
  };
  const getUser = async () => {
    try {
      const response = await getUsers(); // Ambil semua user
      const filteredUsers = response.filter((user) => user.role === "guru"); // Filter hanya guru
      setUsers(filteredUsers); // Simpan ke state
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const exportToExcel = async () => {
    if (absensis.length === 0) {
      alert("Tidak ada data untuk diekspor!");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Absensi");

    // ===== 🎨 HEADER UTAMA 🎨 =====
    worksheet.mergeCells("A1:F1");
    worksheet.mergeCells("A2:C2");
    worksheet.mergeCells("D2:F2");
    worksheet.mergeCells("A3:C3");
    worksheet.mergeCells("D3:F3");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "UPT SMPN 3 SRENGAT";
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.font = { bold: true, size: 14 };

    // ===== ℹ️ KETERANGAN TAMBAHAN ℹ️ =====
    worksheet.getCell("A3").value = `Kelas: ${
      kelass.find((k) => k._id === kelas_id)?.name || "-"
    }`;
    worksheet.getCell("D3").value = `Mapel: ${
      mapels.find((m) => m._id === mapel_id)?.name || "-"
    }`;
    worksheet.getCell("A2").value = `Nama Guru: ${nama || "-"}`;
    worksheet.getCell("D2").value = `Semester: ${
      tahuns.find((t) => t._id === tahun_id)?.semester || "-"
    }`;

    // ===== 📊 TABEL ABSENSI 📊 =====
    worksheet.addRow([]); // Spasi
    worksheet.addRow(["No", "Nama", "Hadir", "Izin", "Sakit", "Alpa"]); // Header tabel
    worksheet.getRow(5).font = { bold: true };
    worksheet.getRow(5).alignment = { horizontal: "center" };

    absensis.forEach((e, index) => {
      worksheet.addRow([
        index + 1,
        e.name,
        e.total_hadir,
        e.total_izin,
        e.total_sakit,
        e.total_alpa,
      ]);
    });

    // ===== ✨ STYLING ✨ =====
    const borderStyle = { style: "thin" };
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: borderStyle,
          left: borderStyle,
          bottom: borderStyle,
          right: borderStyle,
        };
      });
      if (rowNumber >= 5) {
        row.alignment = { horizontal: "center" };
      }
    });

    // ===== 💾 SIMPAN FILE 💾 =====
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Laporan_Absensi.xlsx"
    );
  };

  return (
    <AuthLayouts name={"Absensi"}>
      <div className="columns mt-5 is-mobile is-centered">
        <div className="column is-four-fifths ">
          <p class="title has-text-centered is-size-5">ABSENSI SISWA</p>
          <div class="field is-horizontal">
            <div class="field-body">
              {role === "admin" && ( // Hanya admin yang bisa memilih user
                <div className="field">
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                      >
                        <option value="">GURU</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              <div className="field">
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={kelas_id}
                      onChange={(e) => {
                        setKelas(e.target.value);
                      }}
                    >
                      <option value="">KELAS</option>
                      {kelass.map((kelas, index) => (
                        <option value={kelas._id}>{kelas.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={mapel_id}
                      onChange={(e) => setMapel(e.target.value)}
                    >
                      <option value="">MATA PELAJARAN</option>
                      {mapels.map((mapel, index) => (
                        <option value={mapel._id}>{mapel.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={tahun_id}
                      onChange={(e) => setTahun(e.target.value)}
                    >
                      <option value="">TAHUN AJARAN</option>
                      {tahuns.map((tahun, index) => (
                        <option value={tahun._id}>
                          {tahun.name} , {tahun.semester}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <button className="button is-primary" onClick={exportToExcel}>
                  Export Excel
                </button>
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
                  <th>No.</th>
                  <th>Nama</th>
                  <th>H </th>
                  <th> I </th>
                  <th> S </th>
                  <th> A</th>
                </tr>
              </thead>
              <tbody>
                {absensis.map((e, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{e.name}</td>
                    <td>{e.total_hadir}</td>
                    <td>{e.total_izin}</td>
                    <td>{e.total_sakit}</td>
                    <td>{e.total_alpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthLayouts>
  );
};

export default AddAbsensi;
