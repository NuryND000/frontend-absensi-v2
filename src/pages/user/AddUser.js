import React, { useState, useEffect } from "react";
import useAuth from "../../services/authService";
import { createUser } from "../../services/userService";
import { getKelas } from "../../services/kelasService.js";

const AddUser = ({ Role, close }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tmplahir, setTmplahir] = useState("");
  const [tgllahir, setTgllahir] = useState("");
  const [password, setPassword] = useState("");
  const [classes, setClasses] = useState([]);
  const [class_id, setClass] = useState(""); // Default string kosong
  const [role, setRole] = useState(Role); // Default role di set dari props
  const { token } = useAuth();

  // Fetch data kelas jika Role adalah "siswa"
  useEffect(() => {
    if (role === "siswa") {
      fetchKelas();
    }
  }, [role]);

  const fetchKelas = async () => {
    try {
      const response = await getKelas(token);
      setClasses(response);
    } catch (error) {
      console.error("Gagal mengambil data kelas:", error);
    }
  };

  const saveUser = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    try {
      await createUser(token, {
        username,
        name,
        alamat,
        tmplahir,
        tgllahir,
        password,
        role,
        class_id: role === "siswa" ? class_id : null, // Set class_id hanya jika siswa
      });
      alert("User berhasil ditambahkan");
      close(); // Menutup form/modal jika tersedia
    } catch (error) {
      console.error("Error saat menambahkan user:", error);
      alert("Gagal menambahkan user. Periksa kembali inputan Anda.");
    }
  };

  return (
    <section className="hero is-small">
      <div className="columns is-mobile is-centered">
        <div className="column is-half">
          <form onSubmit={saveUser}>
            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  <label className="label">{role === "siswa" ? "NISN" : role === "guru" ? "NIP" : "Username"}</label>
                  <div className="control">
                    <input
                      type="number"
                      className="input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Nama</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Lengkap"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Alamat</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Alamat lengkap"
                  required
                ></textarea>
              </div>
            </div>

            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  <label className="label">Tempat Lahir</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={tmplahir}
                      onChange={(e) => setTmplahir(e.target.value)}
                      placeholder="Tempat Lahir"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Tanggal Lahir</label>
                  <div className="control">
                    <input
                      type="date"
                      className="input"
                      value={tgllahir}
                      onChange={(e) => setTgllahir(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown untuk memilih role */}
            <div className="field">
              <label className="label">Role</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="admin">Admin</option>
                    <option value="guru">Guru</option>
                    <option value="siswa">Siswa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Menampilkan input Kelas jika role adalah siswa */}
            {role === "siswa" && (
              <div className="field">
                <label className="label">Kelas</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={class_id} onChange={(e) => setClass(e.target.value)} required>
                      <option value="">Pilih Kelas</option>
                      {classes.map((kelas) => (
                        <option key={kelas._id} value={kelas._id}>
                          {kelas.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button type="submit" className="button is-success mr-3">
                  Simpan
                </button>
                <button type="button" className="button" onClick={close}>
                  Batal
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddUser;
