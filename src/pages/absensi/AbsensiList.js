import React, { useState, useEffect } from "react";
import { BsGearFill, BsTrashFill, BsSearch } from "react-icons/bs";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import useAuth from "../../services/authService.js";
import AuthLayouts from "../../layouts/AuthLayouts.jsx";
import {
  getAttendances,
  deleteAttendanceById,
  getAttendanceByUserId,
} from "../../services/attendanceService.js";
import { IoIosArrowDown } from "react-icons/io";
import { deleteManyDetailAttendance } from "../../services/detailAttendanceService.js";
import { Link } from "react-router-dom";

const AbsensiList = () => {
  const [attendance, setAtt] = useState([]);
  const [filteredAtt, setFilteredAtt] = useState([]);
  const { token, refreshToken, userId, role } = useAuth();
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAtt = async () => {
      try {
        let response;
        if (role === "admin") {
          response = await getAttendances(token);
        } else {
          response = await getAttendanceByUserId(token, userId);
        }
        setAtt(response);
        setFilteredAtt(response);
      } catch (error) {
        console.log(error);
      }
    };

    refreshToken().then(() => {
      fetchAtt();
    });
  }, [token, role, userId, refreshToken]);

  useEffect(() => {
    let filtered = attendance.filter(
      (user) =>
        (user.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        user.username?.includes(search) ||
        false
    );

    filtered.sort((a, b) => {
      const getValueByPath = (obj, path) =>
        path.split(".").reduce((acc, key) => acc?.[key], obj);

      let valA = getValueByPath(a, sortColumn) || "";
      let valB = getValueByPath(b, sortColumn) || "";

      // Konversi nilai ke string untuk memastikan `localeCompare` tidak error
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    setFilteredAtt(filtered);
  }, [search, sortColumn, sortOrder, attendance]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  function convertDateTimeFormat(datetime) {
    const originalDate = new Date(datetime);
    const day = originalDate.getDate();
    const month = originalDate.getMonth();
    const year = originalDate.getFullYear();
    const hours = originalDate.getHours();
    const minutes = originalDate.getMinutes().toString().padStart(2, "0");

    const hari = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const dayName = hari[originalDate.getDay()];

    return `${dayName}, ${day} ${bulan[month]} ${year}, ${hours}:${minutes}`;
  }
  const submit = async (id) => {
    confirmAlert({
      title: "Konfirmasi",
      message: "Apakah Anda yakin ingin menghapus user ini?",
      buttons: [
        { label: "Ya", onClick: () => deleteAtt(id) },
        { label: "Tidak" },
      ],
    });
  };

  const deleteAtt = async (id) => {
    try {
      await deleteAttendanceById(token, id);
      await deleteManyDetailAttendance(token, id);
      const response = await getAttendances(token);
      setAtt(response);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPages = Math.ceil(filteredAtt.length / itemsPerPage);
  const displayed = filteredAtt.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AuthLayouts name="User Management">
      <div className="columns mt-5 is-mobile is-multiline is-flex-wrap-wrap is-centered m-2">
        <div className="column is-four-fifths">
          <div className="box">
            <div className="columns is-vcentered">
              <div className="column">
                <h2 className="title is-5">Daftar Absensi</h2>
              </div>
              <div className="column">
                <div className="field">
                  <div className="control has-icons-left has-icons-right">
                    <input
                      className="input is-warning is-rounded"
                      type="text"
                      placeholder="Pencarian Nama / username"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="icon is-left">
                      <i>
                        <BsSearch />
                      </i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="field has-addons has-addons-centered">
                  <div className="control">
                    <div className="custom-select-container">
                      <select
                        className="custom-select"
                        value={itemsPerPage}
                        onChange={(e) =>
                          setItemsPerPage(Number(e.target.value))
                        }
                      >
                        <option value={15}>15</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={filteredAtt.length}>Semua</option>
                      </select>
                    </div>
                    <div className="custom-select-arrow">
                      <IoIosArrowDown />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="table-container"
              style={{
                maxHeight: "350px",
                overflowY: "auto",
              }}
            >
              <table className="table is-striped is-fullwidth mt-3">
                <thead>
                  <tr>
                    <th>No</th>
                    <th
                      onClick={() => handleSort("tanggal")}
                      style={{ cursor: "pointer" }}
                    >
                      Tanggal{" "}
                      {sortColumn === "tanggal"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("user_id.name")}
                      style={{ cursor: "pointer" }}
                    >
                      Guru{" "}
                      {sortColumn === "user_id.name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("kelas_id.name")}
                      style={{ cursor: "pointer" }}
                    >
                      Kelas{" "}
                      {sortColumn === "kelas_id.name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("mapel_id.name")}
                      style={{ cursor: "pointer" }}
                    >
                      Mata Pelajaran{" "}
                      {sortColumn === "mapel_id.name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("keterangan")}
                      style={{ cursor: "pointer" }}
                    >
                      Keterangan{" "}
                      {sortColumn === "keterangan"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("tahun.id_name")}
                      style={{ cursor: "pointer" }}
                    >
                      Tahun Ajar{" "}
                      {sortColumn === "tahun.id_name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {displayed?.map((a, index) => (
                    <tr key={a._id}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>{convertDateTimeFormat(a.tanggal)}</td>
                      <td>{a.user_id?.name}</td>
                      <td>{a.kelas_id?.name}</td>
                      <td>{a.mapel_id?.name}</td>
                      <td>{a.keterangan}</td>
                      <td>
                        {a.tahun_id?.name}, {a.tahun_id?.semester}
                      </td>
                      <td>
                        <Link
                          to={`/absensi/edit/${a._id}`}
                          className="button is-info is-small m-1"
                        >
                          <BsGearFill />
                        </Link>

                        <button
                          onClick={() => submit(a._id)}
                          className="button is-danger is-small m-1"
                        >
                          <BsTrashFill />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <nav
              className="pagination mt-3"
              role="navigation"
              aria-label="pagination"
            >
              <button
                className="button pagination-previous is-rounded"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>
              <button
                className="button pagination-next  is-rounded"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </AuthLayouts>
  );
};

export default AbsensiList;
