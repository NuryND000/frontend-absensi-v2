import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../services/authService.js";

const EditSiswa = () => {
  const [nisn, setNisn] = useState("");
  const [name, setName] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tmplahir, setTmplahir] = useState("");
  const [tgllahir, setTgllahir] = useState("");
  const [kelas_id, setKelas] = useState("guru");
  const navigate = useNavigate();
  const { id } = useParams();
  const [kelass, setKelass] = useState([]);
  const { token, axiosJWT } = useAuth();

  useEffect(() => {
    getSiswasById();
    getKelass();
  }, []);

  const getSiswasById = async () => {
    const response = await axios.get(`http://localhost:5000/siswas/${id}`);
    setNisn(response.data.nisn);
    setName(response.data.name);
    setAlamat(response.data.alamat);
    setTmplahir(response.data.tmplahir);
    setTgllahir(response.data.tgllahir);
    setKelas(response.data.kelas_id);
  };

  const getKelass = async () => {
    const response = await axios.get("http://localhost:5000/kelass");
    setKelass(response.data);
  };

  const updateSiswa = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/siswas/${id}`, {
        nisn,
        name,
        alamat,
        tmplahir,
        tgllahir,
        kelas_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/siswa");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section class="hero is-small">
      <div class="hero-body has-text-centered">
        <p class="title">Edit Data Siswa</p>
      </div>
      <div className="columns is-mobile is-centered">
        <div className="column is-half">
          <form onSubmit={updateSiswa}>
            <div class="field is-horizontal">
              <div class="field-body">
                <div className="field">
                  <label className="label">NISN</label>
                  <div className="control">
                    <input
                      type="number"
                      className="input"
                      value={nisn}
                      onChange={(e) => setNisn(e.target.value)}
                      placeholder="123"
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
                      placeholder="Name"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Alamat</label>
              <div className="control">
                <textarea
                  type="text"
                  className="input textarea"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Alamat"
                />
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-body">
                <div className="field">
                  <label className="label">Tempat Lahir</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={tmplahir}
                      onChange={(e) => setTmplahir(e.target.value)}
                      placeholder="Tempat Lahir"
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
                      placeholder="Tanggal Lahir"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Kelas</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={kelas_id}
                    onChange={(e) => setKelas(e.target.value)}
                  >
                    {kelass.map((kelas, index) => (
                      <option value={kelas._id}>{kelas.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button
                  type="submit"
                  className="button is-success mr-5"
                >
                  Update
                </button>
                <a
                  href="/siswa"
                  className="button"
                >
                  Cancel
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditSiswa;
