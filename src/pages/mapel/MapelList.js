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
import MapelModal from "./MapelModal.js";
import {
  createManyMapel,
  deleteMapelById,
  getMapel,
} from "../../services/mapelService";
import { IoIosArrowDown } from "react-icons/io";

const MapelList = () => {
  const [mapels, setMapels] = useState([]);
  const [filteredMapel, setFilteredMapel] = useState([]);
  const { token, refreshToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("↑");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMapel, setSelectedMapel] = useState(null);

  useEffect(() => {
    const fetchMapels = async () => {
      try {
        const response = await getMapel(token);
        setMapels(response);
        setFilteredMapel(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMapels();
  }, [token]);

  useEffect(() => {
    let filtered = mapels.filter((a) =>
      (a.name?.toLowerCase() || "").includes(search.toLowerCase())
    );

    if (sortOrder === "↑") {
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    setFilteredMapel(filtered);
  }, [search, sortOrder, mapels]);

  const openModal = (mapel = null) => {
    setSelectedMapel(mapel);
    setIsModalOpen(true);
  };

  const refresh = useCallback(async () => {
    try {
      const response = await getMapel(token);
      setMapels(response);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const submit = async (id) => {
    confirmAlert({
      title: "Konfirmasi",
      message: "Apakah Anda yakin ingin menghapus mapel ini?",
      buttons: [
        { label: "Ya", onClick: () => deleteMapel(id) },
        { label: "Tidak" },
      ],
    });
  };

  const deleteMapel = async (id) => {
    try {
      await deleteMapelById(token, id);
      const response = await getMapel(token);
      setMapels(response);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPages = Math.ceil(filteredMapel.length / itemsPerPage);
  const displayedmapels = filteredMapel.slice(
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
                <h2 className="title is-5">Mata Pelajaran Management</h2>
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
                <h2 className="title is-5">Daftar Mata Pelajaran</h2>
              </div>
              <div className="column">
                <div className="field">
                  <div className="control has-icons-left has-icons-right">
                   <input
  className="input is-warning is-rounded"
  type="text"
  placeholder="Pencarian Mata Pelajaran"
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
                        <option value={filteredMapel.length}>Semua</option>
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
                      onClick={() =>
                        setSortOrder(sortOrder === "↑" ? "↓" : "↑")
                      }
                    >
                      Nama {sortOrder}
                    </th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedmapels?.map((a, index) => (
                    <tr key={a._id}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>{a.name}</td>
                      <td>
                        <button
                          className="button is-info is-small mr-3"
                          onClick={() => openModal(a)}
                        >
                          <BsGearFill />
                        </button>

                        <button
                          onClick={() => submit(a._id)}
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

      <MapelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mapel={selectedMapel}
        token={token}
        refreshData={refresh}
      />
    </AuthLayouts>
  );
};

export default MapelList;
