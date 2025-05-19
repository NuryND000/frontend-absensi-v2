import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import "react-confirm-alert/src/react-confirm-alert.css";
import useAuth from "../../services/authService.js";
import AuthLayouts from "../../layouts/AuthLayouts.jsx";
import { getDetailAttendanceByUserId } from "../../services/attendanceService.js";
import { getMapel } from "../../services/mapelService.js";

const DetailAbsensiList = () => {
  const [attendance, setAtt] = useState([]);
  const [filteredAtt, setFilteredAtt] = useState([]);
  const { token, refreshToken, userId, role } = useAuth();
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [mapels, setMapels] = useState([]);
  const [mapel_id, setMapel] = useState("");

  useEffect(() => {
    const fetchAtt = async () => {
      try {
        const response = await getDetailAttendanceByUserId(token, userId);

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
    let filtered = attendance.filter((user) => {
      const matchSearch =
        (user.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        user.username?.includes(search);

      const matchMapel = mapel_id
        ? user.absensi_id?.mapel_id?._id === mapel_id
        : true;

      return matchSearch && matchMapel;
    });

    filtered.sort((a, b) => {
      const getValueByPath = (obj, path) =>
        path.split(".").reduce((acc, key) => acc?.[key], obj);

      let valA = getValueByPath(a, sortColumn) || "";
      let valB = getValueByPath(b, sortColumn) || "";

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    setFilteredAtt(filtered);
  }, [search, mapel_id, sortColumn, sortOrder, attendance]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getMapels = async () => {
    const response = await getMapel();
    setMapels(response);
  };

  useEffect(() => {
    getMapels();
  }, []);

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

  const totalPages = Math.ceil(filteredAtt.length / itemsPerPage);
  const displayed = filteredAtt.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusText = (status) => {
    switch (status) {
      case "h":
        return "Hadir";
      case "i":
        return "Izin";
      case "s":
        return "Sakit";
      case "a":
        return "Alpa";
      default:
        return "Tidak Diketahui";
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "h":
        return "is-success"; // Hijau untuk Hadir
      case "i":
        return "is-warning"; // Kuning untuk Izin
      case "s":
        return "is-info"; // Biru untuk Sakit
      case "a":
        return "is-danger"; // Merah untuk Alpa
      default:
        return "is-light"; // Default abu-abu
    }
  };

  return (
    <AuthLayouts name="User Management">
      <div className="columns mt-5 is-centered m-2">
        <div className="column is-four-fifths">
          <div className="box">
            <div className="columns is-vcentered">
              <div className="column">
                <h2 className="title is-5">Daftar Absensi</h2>
              </div>
              <div className="column">
                <div class="field has-addons">
                  <p class="control">
                    <a class="button is-static">Pencarian Mata Pelajaran</a>
                  </p>
                  <div class="control">
                    <div className="custom-select-container">
                      <select
                        className="custom-select"
                        value={mapel_id}
                        onChange={(e) => setMapel(e.target.value)}
                      >
                        <option value="">Semua</option>
                        {mapels.map((mapel, index) => (
                          <option value={mapel._id}>{mapel.name}</option>
                        ))}
                      </select>
                      <div className="custom-select-arrow">
                        <IoIosArrowDown />
                      </div>
                    </div>
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
                      <div className="custom-select-arrow">
                        <IoIosArrowDown />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="table-container"
              style={{
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              <table className="table is-striped is-fullwidth mt-3">
                <thead>
                  <tr>
                    <th>No</th>
                    <th
                      onClick={() => handleSort("absensi_id.tanggal")}
                      style={{ cursor: "pointer" }}
                    >
                      Tanggal{" "}
                      {sortColumn === "absensi_id.tanggal"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("user_id.name")}
                      style={{ cursor: "pointer" }}
                    >
                      Nama{" "}
                      {sortColumn === "user_id.name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("absensi_id.kelas_id.name")}
                      style={{ cursor: "pointer" }}
                    >
                      Kelas{" "}
                      {sortColumn === "absensi_id.kelas_id.name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("absensi_id.mapel_id.name")}
                      style={{ cursor: "pointer" }}
                    >
                      Mata Pelajaran{" "}
                      {sortColumn === "absensi_id.mapel_id.name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("absensi_id.user_id.name")}
                      style={{ cursor: "pointer" }}
                    >
                      Guru{" "}
                      {sortColumn === "absensi_id.user_id.name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("status")}
                      style={{ cursor: "pointer" }}
                    >
                      Status{" "}
                      {sortColumn === "status"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("absensi_id.tahun.id_name")}
                      style={{ cursor: "pointer" }}
                    >
                      Tahun Ajar{" "}
                      {sortColumn === "absensi_id.tahun.id_name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayed?.map((a, index) => (
                    <tr key={a._id}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>{convertDateTimeFormat(a.absensi_id?.tanggal)}</td>
                      <td>{a.user_id?.name}</td>
                      <td>{a.absensi_id?.kelas_id?.name}</td>
                      <td>{a.absensi_id?.mapel_id?.name}</td>
                      <td>{a.absensi_id?.user_id?.name}</td>
                      <td>
                        <span className={`tag ${getBadgeClass(a.status)}`}>
                          {getStatusText(a.status)}
                        </span>
                      </td>

                      <td>
                        {a.absensi_id?.tahun_id?.name},
                        {a.absensi_id?.tahun_id?.semester}
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

export default DetailAbsensiList;
