import React, { useState } from "react";
import { FcClapperboard } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  let navigate = useNavigate();
  const handleclick = () => {
    navigate("/login");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (email.includes("@")) {
        if (password === confirmpassword) {
          let responce = await fetch(
            "http://172.31.31.124:5000/api/createuser",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                password: password,
              }),
            }
          );

          let json = await responce.json();
          if (json.success) {
            navigate("/login");
            alert(json.message);
          } else {
            alert(json.message);
          }
        } else {
          alert("password mismatch");
        }
      } else {
        alert("invalid email");
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div>
      <div
        style={{
          background: "linear-gradient(to right, #FF99FF, #FF00CC)",
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div className="text-white fs-1 fw-bold p-5 d-flex align-items-center">
          <FcClapperboard className="" size={90} />
          <div className="d-inline">
            <div
              className="d-lg-inline d-block ms-3 "
              style={{ fontSize: "5vh" }}
            >
              VidNation
            </div>
          </div>
        </div>
        <div
          className="container"
          style={{ maxWidth: "500px", margin: "50px" }}
        >
          <div className="card " style={{}}>
            <div className="card-body">
              <h5
                className="card-title fw-bold text-center fs-1"
                style={{ color: "#8b008b" }}
              >
                Register
              </h5>
              <form style={{ marginTop: "25px" }}>
                <div className="mb-3">
                  {/* <label
                    htmlFor="exampleInputEmail1"
                    className="form-label"
                    style={{ marginTop: "15px" }}
                  >
                    Email address
                  </label> */}
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                  />
                  <div id="emailHelp" className="form-text">
                    We'll never share your email with anyone else.
                  </div>
                </div>
                <div className="mb-3 d-flex">
                  {/* <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label> */}
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleTogglePassword}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div className="mb-3 pt-3 d-flex">
                  {/* <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label> */}
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Confirm Password"
                    value={confirmpassword}
                    onChange={(e) => setconfirmpassword(e.target.value)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleToggleConfirmPassword}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="container d-flex justify-content-center p-4">
                  <button
                    // type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>
              <Link to="/login" className="card-link">
                <p className="text-center">Already Registered !!</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
