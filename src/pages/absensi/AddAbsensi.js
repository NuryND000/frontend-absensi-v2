import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../services/authService.js";
import AuthLayouts from "../../layouts/AuthLayouts.jsx";
import { createAttendance } from "../../services/attendanceService.js";
import { getKelas } from "../../services/kelasService.js";
import { getMapel } from "../../services/mapelService.js";
import { getTahun } from "../../services/tahunAjarSevice.js";
import { getSiswaByKelasId } from "../../services/siswaService.js";
import { IoIosArrowDown } from "react-icons/io";
const AddAbsensi = () => {
  const [kelas_id, setKelas] = useState("");
  const [mapel_id, setMapel] = useState("");
  const [tahun_id, setTahun] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const { token, userId } = useAuth();
  const navigate = useNavigate();
  const kelasRef = useRef();
  const mapelRef = useRef();
  const tanggalRef = useRef();
  const siswaRefs = useRef([]);
  siswaRefs.current = []; // reset setiap render
  const [kelass, setKelass] = useState([]);
  const [mapels, setMapels] = useState([]);
  const [siswas, setSiswas] = useState([
    {
      siswa_id: "",
      keterangan: "",
      status: "h",
      absensi_id: "",
    },
  ]);
  useEffect(() => {
    getKelass();
    getMapels();
  }, []);

  const getSiswas = useCallback(
    async (kelasId) => {
      if (!kelasId) return;
      try {
        const response = await getSiswaByKelasId(token, kelasId);
        const sorted = response
          .sort((a, b) => a.name.localeCompare(b.name)) // Urutkan berdasarkan nama
          .map((siswa) => ({ ...siswa, status: "h", keterangan: "" })); // Set default status to 'h'
        setSiswas(sorted);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    },
    [token]
  );
  

  useEffect(() => {
    getSiswas(kelas_id);
  }, [kelas_id, getSiswas]);

  const addToRefs = (el) => {
    if (el && !siswaRefs.current.includes(el)) {
      siswaRefs.current.push(el);
    }
  };

  const getTahunAjar = async (tanggal) => {
    if (!tanggal) return;
    try {
      const response = await getTahun();
      const tahunAjar = response.find(
        (a) => a.startDate <= tanggal && a.endDate >= tanggal
      );
      if (tahunAjar) {
        setTahun(tahunAjar._id);
      } else {
        console.error("Tahun ajar tidak ditemukan");
      }
    } catch (error) {
      console.error("Error fetching tahun ajar:", error);
    }
  };

  const getKelass = async () => {
    const response = await getKelas();
    setKelass(response);
  };
  const getMapels = async () => {
    const response = await getMapel();
    setMapels(response);
  };

  const handleinputchange = (e, index) => {
    const { name, value } = e.target;
    const list = [...siswas];
    list[index][name] = value;
    setSiswas(list);
    console.log(siswas);
  };

  const handlestatuschange = (e, index) => {
    const value = e.target.value;
    const name = "status";
    const list = [...siswas];
    list[index][name] = value;
    setSiswas(list);

    console.log(siswas);
  };

  const saveAbsensi = async (e) => {
    e.preventDefault();

    // Validasi field utama
    if (!kelas_id) {
      kelasRef.current.focus();
      return alert("Kelas wajib diisi.");
    }
    if (!mapel_id) {
      mapelRef.current.focus();
      return alert("Mata pelajaran wajib diisi.");
    }
    if (!tanggal) {
      tanggalRef.current.focus();
      return alert("Tanggal wajib diisi.");
    }

    // Validasi setiap siswa: status harus diisi
    const invalidIndex = siswas.findIndex((siswa) => !siswa.status);
    if (invalidIndex !== -1) {
      siswaRefs.current[invalidIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      siswaRefs.current[invalidIndex]?.focus();
      return alert(`Status untuk ${siswas[invalidIndex].name} belum diisi.`);
    }

    // Jika valid
    try {
      const absensiData = {
        tanggal,
        user_id: userId,
        kelas_id,
        mapel_id,
        tahun_id,
        keterangan,
        detailAbsensi: siswas.map((siswa) => ({
          user_id: siswa._id,
          status: siswa.status,
          keterangan: siswa.keterangan,
        })),
      };

      await createAttendance(token, absensiData);
      navigate("/absensi");
    } catch (error) {
      console.error("Gagal menyimpan absensi:", error);
    }
  };

  return (
    <AuthLayouts name={"Absensi"}>
      <div className="columns mt-5 is-mobile is-multiline is-flex-wrap-wrap is-centered">
        <div className="column is-four-fifths ">
          <p class="title has-text-centered is-size-5">ABSENSI SISWA</p>
          <div class="field is-horizontal">
            <div class="field-body">
              <div className="field">
                <label className="label">KELAS</label>
                <div className="control">
                  <div className="custom-select-container">
                    <select
                      ref={kelasRef}
                      value={kelas_id}
                      onChange={(e) => {
                        setKelas(e.target.value);
                        getSiswas(e.target.value);
                      }}
                      className="custom-select"
                    >
                      <option value="">Pilih Kelas</option>
                      {kelass.map((kelas) => (
                        <option key={kelas._id} value={kelas._id}>
                          {kelas.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="custom-select-arrow">
                    <IoIosArrowDown />
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">MATA PELAJARAN</label>
                <div className="control">
                  <div className="custom-select-container">
                    <select
                      ref={mapelRef}
                      className="custom-select"
                      value={mapel_id}
                      onChange={(e) => setMapel(e.target.value)}
                    >
                      <option value="">Pilih Mata Pelajaran </option>
                      {mapels.map((mapel, index) => (
                        <option value={mapel._id}>{mapel.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="custom-select-arrow">
                    <IoIosArrowDown />
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">TANGGAL</label>
                <div className="control">
                  <input
                    type="datetime-local"
                    className="input date"
                    ref={tanggalRef}
                    value={tanggal}
                    onChange={(e) => {
                      setTanggal(e.target.value);
                      getTahunAjar(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-body">
              <div className="field">
                <label className="label">Keterangan</label>
                <div className="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="..."
                    value={keterangan}
                    onChange={(e) => {
                      setKeterangan(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="box mt-1 table-container "
            style={{
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <table className="table is-striped is-fullwidth is-narrow">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>H</th>
                  <th>I</th>
                  <th>S</th>
                  <th>A</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
  {siswas.map((e, index) => (
    <tr key={e._id}>
      <td>{e.name}</td>
      <td>
        <div className="control">
          <input
            ref={addToRefs}
            className="mr-1"
            type="radio"
            name={"status " + index}
            value="h"
            checked={e.status === "h"} // Set "H" as the default selected
            onChange={(e) => handlestatuschange(e, index)}
          />
        </div>
      </td>
      <td>
        <div className="control">
          <input
            className="mr-1"
            type="radio"
            name={"status " + index}
            value="i"
            checked={e.status === "i"}
            onChange={(e) => handlestatuschange(e, index)}
          />
        </div>
      </td>
      <td>
        <div className="control">
          <input
            className="mr-1"
            type="radio"
            name={"status " + index}
            value="s"
            checked={e.status === "s"}
            onChange={(e) => handlestatuschange(e, index)}
          />
        </div>
      </td>
      <td>
        <div className="control">
          <input
            className="mr-1"
            type="radio"
            name={"status " + index}
            value="a"
            checked={e.status === "a"}
            onChange={(e) => handlestatuschange(e, index)}
          />
        </div>
      </td>
      <td>
        <div className="control">
          <input
            type="text"
            className="input"
            name="keterangan"
            placeholder="keterangan"
            value={e.keterangan}
            onChange={(e) => handleinputchange(e, index)}
          />
        </div>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
          <div className="field">
            <div className="control">
              <button
                type="submit"
                onClick={saveAbsensi}
                className="button is-success mr-5"
              >
                Save
              </button>
              <Link to="/absensi" className="button">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayouts>
  );
};

export default AddAbsensi;
