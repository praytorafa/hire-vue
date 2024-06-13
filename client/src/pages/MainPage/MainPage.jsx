import React, { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./MainPage.module.scss";
import Header from "../../components/Header/Header";
import Modal from "../../components/Modal/Modal";

const MainPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  if (showModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
  return (
    <>
      {showModal && <Modal showModal={showModal} setShowModal={setShowModal} />}
      <main className={styles.main}>
        <Header />
        <header className={styles["hero"]}>
          <h1>
            The best ever <br />
            <span>AI interviewer</span>
          </h1>

          <p>Interview 100x more candidates at once using AI</p>
          <div className="btn-lower">
            {/* <button onClick={() => navigate("/chat")}>Start Interview</button> */}
            <button onClick={() => setShowModal(!showModal)}>
              Start Interview
            </button>
            <p>
              Are you a recruiter? Check out <i>Interview Prep</i>
            </p>
          </div>
          <div className={styles["bg-grid-right"]}>
            <img
              src="https://assets-global.website-files.com/65fb502f8371aab95edce0e0/65fb502f8371aab95edce9f8_grid-main.svg"
              loading="lazy"
              alt=""
              class="bg-grid_img"
            />
            <div class="bg-grid_gradient"></div>
          </div>
        </header>
        <figure className={styles.video}>
          <div className={styles["bg-grid-left"]}>
            <img
              src="https://assets-global.website-files.com/65fb502f8371aab95edce0e0/65fb502f8371aab95edce9f8_grid-main.svg"
              loading="lazy"
              alt=""
              class="bg-grid_img"
            />
            <div class="bg-grid_gradient"></div>
          </div>
          <div className={styles["line"]}></div>
          <div className={styles["line"]}></div>
          <div className={styles["line"]}></div>
          <div className={styles["line"]}></div>
          <div className={styles["line"]}></div>
          <div className={styles["line"]}></div>
          <img
            src="https://assets-global.website-files.com/65fb502f8371aab95edce0e0/66071ea91f30fcaa46ec8dc0_Group%2033901%20(3).webp"
            loading="eager"
            data-w-id="dbcfd2cb-d93f-6acc-b77d-8cc49aa1cf5c"
            sizes="(max-width: 991px) 86vw, (max-width: 1439px) 87vw, 1160px"
            alt="Interview candidates async using AI"
            srcset="https://assets-global.website-files.com/65fb502f8371aab95edce0e0/66071ea91f30fcaa46ec8dc0_Group%2033901%20(3)-p-500.webp 500w, https://assets-global.website-files.com/65fb502f8371aab95edce0e0/66071ea91f30fcaa46ec8dc0_Group%2033901%20(3)-p-800.webp 800w, https://assets-global.website-files.com/65fb502f8371aab95edce0e0/66071ea91f30fcaa46ec8dc0_Group%2033901%20(3)-p-1080.webp 1080w, https://assets-global.website-files.com/65fb502f8371aab95edce0e0/66071ea91f30fcaa46ec8dc0_Group%2033901%20(3)-p-1600.webp 1600w, https://assets-global.website-files.com/65fb502f8371aab95edce0e0/66071ea91f30fcaa46ec8dc0_Group%2033901%20(3)-p-2000.webp 2000w, https://assets-global.website-files.com/65fb502f8371aab95edce0e0/66071ea91f30fcaa46ec8dc0_Group%2033901%20(3).webp 2268w"
            class="video_thumbnail"
          />
        </figure>
      </main>
    </>
  );
};

export default MainPage;
