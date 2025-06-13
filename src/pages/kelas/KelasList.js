import React, { useState, useEffect, useCallback } from "react";
import {
  BsGearFill,
  BsTrashFill,
  BsSearch,
  BsFileEarmarkArrowUp,
} from "react-icons/bs";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import useAuth from "../../services/authService.js";
import AuthLayouts from "../../layouts/AuthLayouts.jsx";
import KelasModal from "./KelasModal";
import {
  createManyKelas,
  deleteKelasById,
  getKelas,
} from "../../services/kelasService.js";
import { IoIosArrowDown } from "react-icons/io";

const KelasList = () => {
  const [kelass, setKelas] = useState([]);
  const [filteredKelas, setFilteredKelas] = useState([]);
  const { token, refreshToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("↑");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState(null);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await getKelas(token);
        setKelas(response);
        setFilteredKelas(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchKelas();
  }, [token]);

  useEffect(() => {
    let filtered = kelass.filter((kelas) =>
      (kelas.name?.toLowerCase() || "").includes(search.toLowerCase())
    );

    if (sortOrder === "↑") {
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    setFilteredKelas(filtered);
  }, [search, sortOrder, kelass]);

  const openModal = (kelas = null) => {
    setSelectedKelas(kelas);
    setIsModalOpen(true);
  };

  const refresh = useCallback(async () => {
    try {
      const response = await getKelas(token);
      setKelas(response);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const submit = async (id) => {
    confirmAlert({
      title: "Konfirmasi",
      message: "Apakah Anda yakin ingin menghapus kelas ini?",
      buttons: [
        { label: "Ya", onClick: () => deleteKelas(id) },
        { label: "Tidak" },
      ],
    });
  };

  const deleteKelas = async (id) => {
    try {
      await deleteKelasById(token, id);
      const response = await getKelas(token);
      setKelas(response);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPages = Math.ceil(filteredKelas.length / itemsPerPage);
  const displayedkelass = filteredKelas.slice(
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
                <h2 className="title is-5">Kelas Management</h2>
              </div>
              <div className="column has-text-right mr-3">
                <div className="field">
                  <div className="control">
                    <button
                      className="button is-success is-small"
                      onClick={() => openModal()}
                    >
                      Tambah
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
                <h2 className="title is-5">Daftar Kelas</h2>
              </div>
              <div className="column">
                <div className="field">
                  <div className="control has-icons-left has-icons-right">
                    <input
                      className="input is-warning is-rounded"
                      type="text"
                      placeholder="Pencarian Kelas"
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
                        <option value={filteredKelas.length}>Semua</option>
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
              <table className="table is-striped is-fullwidth">
                <thead>
                  <tr>
                    <th>No</th>
                    <th
                      onClick={() =>
                        setSortOrder(sortOrder === "↑" ? "↓" : "↑")
                      }
                      className="has-text-centered"
                    >
                      Nama {sortOrder}
                    </th>
                    <th className="has-text-centered">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedkelass?.map((kelas, index) => (
                    <tr key={kelas._id}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td className="has-text-centered">{kelas.name}</td>
                      <td className="has-text-centered">
                        <button
                          className="button is-info is-small mr-3"
                          onClick={() => openModal(kelas)}
                        >
                          <BsGearFill />
                        </button>

                        <button
                          onClick={() => submit(kelas._id)}
                          className="button is-danger is-small"
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

      <KelasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        kelas={selectedKelas}
        token={token}
        refreshData={refresh}
      />
    </AuthLayouts>
  );
};

export default KelasList;
