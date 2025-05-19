import React, { useState, useEffect } from 'react';
import { getSiswa } from "../../services/siswaService.js";
import { getKelas } from "../../services/kelasService.js";
import { importUserUpdateKelas } from "../../services/userService.js";
import AuthLayouts from "../../layouts/AuthLayouts.jsx";
import useAuth from "../../services/authService.js";
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import ExcelJS from 'exceljs'; // Import ExcelJS

const SiswaExport = () => {
  const [selectedClass, setSelectedClass] = useState(""); // Menyimpan kelas yang dipilih
  const [selectedAngkatan, setSelectedAngkatan] = useState(""); // Menyimpan angkatan yang dipilih
  const [kelasList, setKelasList] = useState([]); // Menyimpan daftar kelas
  const [file, setFile] = useState(null); // Menyimpan file yang diunggah
  const { token } = useAuth(); // Token untuk autentikasi

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
    fetchKelas();
  }, [token]);

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
        let filteredSiswa = [];
        if (selectedClass) {
          // Filter berdasarkan kelas spesifik
          filteredSiswa = response.filter(
            (siswa) => siswa.class_id?.name === selectedClass
          );
        } else if (selectedAngkatan) {
          // Filter berdasarkan angkatan (misal 7, 8, atau 9)
          filteredSiswa = response.filter((siswa) => {
            const kelas = siswa.class_id?.name; // Misalnya '7a', '7b', dll.
            return kelas && kelas.startsWith(selectedAngkatan);
          });
        }

        // Pastikan data yang difilter ada
        if (filteredSiswa.length > 0) {
          // Membuat workbook dan worksheet menggunakan ExcelJS
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Data Siswa');

          // Menambahkan header ke worksheet
          worksheet.columns = [
            { header: 'username', key: 'username' },
            { header: 'Nama', key: 'name' },
            { header: 'Alamat', key: 'alamat' },
            { header: 'Tanggal Lahir', key: 'tgllahir' },
            { header: 'kelas', key: 'kelas' },
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
            });
          });

          // Menyimpan file Excel dan mengunduhnya
          worksheet.eachRow((row, rowNumber) => {
            row.alignment = { vertical: 'middle', horizontal: 'center' };
          });

          // Mendownload file Excel
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `data_siswa_${selectedClass || selectedAngkatan}.xlsx`; // Nama file sesuai kelas atau angkatan
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

      const response = await importUserUpdateKelas(formData); // Mengimpor file untuk update kelas
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
                <p className='is-size-7'>Perhatian. Pilih salah satu kelas atau angkatan</p>
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
                <p className='is-size-7'>Perhatian</p>
                <p className='is-size-7'>Header 'username' dan 'kelas' ditulis dengan huruf kecil</p>
                <p className='is-size-7'>Pastikan data username dan kelas terisi dengan benar sesuai data yang ada di Basis data</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AuthLayouts>
  );
};

export default SiswaExport;
