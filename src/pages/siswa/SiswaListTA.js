import React, { useState, useEffect } from "react";
import {
  BsGearFill,
  BsTrashFill,
  BsSearch,
  BsFileEarmarkArrowUp,
} from "react-icons/bs";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import AddUser from "./AddSiswa";
import EditUser from "../user/EditUser";
import useAuth from "../../services/authService.js";
import AuthLayouts from "../../layouts/AuthLayouts.jsx";
import { getSiswa, deleteSiswaById } from "../../services/siswaService.js";
import { importUser } from "../../services/userService.js";
import { getKelas } from "../../services/kelasService.js";
import { getTahun } from "../../services/tahunAjarSevice.js";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";

const SiswaListTA = () => {
  const [siswas, setSiswas] = useState([]);
  const [kelass, setKelas] = useState([]);
  const [filteredSiswas, setFilteredSiswas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [file, setFile] = useState(null);
  const { token, refreshToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]); // Data tahun ajar

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const response = await getSiswa(token);
        const dataAktif = response.filter(
          (user) => user.status === "tidakAktif",
        );
        setSiswas(dataAktif);
        setFilteredSiswas(dataAktif);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSiswa();
    refreshToken();
  }, [token, refreshToken]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await getTahun(token); // Pastikan ada service-nya
        setYears(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchYears();
  }, [token]);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await getKelas(token);
        setKelas(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchKelas();
  }, [token]);

  useEffect(() => {
    let filtered = siswas;
    if (selectedClass) {
      filtered = filtered.filter(
        (user) => user.class_id?._id === selectedClass,
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (user) => user.tahun_id?._id === selectedYear, // atau sesuaikan field di database
      );
    }

    if (search) {
      filtered = filtered.filter(
        (user) =>
          (user.name?.toLowerCase() || "").startsWith(search.toLowerCase()) ||
          (user.username?.toLowerCase() || "").startsWith(search.toLowerCase()),
      );
    }

    if (selectedClass && selectedYear) {
      filtered.sort((a, b) => {
        const getValueByPath = (obj, path) =>
          path.split(".").reduce((acc, key) => acc?.[key], obj);

        let valA = String(getValueByPath(a, sortColumn) || "").toLowerCase();
        let valB = String(getValueByPath(b, sortColumn) || "").toLowerCase();

        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
      setFilteredSiswas(filtered);
    } else {
      // Jangan tampilkan apa pun jika filter belum lengkap
      setFilteredSiswas([]);
    }
  }, [search, sortColumn, sortOrder, siswas, selectedClass, selectedYear]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setErrorMessage("Tidak ada file yang dipilih!");
      return;
    }

    const allowedExtensions = ["xls", "xlsx", "csv"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      setErrorMessage(
        "Hanya file Excel (.xls, .xlsx) atau CSV yang diperbolehkan!",
      );
      setFile(null);
      e.target.value = "";
      return;
    }

    setFile(file);
    setErrorMessage(""); // Hapus pesan error jika valid
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await importUser(formData);
      if (response.data.gagal === 0) {
        alert(`${response.data.berhasil} Data Berhasil di Update`);
      } else if (response.data.gagal !== 0) {
        alert(`
        Berhasil: ${response.data.berhasil}
        Gagal: ${response.data.gagal}
        Daftar Gagal: 
        ${response.data.detail_gagal
          .map(
            (item) =>
              `Row ${item.row - 1}: ${item.data} - Reason: ${item.reason}`,
          )
          .join("\n")}
      `);
      } else {
        alert("Gagal mengimpor data.");
      }
      const userss = await getSiswa(token);
      setSiswas(userss);
      setFilteredSiswas(userss);
    } catch (error) {
      console.error(error);
      alert("Failed to upload data");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = async () => {
    setIsModalOpen(false);
    const response = await getSiswa(token);
    setSiswas(response);
    setFilteredSiswas(response);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = async () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);

    // Refresh data setelah edit
    const response = await getSiswa(token);
    setSiswas(response);
    setFilteredSiswas(response);
  };

  function convertDateTimeFormat(datetime) {
    const originalDate = new Date(datetime);
    const day = originalDate.getDate();
    const month = originalDate.getMonth();
    const year = originalDate.getFullYear();

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

    return `${day} ${bulan[month]} ${year}`;
  }

  const submit = async (id) => {
    confirmAlert({
      title: "Konfirmasi",
      message: "Apakah Anda yakin ingin menghapus user ini?",
      buttons: [
        { label: "Ya", onClick: () => deleteSiswa(id) },
        { label: "Tidak" },
      ],
    });
  };

  const deleteSiswa = async (id) => {
    try {
      await deleteSiswaById(token, id);
      const response = await getSiswa(token);
      setSiswas(response);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPages = Math.ceil(filteredSiswas.length / itemsPerPage);
  const displayedSiswa = filteredSiswas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <AuthLayouts name="User Management">
      <div className="columns mt-5 is-mobile is-multiline is-flex-wrap-wrap is-centered m-2">
        <div className="column is-four-fifths">
          {/* Tambah dan Upload User */}
          <div className="box">
            <div className="columns is-vcentered is-centered">
              <div className="column is-4">
                <h2 className="title is-5">Siswa Lama Management</h2>
              </div>
              <div className="column is-4">
                <div className="field">
                  <div className="control">
                    <select
                      className="custom-select select is-fullwidth"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="">Pilih Tahun Ajar</option>
                      {years.map((year) => (
                        <option key={year._id} value={year._id}>
                          {year.name}
                        </option>
                      ))}
                    </select>
                    <div className="custom-select-arrow">
                      <IoIosArrowDown />
                    </div>
                  </div>
                </div>
              </div>
              <div className="column is-4">
                <div className="field">
                  <div className="control">
                    <select
                      className="custom-select select is-fullwidth"
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">Pilih Kelas</option>
                      {kelass.map((kelas) => (
                        <option key={kelas._id} value={kelas._id}>
                          {kelas.name}
                        </option>
                      ))}
                    </select>
                    <div className="custom-select-arrow ">
                      <IoIosArrowDown />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="box">
            <div className="columns is-vcentered">
              <div className="column">
                <h2 className="title is-5">Daftar Siswa Lama</h2>
              </div>
              <div className="column">
                <div className="field">
                  <div className="control has-icons-left has-icons-right">
                    <input
                      className="input is-warning is-rounded"
                      type="text"
                      placeholder="Pencarian Nama / NISN"
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
                <div className="field has-addons has-addons-right">
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
                        <option value={filteredSiswas.length}>Semua</option>
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
              <table className="table is-striped is-fullwidth mt-2">
                <thead>
                  <tr>
                    <th>No</th>
                    <th
                      onClick={() => handleSort("username")}
                      style={{ cursor: "pointer" }}
                    >
                      NISN{" "}
                      {sortColumn === "username"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("name")}
                      style={{ cursor: "pointer" }}
                    >
                      Nama{" "}
                      {sortColumn === "name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("class_id.name")}
                      style={{ cursor: "pointer" }}
                    >
                      Kelas{" "}
                      {sortColumn === "class_id.name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("alamat")}
                      style={{ cursor: "pointer" }}
                    >
                      Alamat{" "}
                      {sortColumn === "alamat"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("tgllahir")}
                      style={{ cursor: "pointer" }}
                    >
                      Tempat/Tanggal Lahir{" "}
                      {sortColumn === "tgllahir"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      onClick={() => handleSort("tahun_id?.name")}
                      style={{ cursor: "pointer" }}
                    >
                      Tahun Ajar{" "}
                      {sortColumn === "tahun_id?.name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayedSiswa?.map((user, index) => (
                    <tr key={user?._id}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>{user.username}</td>
                      <td>{user.name}</td>
                      <td>{user.class_id?.name || "Tidak ada data"}</td>
                      <td>{user.alamat}</td>
                      <td>
                        {user.tmplahir}, {convertDateTimeFormat(user.tgllahir)}
                      </td>
                      <td>{user.tahun_id?.name || "Tidak ada data"}</td>
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

      {/* Modal Tambah User */}
      {isModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-card">
            <section className="modal-card-body">
              <AddUser Role="siswa" close={closeModal} />
            </section>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={closeModal}
          ></button>
        </div>
      )}

      {isEditModalOpen && selectedUser && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeEditModal}></div>
          <div className="modal-card">
            <section className="modal-card-body">
              <EditUser user={selectedUser} close={closeEditModal} />
            </section>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={closeEditModal}
          ></button>
        </div>
      )}
    </AuthLayouts>
  );
};

export default SiswaListTA;
