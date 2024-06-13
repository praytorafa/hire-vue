import React, { useEffect, useRef, useState } from "react";
import styles from "./Modal.module.scss";
import { useNavigate } from "react-router-dom";
import Loader from "../Icons/Loader";
import SuccessIcon from "../Icons/SuccessIcon";
import FailedIcon from "../Icons/FailedIcon";
import Toast from "../Toast/Toast";

const Modal = ({ showModal, setShowModal }) => {
  const [error, setError] = useState({
    nameError: false,
    emailError: false,
  });
  const [loading, setLoading] = useState(false);
  const [interviewLink, setInterviewLink] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [toastVisiblity, setToastVisibility] = useState({
    showToast: false,
    toastMessage: "",
    toastStatus: "",
  });

  const inputRef = useRef(null);
  const emailRef = useRef(null);
  const debounceRef = useRef(null);

  const navigate = useNavigate();

  const { nameError, emailError } = error;
  const { showToast, toastMessage, toastStatus } = toastVisiblity;

  useEffect(() => {
    const userName = localStorage.getItem("hireVueClient");
    if (userName) {
      const [firstName, lastName] = userName.split(" ");
      if (inputRef.current) {
        inputRef.current.value = `${firstName} ${lastName}`;
      }
    }
  }, []);

  const validateEmail = (emailAddress) => {
    const emailPattern =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?$/;
    return emailPattern.test(emailAddress);
  };

  const handleToast = (message, status) => {
    console.log("hittinggggg");
    setToastVisibility({
      showToast: true,
      toastMessage: message,
      toastStatus: status,
    });
  };

  const validateInterviewLink = async (organizationName) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/validateLink/${organizationName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsSuccess(true);
        setLoading(false);
      } else {
        setIsSuccess(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error validating interview link:", error);
    }
  };

  const handleLinkChange = (e) => {
    if (isSuccess === false) {
      setIsSuccess(null);
    }
    const link = e.target.value;
    setInterviewLink(link);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const organizationName = link.split("/").pop();
      setInterviewLink(organizationName);
      validateInterviewLink(organizationName);
    }, 2000);
  };

  const handleTextInput = (e) => {
    const value = e.target.value.trim();
    const words = value.split(/\s+/);
    if (nameError) {
      setError((prevValues) => ({
        ...prevValues,
        nameError: false,
      }));
    }
    if (words.length === 2) {
      e.target.value = words.slice(0, 2).join(" ");
    }
  };

  const handleEmailInput = () => {
    if (emailError) {
      setError((prevValues) => ({
        ...prevValues,
        emailError: false,
      }));
    }
  };

  const handleGetStarted = async () => {
    const value = inputRef.current.value.trim();
    const words = value.split(/\s+/);
    const [first, last] = words;

    if (!first || !last) {
      setError((prevValues) => ({
        ...prevValues,
        nameError: true,
      }));
    }

    if (!validateEmail(emailRef?.current?.value?.trim())) {
      setError((prevValues) => ({
        ...prevValues,
        emailError: true,
      }));
    }

    if (first && last && validateEmail(emailRef?.current?.value?.trim())) {
      setRequestLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/save-interview-data`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              organizationName: interviewLink,
              name: value,
              email: emailRef?.current?.value.trim(),
              score: 0,
            }),
          }
        );

        if (response.ok) {
          const { authToken } = await response?.json();
          localStorage.setItem("hireVueOrgName", interviewLink);
          localStorage.setItem("hireVueClient", value);
          localStorage.setItem("hireVueClientToken", authToken);
          setRequestLoading(false);
          navigate("/chat");
        } else {
          setRequestLoading(false);
          const { message } = await response?.json();
          handleToast(message, "Error");
        }
      } catch (error) {
        console.error("Error validating interview link:", error);
        handleToast("Something went wrong", "Error");
      }
    }
  };
  if (!showModal) {
    return null;
  } else
    return (
      <>
        <Toast
          setToastVisibility={setToastVisibility}
          showToast={showToast}
          toastMessage={toastMessage}
          toastStatus={toastStatus}
        />
        <div
          className={styles["helper-modal-container"]}
          onClick={() => setShowModal(false)}
        >
          <div className={styles["helper-modal-overlay"]}></div>
          <div
            style={{
              width: "50%",
              margin: "auto",
              zIndex: 1000,
              position: "relative",
            }}
            className={styles["modal-main"]}
          >
            <div
              className={styles["helper-modal"]}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.right}>
                <label className={styles.label}> AI Interview Assistant</label>
                <h2 className={styles.header}>HIRE VUE</h2>

                <p className={styles.desc}>
                  Please Enter your name to get started
                </p>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    placeholder="e.g. Elon Musk"
                    className={styles["name-input"]}
                    onChange={handleTextInput}
                    ref={inputRef}
                  />
                  {nameError ? (
                    <span className={styles["error-msg"]}>
                      Input should contain two names
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className={styles.link}>
                  <label>Email</label>
                  <input
                    placeholder="Enter your email address"
                    className={styles["name-input"]}
                    ref={emailRef}
                    type="email"
                    onChange={handleEmailInput}
                  />
                  {emailError ? (
                    <span
                      className={styles["error-msg"]}
                      style={{ bottom: "-25%" }}
                    >
                      Invalid email format
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className={styles.link}>
                  <label>Interview Link</label>
                  <div>
                    <input
                      placeholder="Enter your interview link here"
                      className={styles["name-input"]}
                      onChange={handleLinkChange}
                    />
                    {loading ? (
                      <Loader fill={"#3444da"} />
                    ) : isSuccess ? (
                      <SuccessIcon />
                    ) : isSuccess === false ? (
                      <FailedIcon />
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <button
                  className={styles["get-started-btn"]}
                  onClick={handleGetStarted}
                  disabled={!isSuccess}
                  style={{
                    display: requestLoading && "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {requestLoading ? (
                    <Loader size={20} fill={"white"} />
                  ) : (
                    "Get Started"
                  )}
                </button>
              </div>
            </div>
          </div>{" "}
        </div>
      </>
    );
};

export default Modal;
