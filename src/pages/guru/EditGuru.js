import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../services/authService.js";

const EditGuru = () => {
  const [nip, setNip] = useState("");
  const [name, setName] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tmplahir, setTmplahir] = useState("");
  const [tgllahir, setTgllahir] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, axiosJWT } = useAuth();

  useEffect(() => {
    getGuruById();
  }, []);

  const getGuruById = async () => {
    const response = await axiosJWT.get(`http://localhost:5000/guru/${id}`);
    setNip(response.data.nip);
    setName(response.data.name);
    setAlamat(response.data.alamat);
    setTmplahir(response.data.tmplahir);
    setTgllahir(response.data.tgllahir);
  };

  const updateGuru = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.patch(`http://localhost:5000/guru/${id}`, {
        nip,
        name,
        alamat,
        tmplahir,
        tgllahir,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/guru");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section class="hero is-small">
      <div class="hero-body has-text-centered">
        <p class="title">Edit Data Guru</p>
      </div>
      <div className="columns is-mobile is-centered">
        <div className="column is-half">
          <form onSubmit={updateGuru}>
            <div class="field is-horizontal">
              <div class="field-body">
                <div className="field">
                  <label className="label">NIP</label>
                  <div className="control">
                    <input
                      type="number"
                      className="input"
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
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
              <div className="control">
                <button
                  type="submit"
                  className="button is-success mr-5"
                >
                  Update
                </button>
                <a
                  href="/guru"
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

export default EditGuru;
