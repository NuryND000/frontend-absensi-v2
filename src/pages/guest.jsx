import React from "react";
import GuestLayouts from "../layouts/GuestLayouts.jsx";
import logo from "./../image/logo.png";

const ProfileGuest = () => {
  return (
    <GuestLayouts name="Guest Profile">
      <section className="hero is-fullwidth">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered m-3">
              <div className="column is-5">
                {/* Header */}
                <div className="has-text-centered mb-5">
                  <p className="has-text-weight-bold is-size-4 has-text-white">
                    UPT SMP NEGERI 3 SRENGAT
                  </p>
                  <figure className="image is-256x256 is-inline-block mt-4 is-hidden-mobile">
                    <img src={logo} alt="Logo Sekolah" />
                  </figure>
                  <figure className="image is-128x128 is-inline-block mt-4 is-hidden-tablet">
                    <img src={logo} alt="Logo Sekolah" />
                  </figure>
                </div>

                {/* Box Info Guest */}
                <div className="box ">
                  <div className="has-text-centered">
                    <p className="title is-5">Selamat datang!</p>
                    <p className="subtitle is-6">
                      Silakan Masuk untuk melihat data profil dan kehadiran.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GuestLayouts>
  );
};

export default ProfileGuest;
