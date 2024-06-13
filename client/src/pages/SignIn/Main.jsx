import React, { useRef, useState } from "react";
import "../SignUp/_Main.scss";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { IoIosMail } from "react-icons/io";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Loader from "../../components/Icons/Loader";
import Toast from "../../components/Toast/Toast";

const SignIn = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastVisiblity, setToastVisibility] = useState({
    showToast: false,
    toastMessage: "",
    toastStatus: "",
  });

  const { showToast, toastMessage, toastStatus } = toastVisiblity;

  const navigate = useNavigate();

  const handleToast = (message, status) => {
    setToastVisibility({
      showToast: true,
      toastMessage: message,
      toastStatus: status,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailRef?.current?.value,
          password: passwordRef?.current?.value,
        }),
      });

      if (response.ok) {
        const { message, token } = await response?.json();
        handleToast(message, "Success");
        setLoading(false);
        localStorage.setItem("authToken", token);
        navigate("/admin");
      } else {
        const { message } = await response?.json();
        handleToast(message, "Error");
        setLoading(false);
        console.error("Failed to sign up:", response.statusText);
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <>
      <Header />
      <Toast
        setToastVisibility={setToastVisibility}
        showToast={showToast}
        toastMessage={toastMessage}
        toastStatus={toastStatus}
      />
      <section className="signup">
        <div className="screen-1">
          <svg
            className="logo"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            width="300"
            height="300"
            viewBox="0 0 640 480"
            xmlSpace="preserve"
          >
            <g
              className="inner-g"
              transform="matrix(3.31 0 0 3.31 320.4 240.4)"
            >
              <circle
                style={{
                  stroke: "rgb(0,0,0)",
                  strokeWidth: 0,
                  strokeDasharray: "none",
                  strokeLinecap: "butt",
                  strokeDashoffset: 0,
                  strokeLinejoin: "miter",
                  strokeMiterlimit: 4,
                  fill: "rgb(61,71,133)",
                  fillRule: "nonzero",
                  opacity: 1,
                }}
                cx="0"
                cy="0"
                r="40"
              />
            </g>
            <g transform="matrix(0.98 0 0 0.98 268.7 213.7)">
              <circle
                style={{
                  stroke: "rgb(0,0,0)",
                  strokeWidth: 0,
                  strokeDasharray: "none",
                  strokeLinecap: "butt",
                  strokeDashoffset: 0,
                  strokeLinejoin: "miter",
                  strokeMiterlimit: 4,
                  fill: "rgb(255,255,255)",
                  fillRule: "nonzero",
                  opacity: 1,
                }}
                cx="0"
                cy="0"
                r="40"
              />
            </g>
            <g transform="matrix(1.01 0 0 1.01 362.9 210.9)">
              <circle
                style={{
                  stroke: "rgb(0,0,0)",
                  strokeWidth: 0,
                  strokeDasharray: "none",
                  strokeLinecap: "butt",
                  strokeDashoffset: 0,
                  strokeLinejoin: "miter",
                  strokeMiterlimit: 4,
                  fill: "rgb(255,255,255)",
                  fillRule: "nonzero",
                  opacity: 1,
                }}
                cx="0"
                cy="0"
                r="40"
              />
            </g>
            <g transform="matrix(0.92 0 0 0.92 318.5 286.5)">
              <circle
                style={{
                  stroke: "rgb(0,0,0)",
                  strokeWidth: 0,
                  strokeDasharray: "none",
                  strokeLinecap: "butt",
                  strokeDashoffset: 0,
                  strokeLinejoin: "miter",
                  strokeMiterlimit: 4,
                  fill: "rgb(255,255,255)",
                  fillRule: "nonzero",
                  opacity: 1,
                }}
                cx="0"
                cy="0"
                r="40"
              />
            </g>
            <g transform="matrix(0.16 -0.12 0.49 0.66 290.57 243.57)">
              <polygon
                style={{
                  stroke: "rgb(0,0,0)",
                  strokeWidth: 0,
                  strokeDasharray: "none",
                  strokeLinecap: "butt",
                  strokeDashoffset: 0,
                  strokeLinejoin: "miter",
                  strokeMiterlimit: 4,
                  fill: "rgb(255,255,255)",
                  fillRule: "nonzero",
                  opacity: 1,
                }}
                points="-50,-50 -50,50 50,50 50,-50"
              />
            </g>
            <g transform="matrix(0.16 0.1 -0.44 0.69 342.03 248.34)">
              <polygon
                style={{
                  stroke: "rgb(0,0,0)",
                  strokeWidth: 0,
                  strokeDasharray: "none",
                  strokeLinecap: "butt",
                  strokeDashoffset: 0,
                  strokeLinejoin: "miter",
                  strokeMiterlimit: 4,
                  fill: "rgb(255,255,255)",
                  fillRule: "nonzero",
                  opacity: 1,
                }}
                vectorEffect="non-scaling-stroke"
                points="-50,-50 -50,50 50,50 50,-50"
              />
            </g>
          </svg>
          <div className="email">
            <label htmlFor="email">Email Address</label>
            <div className="sec-2">
              <IoIosMail />
              <input
                type="email"
                name="email"
                placeholder="Username@gmail.com"
                ref={emailRef}
              />
            </div>
          </div>
          <div className="password">
            <label htmlFor="password">Password</label>
            <div className="sec-2">
              <i
                style={{ width: 16, height: 16, marginTop: "-2px" }}
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
              </i>
              <input
                className="pas"
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="············"
                ref={passwordRef}
              />
              <span className="password-prompt-msg">
                Password must be at least 6 characters long and include at least
                one letter and one number
              </span>
            </div>
          </div>
          <button className="login" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader /> : "Login"}
          </button>
          <div className="footer">
            <Link to={"/signup"} style={{ textDecoration: "none" }}>
              <span>Sign Up</span>
            </Link>
            <span>Forgot Password?</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
