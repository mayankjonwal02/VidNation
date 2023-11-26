import React, { useEffect } from "react";
import { FcClapperboard } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  let navigate = useNavigate();
  const handlelogout = () => {
    localStorage.removeItem("email");
    navigate("/login");
  };

  const handlelogin = () => {
    navigate("/login");
  };
  return (
    <div style={{}}>
      <nav
        className="navbar navbar-expand-lg "
        style={{ background: "linear-gradient(to right, #FF99FF, #FF00CC)" }}
      >
        <div className="container-fluid ">
          <FcClapperboard size={60} className="ms-2"></FcClapperboard>

          <a className="navbar-brand text-white fw-bold fs-2 ms-3" href="#">
            VidNation
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto me-4 mb-2 mb-lg-0">
              <li className="nav-item">
                <div className="d-flex">
                  {!localStorage.getItem("email") ? (
                    <>
                      <button
                        className="fw-bold fs-5"
                        style={{
                          borderRadius: "10px",
                          backgroundColor: "#FFFFFF",
                          color: "#ff00ff ",
                          padding: "5px",
                          cursor: "pointer",
                          borderColor: "#ff00ff",
                        }}
                        onClick={() => {
                          handlelogin();
                        }}
                      >
                        Login
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="fw-bold fs-5"
                        style={{
                          borderRadius: "10px",
                          backgroundColor: "#FFFFFF",
                          color: "#ff00ff ",
                          padding: "5px",
                          cursor: "pointer",
                          borderColor: "#ff00ff",
                        }}
                        onClick={() => {
                          handlelogout();
                        }}
                      >
                        Logout
                      </button>
                    </>
                  )}
                  {/* <button
                    className="fw-bold fs-5"
                    style={{
                      borderRadius: "10px",
                      backgroundColor: "#FFFFFF",
                      color: "#ff00ff ",
                      padding: "5px",
                      cursor: "pointer",
                      borderColor: "#ff00ff",
                    }}
                  >
                    Login
                  </button> */}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
