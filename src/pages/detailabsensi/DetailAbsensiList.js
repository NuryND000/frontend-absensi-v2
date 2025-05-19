import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import GuestLayouts from "../../layouts/GuestLayouts";

const DetailAbsensiList = () => {
  const [absensis, setAbsensi] = useState([]);
  const [filteredAbsensis, setFilteredAbsensis] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    getAbsensis();
  }, []);

  useEffect(() => {
    filterAbsensis();
  }, [searchName, searchDate, absensis]);

  const getAbsensis = async () => {
    const response = await axios.get("http://localhost:5000/detailabsensis");
    setAbsensi(response.data);
  };

  const filterAbsensis = () => {
    let filtered = absensis;

    if (searchName) {
      filtered = filtered.filter((absensi) =>
        absensi.siswa[0].name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchDate) {
      filtered = filtered.filter((absensi) =>
        convertDateTimeFormat(absensi.absensi[0].tanggal).includes(searchDate)
      );
    }

    setFilteredAbsensis(filtered);
  };

  function convertDateTimeFormat(datetime) {
    const originalDate = new Date(datetime);
    const day = originalDate.getDate();
    const days = originalDate.getDay();
    const month = originalDate.getMonth();
    const year = originalDate.getFullYear();
    const hours = originalDate.getHours();
    const minutes = originalDate.getMinutes();

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

    const formattedDateTime = `${hari[days]}, ${day} ${bulan[month]} ${year} ${hours}:${minutes}`;
    return formattedDateTime;
  }

  const handleRowClick = (id) => {
    navigate(`/absensiShow/${id}`);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAbsensis.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredAbsensis.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <GuestLayouts name={"rekap"}>
      <div className="columns mt-5 is-mobile is-centered">
        <div className="column is-four-fifths">
          <div className="box mt-1">
            <div className="field is-grouped">
              <p className="control is-expanded">
                <input
                  className="input"
                  type="text"
                  placeholder="Search by name"
                  value={searchName}
                  onChange={handleSearchNameChange}
                />
              </p>
              <p className="control is-expanded">
                <input
                  className="input"
                  type="date"
                  placeholder="Search by date"
                  value={searchDate}
                  onChange={handleSearchDateChange}
                />
              </p>
            </div>
          </div>
          <div className="box mt-1 table-container">
            <table className="table is-striped is-fullwidth">
              <thead>
                <tr>
                  <th>NO</th>
                  <th>TANGGAL</th>
                  <th>NAMA</th>
                  <th>KETERANGAN</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((absensi, index) => {
                  const statusUpper = absensi.status.toUpperCase();
                  let rowClass = "";

                  if (statusUpper === "A") {
                    rowClass = "has-background-danger-light"; // Red background
                  } else if (statusUpper === "I") {
                    rowClass = "has-background-warning-light"; // Yellow background
                  }

                  return (
                    <tr
                      key={absensi._id}
                      className={rowClass}
                      onClick={() => handleRowClick(absensi.absensi[0]._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{convertDateTimeFormat(absensi.absensi[0].tanggal)}</td>
                      <td>{absensi.siswa[0].name}</td>
                      <td>{absensi.keterangan}</td>
                      <td>{statusUpper}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <nav className="pagination is-centered" role="navigation" aria-label="pagination">
              <ul className="pagination-list">
                {pageNumbers.map((number) => (
                  <li key={number}>
                    <button
                      onClick={() => handlePageChange(number)}
                      className={`pagination-link ${currentPage === number ? "is-current" : ""}`}
                    >
                      {number}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </GuestLayouts>
  );
};

export default DetailAbsensiList;
