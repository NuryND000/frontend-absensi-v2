import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-confirm-alert/src/react-confirm-alert.css";
import GuestLayouts from "../../layouts/GuestLayouts.jsx";

const TentangTampil = () => {
  const [tentang, setTentang] = useState([]);
  useEffect(() => {
    getTentang();
  }, []);

  const getTentang = async () => {
    const response = await axios.get("http://localhost:5000/tentang");
    setTentang(response.data);
  };

  return (
    <GuestLayouts name={"tetang"}>
      <section class="hero is-link is-fullheight-with-navbar">
        <div class="hero-body">
    <div class="container has-text-centered">
          <p class="title">{tentang.name}</p>
          <p class="subtitle">{tentang.alamat}</p>

          <div className="columns mt-5 is-mobile is-centered">
            <div className="column is-four-fifths">
              <p>{tentang.deskripsi}</p>
            </div>
          </div>
          </div>
        </div>
      </section>
    </GuestLayouts>
  );
};

export default TentangTampil;
