import React, { useState, useEffect } from "react";
import { createMapel, updateMapelById } from "../../services/mapelService";
import { createTahun, updateTahunById } from "../../services/tahunAjarSevice";
import { IoIosArrowDown } from "react-icons/io";

const TahunModal = ({ isOpen, onClose, token, tahun, refreshData }) => {
  const [name, setName] = useState(tahun ? tahun.name : "");
  const [semester, setSemester] = useState(tahun ? tahun.semester : "");
  const [startDate, setStartDate] = useState(tahun ? tahun.startDate : "");
  const [endDate, setEndDate] = useState(tahun ? tahun.endDate : "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

useEffect(() => {
  if (tahun) {
    setName(tahun.name || "");
    setSemester(tahun.semester || "");
    setStartDate(tahun.startDate ? tahun.startDate.substring(0, 10) : "");
    setEndDate(tahun.endDate ? tahun.endDate.substring(0, 10) : "");
  } else {
    setName("");
    setSemester("");
    setStartDate("");
    setEndDate("");
  }
}, [tahun]);


  useEffect(() => {
    if (!isOpen) {
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tahun Ajar tidak boleh kosong!");
      return;
    }
    if (!semester.trim()) {
      setError("Semester tidak boleh kosong!");
      return;
    }
    if (!startDate.trim()) {
      setError("Tanggal Mulai tidak boleh kosong!");
      return;
    }
    if (!endDate.trim()) {
      setError("Tanggal Selesai tidak boleh kosong!");
      return;
    }
    setIsLoading(true);
    try {
      if (tahun) {
        await updateTahunById(token, tahun._id, {
          name,
          semester,
          startDate,
          endDate,
        });
      } else {
        await createTahun(token, { name, semester, startDate, endDate });
      }
      setName("");
      setSemester("");
      setStartDate("");
      setEndDate("");
      onClose();
      refreshData();
    } catch (error) {
      setError("Gagal menyimpan data. Coba lagi.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`modal ${isOpen ? "is-active" : ""}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            {tahun ? "Edit Tahun Ajar" : "Tambah Tahun Ajar"}
          </p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label className="label">Tahun Ajar</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan Tahun Ajar"
              />
            </div>
            {error && <p className="help is-danger">{error}</p>}
          </div>
          <div className="field">
            <label className="label">Semester</label>
            <div className="control">
              <div className="custom-select-container">
                <select
                  className="custom-select"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">Pilih Semester </option>
                  <option value="Ganjil">Ganjil </option>
                  <option value="Genap">Genap </option>
                </select>
              </div>
              <div className="custom-select-arrow">
                <IoIosArrowDown />
              </div>
            </div>
            {error && <p className="help is-danger">{error}</p>}
          </div>
          <div className="field">
            <label className="label">Tanggal Mulai</label>
            <div className="control">
              <input
                type="date"
                className="input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            {error && <p className="help is-danger">{error}</p>}
          </div>
          <div className="field">
            <label className="label">Tanggal Selesai</label>
            <div className="control">
              <input
                type="date"
                className="input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {error && <p className="help is-danger">{error}</p>}
          </div>
        </section>
        <footer className="modal-card-foot">
          <button
            className="button is-success m-1"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Menyimpan..." : "Simpan"}
          </button>

          <button className="button m-1" onClick={onClose}>
            Batal
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TahunModal;
