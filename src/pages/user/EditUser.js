import React, { useState, useEffect } from "react";
import useAuth from "../../services/authService";
import { updateUserById, getUserById } from "../../services/userService";
import { getKelas } from "../../services/kelasService";

const EditUser = ({ user, close }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tmplahir, setTmplahir] = useState("");
  const [tgllahir, setTgllahir] = useState("");
  const [password, setPassword] = useState("");
  const [classes, setClasses] = useState([]);
  const [class_id, setClass] = useState("");
  const [role, setRole] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (user.role === "siswa") {
      fetchKelas();
    };
    if (user) {
      setUsername(user.username);
      setName(user.name);
      setRole(user.role);
      setAlamat(user.alamat);
      setTmplahir(user.tmplahir);
      const formattedDate = user.tgllahir ? new Date(user.tgllahir).toISOString().split("T")[0] : "";
    setTgllahir(formattedDate);
    setClass(user.class_id ? user.class_id._id.toString() : "");
    }
  }, [user]);

  const fetchKelas = async () => {
    try {
      const response = await getKelas(token);
      setClasses(response);
    } catch (error) {
      console.error("Gagal mengambil data kelas:", error);
    }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await updateUserById(token, user?._id, {
        username,
        name,
        alamat,
        tmplahir,
        tgllahir,
        ...(password && { password }),
        role,
        class_id: role === "siswa" ? class_id : null,
      });
      alert("User berhasil diperbarui");
      close();
    } catch (error) {
      console.error("Error saat mengupdate user:", error);
      alert("Gagal mengupdate user. Periksa kembali inputan Anda.");
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
                  <label className="label">{user.role === "siswa" ? "NISN" : "NIP"}</label>
                  <div className="control">
                    <input
                      type="number"
                      className="input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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

            {user.role === "siswa" && (
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
              <label className="label">Password (Opsional)</label>
              <div className="control">
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Isi jika ingin mengganti password"
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

export default EditUser;
