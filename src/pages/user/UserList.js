import React, { useState, useEffect } from "react";
import {
  BsGearFill,
  BsTrashFill,
  BsSearch,
  BsFileEarmarkArrowUp,
} from "react-icons/bs";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import AddUser from "./AddUser.js";
import EditUser from "./EditUser.js";
import useAuth from "../../services/authService.js";
import AuthLayouts from "../../layouts/AuthLayouts.jsx";
import { getUsers, deleteUserById, importUser } from "../../services/userService.js";
import { IoIosArrowDown } from "react-icons/io";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers(token);
               const dataAktif = response
          .filter((user) => user.status === "aktif");
        setUsers(dataAktif);
        setFilteredUsers(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
    refreshToken();
  }, [token, refreshToken]);

  useEffect(() => {
    let filtered = users.filter(
      (user) =>
        (user.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        user.username?.includes(search) ||
        false
    );

    filtered.sort((a, b) => {
      let valA = a[sortColumn] || "";
      let valB = b[sortColumn] || "";

      // Jika kolom adalah tanggal lahir, ubah ke tipe Date agar bisa dibandingkan
      if (typeof valA !== "string" || typeof valB !== "string") {
        return 0; // Atau atur nilai default
      }
      if (sortColumn === "tgllahir") {
        valA = String(valA);
        valB = String(valB);
      } else {
        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
      }

      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    setFilteredUsers(filtered);
  }, [search, sortColumn, sortOrder, users]);

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
        "Hanya file Excel (.xls, .xlsx) atau CSV yang diperbolehkan!"
      );
      setFile(null);
      e.target.value = "";
      return;
    }

    setFile(file);
    setErrorMessage(""); // Hapus pesan error jika valid
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Pilih file terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await importUser(formData);
      if (response.data.gagal === 0) {
        alert(`${response.data.berhasil} Data Berhasil di Update`);    
      }else if(response.data.gagal !== 0) {
        alert(`
        Berhasil: ${response.data.berhasil}
        Gagal: ${response.data.gagal}
        Daftar Gagal: 
        ${response.data.detail_gagal.map(item =>
        `Row ${item.row - 1}: ${item.data} - Reason: ${item.reason}`).join("\n")}
      `);  
      } else {
        alert("Gagal mengimpor data.");
      }
      const userss = await getUsers(token);
      setUsers(userss);
      setFilteredUsers(userss);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload data");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = async () => {
    setIsModalOpen(false);
    const response = await getUsers(token);
    setUsers(response);
    setFilteredUsers(response);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = async () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);

    // Refresh data setelah edit
    const response = await getUsers(token);
    setUsers(response);
    setFilteredUsers(response);
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
        { label: "Ya", onClick: () => deleteUser(id) },
        { label: "Tidak" },
      ],
    });
  };

  const deleteUser = async (id) => {
    try {
      await deleteUserById(token, id);
      const response = await getUsers(token);
      setUsers(response);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AuthLayouts name="User Management">
      <div className="columns mt-5 is-mobile is-multiline is-flex-wrap-wrap is-centered m-2">
        <div className="column is-four-fifths">
          {/* Tambah dan Upload User */}
          <div className="box">
            <div className="columns is-vcentered">
              <div className="column">
                <h2 className="title is-5">User Management</h2>
              </div>
              <div className="column">
                <div className="field is-grouped is-flex-wrap-wrap is-flex-direction-column-mobile">
                  <div className="control">
                    <button
                      className="button is-primary is-small is-fullwidth-mobile"
                      onClick={openModal}
                    >
                      Tambah
                    </button>
                  </div>
                  <div className="control">
                    <a
                      href="/template_import_user.xlsx"
                      download
                      className="button is-warning is-small is-fullwidth-mobile"
                    >
                      Export Form
                    </a>
                  </div>
                  <div className="control">
                    <div className="file is-info has-name is-small is-fullwidth-mobile">
                      <label className="file-label">
                        <input
                          className="file-input"
                          type="file"
                          name="resume"
                          onChange={handleFileChange}
                        />
                        <span className="file-cta">
                          <span className="file-icon">
                            <BsFileEarmarkArrowUp />
                          </span>
                        </span>
                        <span className="file-name">
                          {file?.name || "Choose a File..."}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="control">
                    <button
                      onClick={handleSubmit}
                      className="button is-info is-small is-fullwidth-mobile"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {errorMessage && (
              <p className="has-text-danger mt-2 has-text-centered m-0">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="box">
            <div className="columns is-vcentered">
              <div className="column">
                <h2 className="title is-5">Daftar Pengguna</h2>
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
                        <option value={filteredUsers.length}>Semua</option>
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
                maxHeight: "350px", // ⬅️ Batasi tinggi area tabel
                overflowY: "auto", // ⬅️ Tambahkan scroll vertikal
              }}
            >
              <table className="table is-striped is-fullwidth mt-3">
                <thead>
                  <tr>
                    <th>No</th>
                    <th
                      onClick={() => handleSort("username")}
                      style={{ cursor: "pointer" }}
                    >
                      Username{" "}
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
                      onClick={() => handleSort("role")}
                      style={{ cursor: "pointer" }}
                    >
                      Role{" "}
                      {sortColumn === "role"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedUsers?.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>{user.username}</td>
                      <td>{user.name}</td>
                      <td>{user.class_id?.name}</td>
                      <td>{user.alamat}</td>
                      <td>
                        {user.tmplahir}, {convertDateTimeFormat(user.tgllahir)}
                      </td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          onClick={() => openEditModal(user)}
                          className="button is-info is-small m-1"
                        >
                          <BsGearFill />
                        </button>

                        <button
                          onClick={() => submit(user._id)}
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

      {/* Modal Tambah User */}
      {isModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-card">
            <section className="modal-card-body">
              <AddUser Role="admin" close={closeModal} />
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

export default UserList;
