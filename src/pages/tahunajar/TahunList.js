import React, { useState, useEffect, useCallback } from "react";
import { BsGearFill, BsTrashFill, BsSearch } from "react-icons/bs";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import useAuth from "../../services/authService.js";
import AuthLayouts from "../../layouts/AuthLayouts.jsx";
import TahunModal from "./TahunModal.js";
import { IoIosArrowDown } from "react-icons/io";
import { deleteTahunById, getTahun } from "../../services/tahunAjarSevice.js";

function convertDateTimeFormat(datetime) {
  const originalDate = new Date(datetime);
  const day = originalDate.getDate();
  const days = originalDate.getDay();
  const month = originalDate.getMonth();
  const year = originalDate.getFullYear();

  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
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

  return `${hari[days]}, ${day} ${bulan[month]} ${year}`;
}

const TahunList = () => {
  const [tahuns, setTahuns] = useState([]);
  const [filteredTahun, setFilteredTahun] = useState([]);
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("↑");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTahun, setSelectedTahun] = useState(null);

  useEffect(() => {
    const fetchTahuns = async () => {
      try {
        const response = await getTahun(token);
        setTahuns(response);
        setFilteredTahun(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTahuns();
  }, [token]);

  useEffect(() => {
    let filtered = tahuns.filter((a) =>
      (a.name?.toLowerCase() || "").includes(search.toLowerCase())
    );

    if (sortOrder === "↑") {
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    setFilteredTahun(filtered);
  }, [search, sortOrder, tahuns]);

  const openModal = (tahun = null) => {
    setSelectedTahun(tahun);
    setIsModalOpen(true);
  };

  const refresh = useCallback(async () => {
    try {
      const response = await getTahun(token);
      setTahuns(response);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const submit = async (id) => {
    confirmAlert({
      title: "Konfirmasi",
      message: "Apakah Anda yakin ingin menghapus Tahun Ajar ini?",
      buttons: [
        { label: "Ya", onClick: () => deleteTahun(id) },
        { label: "Tidak" },
      ],
    });
  };

  const deleteTahun = async (id) => {
    try {
      await deleteTahunById(token, id);
      const response = await getTahun(token);
      setTahuns(response);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPages = Math.ceil(filteredTahun.length / itemsPerPage);
  const displayedTahuns = filteredTahun.slice(
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
                <h2 className="title is-5">Tahun Ajar Management</h2>
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
                <h2 className="title is-5">Daftar Tahun Ajar</h2>
              </div>
              <div className="column">
                <div className="field">
                  <div className="control has-icons-left has-icons-right">
                    <input
  className="input is-warning is-rounded"
  type="text"
  placeholder="Pencarian Tahun Ajar"
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
                        <option value={filteredTahun.length}>Semua</option>
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
                      Tahun Ajar {sortOrder}
                    </th>
                    <th
                      onClick={() =>
                        setSortOrder(sortOrder === "↑" ? "↓" : "↑")
                      }
                    >
                      Semeser {sortOrder}
                    </th>
                    <th
                      onClick={() =>
                        setSortOrder(sortOrder === "↑" ? "↓" : "↑")
                      }
                    >
                      Mulai {sortOrder}
                    </th>
                    <th
                      onClick={() =>
                        setSortOrder(sortOrder === "↑" ? "↓" : "↑")
                      }
                    >
                      Selesai {sortOrder}
                    </th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTahuns?.map((a, index) => (
                    <tr key={a._id}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>{a.name}</td>
                      <td>{a.semester}</td>
                      <td>{convertDateTimeFormat(a.startDate)}</td>
                      <td>{convertDateTimeFormat(a.endDate)}</td>
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

      <TahunModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tahun={selectedTahun}
        token={token}
        refreshData={refresh}
      />
    </AuthLayouts>
  );
};

export default TahunList;
