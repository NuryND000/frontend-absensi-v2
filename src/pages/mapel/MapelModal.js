import React, { useState, useEffect, useRef } from "react";
import { createMapel, updateMapelById } from "../../services/mapelService";

const MapelModal = ({ isOpen, onClose, token, mapel, refreshData }) => {
  const [name, setName] = useState(mapel ? mapel.name : "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setName(mapel ? mapel.name : "");
  }, [mapel]);

  useEffect(() => {
    if (!isOpen) {
      setError("");
    } else {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama mapel tidak boleh kosong!");
      return;
    }

    setIsLoading(true);
    try {
      if (mapel) {
        await updateMapelById(token, mapel._id, { name });
      } else {
        await createMapel(token, { name });
      }
      setName("");
      onClose();
      refreshData();
    } catch (error) {
      setError("Gagal menyimpan data. Coba lagi.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className={`modal ${isOpen ? "is-active" : ""}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{mapel ? "Edit Mapel" : "Tambah Mapel"}</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label className="label">Nama Mapel</label>
            <div className="control">
              <input
                ref={inputRef}
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Masukkan nama mapel"
              />
            </div>
            {error && <p className="help is-danger">{error}</p>}
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success m-1" onClick={handleSubmit} disabled={isLoading}>
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

export default MapelModal;
