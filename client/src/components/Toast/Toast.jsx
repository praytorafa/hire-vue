import React, { useEffect, useState } from "react";
import styles from "./Toast.module.scss";
import FailedIcon from "../Icons/FailedIcon";
import SuccessIcon from "../Icons/SuccessIcon";

const Toast = ({
  showToast,
  toastMessage,
  toastStatus,
  setToastVisibility,
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let activeTimerStart;
    let toastDisableTimer;
    let activeTimerOff;

    if (showToast) {
      activeTimerStart = setTimeout(() => {
        setIsActive(true);
      }, 50);

      activeTimerOff = setTimeout(() => {
        setIsActive(false);
      }, 5000);

      toastDisableTimer = setTimeout(() => {
        setToastVisibility((prevValues) => ({
          ...prevValues,
          showToast: false,
        }));
      }, 6000);
    }
    return () => {
      clearTimeout(activeTimerStart);
      clearTimeout(activeTimerOff);
      clearTimeout(toastDisableTimer);
    };
  }, [showToast]);

  return (
    <>
      {showToast && (
        <div
          className={`${styles.toast} ${
            styles[`${toastStatus?.toLocaleLowerCase()}`]
          } ${isActive ? styles.active : ""}`}
        >
          <i>
            {toastStatus === "Success" && <SuccessIcon />}
            {toastStatus === "Error" && <FailedIcon />}
          </i>
          <span>
            <h6>{toastStatus}</h6>
            <p>{toastMessage}</p>
          </span>
        </div>
      )}
    </>
  );
};

export default Toast;
