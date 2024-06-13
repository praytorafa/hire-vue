import React, { useEffect, useRef, useState } from "react";
import styles from "./Modal.module.scss";
import { useNavigate } from "react-router-dom";

const AdminModal = ({ setShowModal }) => {
  const [error, setError] = useState(false);
  const [questions, setQuestions] = useState("");

  const inputRef = useRef(null);

  const navigate = useNavigate();

  const handleTextInput = (e) => {
    const value = e.target.value.trim();
    setQuestions(value);
  };

  const handleSubmit = async () => {
    const questionsArray = questions
      .split("\n")
      .map((question) => question.trim())
      .filter((question) => question !== "");
    try {
      const response = await fetch(
        "https://hire-vue.onrender.com/interview-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questions: questionsArray }),
        }
      );

      if (response.ok) {
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error sending interview questions:", error);
    }
  };

  return (
    <div className={styles["helper-modal-container"]}>
      <div
        className={styles["helper-modal-overlay"]}
        onClick={() => setShowModal(false)}
      ></div>
      <div
        style={{
          width: "50%",
          margin: "auto",
          height: "100vh",
          zIndex: 1000,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className={styles["modal-main"]}
      >
        <div className={styles["helper-modal"]}>
          <div className={styles.right}>
            <label className={styles.label}> Welcome ADMIN!</label>
            <h2 className={styles.header}>HIRE VUE</h2>

            <p className={styles.desc}>
              Please Enter your chosen questions needed for the interview
            </p>
            <div style={{ position: "relative", width: "100%" }}>
              <textarea
                placeholder="Input questions here"
                className={styles["textarea"]}
                onChange={handleTextInput}
                ref={inputRef}
              />
            </div>

            <button
              className={styles["get-started-btn"]}
              onClick={handleSubmit}
            >
              Get Started
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default AdminModal;
