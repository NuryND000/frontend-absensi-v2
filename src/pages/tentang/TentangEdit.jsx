import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AuthLayouts from "../../layouts/AuthLayouts";

const EditMapel = () => {
    const [id, setId] = useState("");
    const [nis, setNis] = useState("");
    const [name, setName] = useState("");
    const [alamat, setAlamat] = useState("");
    const [berdiri, setBerdiri] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const navigate = useNavigate();

  useEffect(() => {
    getTentang();
  }, []);

  const getTentang = async () => {
    const response = await axios.get("http://localhost:5000/tentang");
    setName(response.data.name);
    setNis(response.data.nis);
    setId(response.data._id);
    setAlamat(response.data.alamat);
    setBerdiri(response.data.berdiri);
    setDeskripsi(response.data.deskripsi);
  };
  const updateTentang = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/tentang/${id}`, {
        name,
        nis,
        alamat,
        berdiri,
        deskripsi
      });
      getTentang();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthLayouts name={"tentangEdit"}>
    <section class="hero is-small">
      <div class="hero-body has-text-centered">
        <p class="title">Edit Data Mapel</p>
      </div>
      <div className="columns is-mobile is-centered">
        <div className="column is-half">
          <form onSubmit={updateTentang}>
            <div class="field is-horizontal">
              <div class="field-body">
              <div className="field">
                  <label className="label">Nomor Induk Sekolah</label>
                  <div className="control">
                    <input
                      type="number"
                      className="input"
                      value={nis}
                      onChange={(e) => setNis(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Nama Sekolah</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
                  <label className="label">Tanggal Berdiri</label>
                  <div className="control">
                    <input
                      type="date"
                      className="input"
                      value={berdiri}
                      onChange={(e) => setBerdiri(e.target.value)}
                    />
                  </div>
                </div>
            <div class="field is-horizontal">
              <div class="field-body">
              <div className="field">
                  <label className="label">Alamat</label>
                  <div className="control">
                    <textarea
                      type="text" 
                      className="input textarea"
                      rows="10"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Deskripsi</label>
                  <div className="control">
                    <textarea
                      type="text"
                      className="input textarea"
                      rows="10"
                      value={deskripsi}
                      onChange={(e) => setDeskripsi(e.target.value)}
                    ></textarea>
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
    </AuthLayouts>
  );
};

export default EditMapel;
