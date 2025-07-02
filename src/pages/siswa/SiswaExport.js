import React, { useState, useEffect } from "react";
import { getSiswa } from "../../services/siswaService.js";
import { getKelas } from "../../services/kelasService.js";
import { importUserUpdateKelas } from "../../services/userService.js";
import AuthLayouts from "../../layouts/AuthLayouts.jsx";
import useAuth from "../../services/authService.js";
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import ExcelJS from "exceljs"; // Import ExcelJS
import { getTahun } from "../../services/tahunAjarSevice.js";

const SiswaExport = () => {
  const [selectedClass, setSelectedClass] = useState(""); // Menyimpan kelas yang dipilih
  const [selectedAngkatan, setSelectedAngkatan] = useState(""); // Menyimpan angkatan yang dipilih
  const [kelasList, setKelasList] = useState([]); // Menyimpan daftar kelas
  const [file, setFile] = useState(null); // Menyimpan file yang diunggah
  const { token } = useAuth(); // Token untuk autentikasi
  const [tahunList, setTahunList] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState("");
  const [jumlahSiswa, setJumlahSiswa] = useState(0);

  // Mengambil daftar kelas dari server saat komponen dimuat
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await getKelas(token);
        setKelasList(response); // Menyimpan kelas yang diterima
      } catch (error) {
        console.error("Gagal memuat data kelas", error);
      }
    };
    const fetchTahun = async () => {
      try {
        const response = await getTahun(token);
        setTahunList(response);
      } catch (error) {
        console.error("Gagal memuat data tahun ajar", error);
      }
    };

    fetchKelas();
    fetchTahun(); // ← panggil di sini
  }, [token]);

  useEffect(() => {
    const fetchFilteredSiswa = async () => {
      if (!selectedTahun || !selectedClass) {
        setJumlahSiswa(0); // reset kalau belum lengkap
        return;
      }

      try {
        const allSiswa = await getSiswa(token);

        const filtered = allSiswa.filter(
          (siswa) =>
            siswa.tahun_id?._id === selectedTahun &&
            siswa.class_id?.name === selectedClass,
        );

        setJumlahSiswa(filtered.length);
      } catch (err) {
        console.error("Gagal mengambil data siswa:", err);
        setJumlahSiswa(0);
      }
    };

    fetchFilteredSiswa();
  }, [selectedTahun, selectedClass, token]);

  // Fungsi untuk mengekspor data siswa dalam format Excel
  const handleExport = async () => {
    if (!selectedClass && !selectedAngkatan) {
      alert("Silakan pilih kelas atau angkatan terlebih dahulu.");
      return;
    }

    try {
      const response = await getSiswa(token); // Meminta data siswa secara umum
      if (response && response.length > 0) {
        // Filter berdasarkan kelas atau angkatan
        let filteredSiswa = response;

        // Filter tahun ajar dulu (jika dipilih)
        if (selectedTahun) {
          filteredSiswa = filteredSiswa.filter(
            (siswa) => siswa.tahun_id?._id === selectedTahun,
          );
        }

        // Filter kelas jika dipilih
        if (selectedClass) {
          filteredSiswa = filteredSiswa.filter(
            (siswa) => siswa.class_id?.name === selectedClass,
          );
        }

        // Filter angkatan jika dipilih (dan tidak pilih kelas)
        if (!selectedClass && selectedAngkatan) {
          filteredSiswa = filteredSiswa.filter((siswa) => {
            const kelas = siswa.class_id?.name;
            return kelas && kelas.startsWith(selectedAngkatan);
          });
        }

        // Pastikan data yang difilter ada
        if (filteredSiswa.length > 0) {
          // Membuat workbook dan worksheet menggunakan ExcelJS
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Data Siswa");

          // Menambahkan header ke worksheet
          worksheet.columns = [
            { header: "Username", key: "username" },
            { header: "Nama", key: "name" },
            { header: "Alamat", key: "alamat" },
            { header: "Tanggal Lahir", key: "tgllahir" },
            { header: "Kelas", key: "kelas" },
            { header: "Tahun", key: "tahun" },
          ];

          // Mengurutkan data siswa berdasarkan nama kelas lalu nama siswa
          filteredSiswa.sort((a, b) => {
            const kelasA = a.class_id?.name || "";
            const kelasB = b.class_id?.name || "";
            if (kelasA < kelasB) return -1;
            if (kelasA > kelasB) return 1;

            // Jika nama kelas sama, urutkan berdasarkan nama siswa
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          });

          // Menambahkan data siswa ke worksheet
          filteredSiswa.forEach((siswa) => {
            worksheet.addRow({
              username: siswa.username,
              name: siswa.name,
              alamat: siswa.alamat,
              tgllahir: new Date(siswa.tgllahir).toLocaleDateString(),
              kelas: siswa.class_id?.name || "Tidak ada kelas",
              tahun: siswa.tahun_id?.name || "Tidak ada tahun ajar",
            });
          });

          // Menyimpan file Excel dan mengunduhnya
          worksheet.eachRow((row, rowNumber) => {
            row.alignment = { vertical: "middle", horizontal: "center" };
          });

          // Mendownload file Excel
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `data_siswa_${selectedClass || selectedAngkatan || "tahun" + selectedTahun}.xlsx`;
            // Nama file sesuai kelas atau angkatan
            link.click(); // Mengunduh file Excel
          });
        } else {
          alert("Tidak ada data siswa yang ditemukan.");
        }
      } else {
        alert("Gagal mengekspor data.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengekspor data.");
    }
  };

  // Fungsi untuk mengunggah dan mengimpor file CSV untuk pembaruan data siswa
  const handleImport = async () => {
    if (!file) {
      alert("Silakan pilih file terlebih dahulu.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await importUserUpdateKelas(formData);
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
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengimpor data.");
    }
  };

  return (
    <AuthLayouts name="User Management">
      <div className="columns mt-5 is-mobile is-multiline is-centered m-2">
        <div className="column is-four-fifths">
          <div className="box">
            <p className="title has-text-centered is-4">
              Fitur pembaruan siswa masal untuk menangani kenaikan kelas
            </p>

            <div className="columns">
              {/* Export Siswa */}
              <div className="column">
                <h2 className="title is-5">Export Siswa</h2>
                {/* Dropdown Tahun Ajar */}
                <div className="field">
                  <div className="columns is-vcentered">
                    <div className="column is-narrow">
                      <label className="label">Pilih Tahun Ajar</label>
                    </div>
                    <div className="column">
                      <div className="select is-fullwidth is-small">
                        <select
                          value={selectedTahun}
                          onChange={(e) => setSelectedTahun(e.target.value)}
                        >
                          <option value="">-- Pilih Tahun Ajar --</option>
                          {tahunList.map((tahun) => (
                            <option key={tahun._id} value={tahun._id}>
                              {tahun.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dropdown untuk memilih Kelas */}
                <div className="field">
                  <div className="columns is-vcentered">
                    <div className="column is-narrow">
                      <label className="label">Pilih Kelas</label>
                    </div>
                    <div className="column">
                      <div className="select is-fullwidth is-small">
                        <select
                          value={selectedClass}
                          onChange={(e) => setSelectedClass(e.target.value)}
                        >
                          <option value="">-- Pilih Kelas --</option>
                          {kelasList.map((kelas) => (
                            <option key={kelas.id} value={kelas.name}>
                              -- {kelas.name} --
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dropdown untuk memilih Angkatan */}
                <div className="field">
                  <div className="columns is-vcentered">
                    <div className="column is-narrow">
                      <label className="label">Pilih Angkatan</label>
                    </div>
                    <div className="column">
                      <div className="select is-fullwidth is-small">
                        <select
                          value={selectedAngkatan}
                          onChange={(e) => setSelectedAngkatan(e.target.value)}
                        >
                          <option value="">-- Pilih Angkatan --</option>
                          <option value="7">Angkatan 7</option>
                          <option value="8">Angkatan 8</option>
                          <option value="9">Angkatan 9</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="is-size-7">
                  Perhatian. Pilih salah satu kelas atau angkatan
                </p>
                <div className="control mt-2">
                  <button
                    className="button is-warning is-small is-fullwidth-mobile"
                    onClick={handleExport}
                  >
                    Export Excel
                  </button>
                </div>
              </div>

              {/* Import Update */}
              <div className="column">
                <h2 className="title is-5">Import Update Siswa</h2>
                <div className="field is-grouped is-flex-wrap-wrap">
                  <div className="control ">
                    <div className="file is-info has-name is-small is-fullwidth-mobile">
                      <label className="file-label">
                        <input
                          className="file-input"
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                        <span className="file-cta">
                          <span className="file-icon">
                            <BsFileEarmarkArrowUp />
                          </span>
                          <span className="file-label">Pilih File</span>
                        </span>
                        <span className="file-name">
                          {file?.name || "Belum ada file dipilih"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="control">
                    <button
                      className="button is-info is-small is-fullwidth-mobile"
                      onClick={handleImport}
                    >
                      Upload
                    </button>
                  </div>
                </div>
                <p className="is-size-7">Perhatian</p>
                <p className="is-size-7">
                 Pastikan  Header 'Username', 'Kelas', dan 'Tahun'  diawali dengan huruf besar.
                </p>
                <p className="is-size-7">
                  Pastikan data username dan kelas terisi dengan benar sesuai
                  data yang ada di Basis data
                </p>

                {selectedTahun && selectedClass && (
                  <div className="notification is-info is-light mt-2">
                    Jumlah siswa di kelas <strong>{selectedClass}</strong> pada
                    tahun ajar{" "}
                    <strong>
                      {tahunList.find((t) => t._id === selectedTahun)?.name}
                    </strong>{" "}
                    adalah: <strong>{jumlahSiswa}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayouts>
  );
};

export default SiswaExport;
