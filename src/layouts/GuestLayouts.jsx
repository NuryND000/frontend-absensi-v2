import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-text-02.png";

export default function GuestLayouts({ name, children }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="container">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <img src={logo} alt="Logo" />
          </Link>

          {/* Hamburger menu for mobile */}
          <a
            role="button"
            className={`navbar-burger ${isActive ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            onClick={() => setIsActive(!isActive)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className={`navbar-menu ${isActive ? "is-active" : ""}`}>
          <div className="navbar-end">
            <div className="navbar-item">
              <Link to="/login" className="">
                <div className="is-flex is-align-items-center">
                  <span className="has-text-weight-bold has-text-white">
                    Masuk
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
