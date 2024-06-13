import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./AdminPanel.module.scss";
import copy from "../../assets/copy.svg";
import tick from "../../assets/tick.svg";
import Loader from "../../components/Icons/Loader";
import Toast from "../../components/Toast/Toast";

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");
  const [details, setDetails] = useState({
    nameValue: "",
    questionsValue: "",
  });
  const [toastVisiblity, setToastVisibility] = useState({
    showToast: false,
    toastMessage: "",
    toastStatus: "",
  });
  const [interviewData, setInterviewData] = useState(null);

  const companyRef = useRef(null);
  const questionsRef = useRef(null);
  const linkRef = useRef(null);

  const organizationName = localStorage.getItem("hirevueOrgName");

  const currentUrl = window.location.origin;
  const interviewLink = `${currentUrl}/${organizationName}`;

  const { showToast, toastMessage, toastStatus } = toastVisiblity;

  const { nameValue, questionsValue } = details;

  const handleToast = (message, status) => {
    setToastVisibility({
      showToast: true,
      toastMessage: message,
      toastStatus: status,
    });
  };

  const questionsArray = questionsValue
    .split("\n")
    .map((question) => question.trim())
    .filter((question) => question !== "");

  const alreadyExists = useMemo(() => {
    if (
      interviewData &&
      interviewData.organizationName === nameValue &&
      interviewData.interviewQuestions.join("\n") === questionsArray.join("\n")
    ) {
      return true; // Update if data matches
    } else {
      return false; // Submit if data is new
    }
  }, [nameValue, questionsValue]);

  const handleSubmit = async () => {
    const orgName = companyRef?.current?.value.trim();
    setLoading(true);
    const questionsArray = questionsRef?.current?.value
      .split("\n")
      .map((question) => question.trim())
      .filter((question) => question !== "");

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `http://localhost:5000/interview-questions/${orgName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            organizationName: companyRef?.current?.value.trim(),
            interviewQuestions:
              questionsRef?.current?.value.trim() !== "" && questionsArray,
          }),
        }
      );

      console.log("response is", response);

      if (response.ok) {
        setLoading(false);
        localStorage.setItem("hirevueOrgName", orgName);
        const { message } = await response?.json();
        handleToast(message, "Success");

        const interviewLink = `${currentUrl}/${orgName}`;
        setLink(interviewLink);
        setIsSuccess(true);
      } else {
        setLoading(false);
        const { message } = await response?.json();
        if (message) {
          handleToast(message, "Error");
        }
        const currentUrl = window.location.origin;
        const interviewLink = `${currentUrl}/${orgName}`;
        setLink(interviewLink);
      }
    } catch (error) {
      console.error("Error sending interview questions:", error);
      handleToast("Something went wrong", "Error");
    }
  };

  const handleUpdate = async () => {
    const orgName = companyRef?.current?.value.trim();
    setLoading(true);
    const questionsArray = questionsRef?.current?.value
      .split("\n")
      .map((question) => question.trim())
      .filter((question) => question !== "");

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `http://localhost:5000/interview-questions/${orgName}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newOrganizationName: companyRef?.current?.value.trim(),
            interviewQuestions: questionsArray,
          }),
        }
      );

      console.log("response is", response);

      if (response.ok) {
        setLoading(false);
        localStorage.setItem("hirevueOrgName", orgName);
        const { message } = await response?.json();
        handleToast(message, "Success");
        const currentUrl = window.location.origin;
        const interviewLink = `${currentUrl}/${orgName}`;
        setLink(interviewLink);
        setIsSuccess(true);
      } else {
        setLoading(false);
        // const { message } = await response?.json();
        handleToast(response?.statusText, "Error");
        setLink(interviewLink);
      }
    } catch (error) {
      console.error("Error updating interview questions:", error);
    }
  };

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(link);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  useEffect(() => {
    const fetchInterviewData = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await fetch(
          `http://localhost:5000/interview-questions/${organizationName}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          handleToast("Admin details fetched", "Success");
          const data = await response.json();
          setLink(interviewLink);
          setInterviewData(data);
          setDetails({
            nameValue: data.organizationName,
            questionsValue: data.interviewQuestions.join("\n"),
          });
        } else {
          const { message } = await response?.json();
          handleToast(message, "Error");
          console.error("Failed to fetch interview data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching interview data:", error);
      }
    };

    if (organizationName) {
      fetchInterviewData();
    }
  }, [organizationName]);

  return (
    <section className={styles.admin}>
      <Header />
      <Toast
        setToastVisibility={setToastVisibility}
        showToast={showToast}
        toastMessage={toastMessage}
        toastStatus={toastStatus}
      />
      <div className={styles["admin-inner"]}>
        <div className={styles.column}>
          <label>Organization Name</label>
          <input
            type="text"
            name="orgName"
            placeholder="E.g: Microsoft"
            ref={companyRef}
            onChange={(e) =>
              setDetails((prevValues) => ({
                ...prevValues,
                nameValue: e.target.value,
              }))
            }
            value={nameValue}
          />
        </div>
        <div className={styles.column}>
          <label>Interview Questions</label>
          <textarea
            type="text"
            name="questions"
            placeholder="Enter questions here"
            className={styles.panel}
            ref={questionsRef}
            onChange={(e) =>
              setDetails((prevValues) => ({
                ...prevValues,
                questionsValue: e.target.value,
              }))
            }
            value={questionsValue}
          />
        </div>
        {(isSuccess || interviewData) && (
          <div className={styles.column}>
            <label>Interview Link</label>
            <div className={styles["link_card"]}>
              <div className={styles["copy_btn"]} onClick={handleCopy}>
                <img src={copied ? tick : copy} alt="/" />
              </div>
              <p>{link ? link : "Link to be sent to candidates"}</p>
            </div>
          </div>
        )}

        <button
          className={styles.btn}
          onClick={interviewData ? handleUpdate : handleSubmit}
          disabled={loading || alreadyExists}
        >
          {loading ? <Loader /> : "Submit"}
        </button>
      </div>
    </section>
  );
};

export default AdminPanel;
