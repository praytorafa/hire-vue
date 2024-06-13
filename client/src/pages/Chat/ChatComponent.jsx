import React, { useState, useEffect, useRef } from "react";
import bot from "../../assets/lunabot1.png";
import user from "../../assets/user.png";
import send from "../../assets/send.png";
import "./ChatComponent.scss";
import CopyIcon from "../../components/Icons/CopyIcon";
import CheckCircle from "../../components/Icons/CheckCircle";
import Header from "../../components/Header/Header";
import KeepWebsiteAlive from "../../components/KeepWebsiteAlive";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Icons/Loader";
import Toast from "../../components/Toast/Toast";

const ChatComponent = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [isProcessingResponse, setIsProcessingResponse] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [isLoading, setIsLoading] = useState({
    requestLoading: false,
    hideTextArea: false,
  });
  const [toastVisiblity, setToastVisibility] = useState({
    showToast: false,
    toastMessage: "",
    toastStatus: "",
  });
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  KeepWebsiteAlive();

  const navigate = useNavigate();
  const typingTextRef = useRef(null);
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const completionContainerRef = useRef(null);
  const lastMessageRef = useRef(null);

  const { requestLoading, hideTextArea } = isLoading;
  const { showToast, toastMessage, toastStatus } = toastVisiblity;

  const handleToast = (message, status) => {
    setToastVisibility({
      showToast: true,
      toastMessage: message,
      toastStatus: status,
    });
  };

  const capitalizeFirstTwoLetters = (str) => {
    return str
      .split(" ")
      .map((word) => {
        const firstTwoLetters = word.slice(0, 1).toUpperCase();
        return firstTwoLetters;
      })
      .join("");
  };

  const userName = localStorage.getItem("hireVueClient");
  const orgName = localStorage.getItem("hireVueOrgName");
  const token = localStorage.getItem("hireVueClientToken");

  function typedText(element, text) {
    setIsProcessingResponse(true);

    let index = 0;

    let interval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
        setIsProcessingResponse(false);
      }
    }, 20);
  }

  const generateUniqueId = () => {
    const timeStamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timeStamp}-${hexadecimalString}`;
  };

  useEffect(() => {
    // Fetch interview questions for the candidate's organization
    fetch(`/interview-questions/${orgName}`, {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInterviewQuestions(data.interviewQuestions);
      })
      .catch((error) => {
        console.error("Error fetching interview questions:", error);
      });
  }, [orgName, token]);

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    completionContainerRef?.current?.classList.add("hidden");

    typingTextRef?.current?.classList.add("hidden");

    if (inputValue.trim() === "") {
      alert("Empty prompt");
      return;
    }

    setInputValue("");

    setChatMessages((prevMessages) => [
      ...prevMessages,
      { isAi: false, message: inputValue },
    ]);

    const uniqueId = generateUniqueId();

    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        isAi: true,
        message: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <circle cx="18" cy="12" r="0" fill="currentColor">
              <animate
                attributeName="r"
                begin=".67"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle cx="12" cy="12" r="0" fill="currentColor">
              <animate
                attributeName="r"
                begin=".33"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle cx="6" cy="12" r="0" fill="currentColor">
              <animate
                attributeName="r"
                begin="0"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
          </svg>
        ),
        uniqueId,
      },
    ]);

    try {
      const response = await fetch("http://localhost:5000", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          prompt: inputValue,
          organizationName: orgName,
        }),
      });

      const messageDiv = document.getElementById(uniqueId);

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        messageDiv.innerHTML = "";
        typedText(document.getElementById(uniqueId), parsedData);

        if (
          chatMessages.filter((msg) => !msg.isAi).length ===
          interviewQuestions.length - 1
        ) {
          setIsLastQuestion(true);
        }

        if (isLastQuestion) {
          const score = Math.floor(Math.random() * 101);
          const finalMessage = `Thank you, this interview is now concluded. You have scored ${score} percent`;

          setChatMessages((prevMessages) => [
            ...prevMessages,
            { isAi: false, message: inputValue },
            { isAi: true, message: finalMessage, uniqueId: generateUniqueId() },
          ]);
        }

        // Check if response contains "interview is concluded" and extract score
        const wordsToCheck = ["interview", "concluded"];

        let count = 0;
        for (const word of wordsToCheck) {
          if (parsedData.includes(word)) {
            count++;
            console.log("it includes");
          }
        }

        if (count >= 2) {
          console.log("count is 2");
          const scoreMatch = parsedData.match(/(\d+)%/);
          if (scoreMatch) {
            const score = scoreMatch[1];

            setTimeout(() => {
              setIsLoading({
                hideTextArea: true,
                requestLoading: true,
              });
            }, 2000);

            // Send PATCH request to update candidate details
            const updateResponse = await fetch(
              `http://localhost:5000/interview-questions/${orgName}`,
              {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json",
                  Authorization: `${token}`,
                },
                body: JSON.stringify({ score }),
              }
            );

            if (updateResponse.ok) {
              setIsLoading((prevValues) => ({
                ...prevValues,
                requestLoading: false,
              }));
              navigate("/interview-done");
            } else {
              setIsLoading((prevValues) => ({
                ...prevValues,
                requestLoading: false,
              }));
              handleToast("There was an error saving your details", "Error");
              console.error("Failed to update interview score.");
              setTimeout(() => {
                navigate("/interview-done");
              }, 2000);
            }
          }
        }
      } else {
        if (response.status === 429) {
          messageDiv.innerHTML =
            "Oops! 😓 You have exhausted your API credits. On the bright side, you can tell the application works.";
        } else {
          messageDiv.innerHTML = "Houston, we have a problem! 🤯🤯";
        }
      }
    } catch (error) {
      const messageDiv = document.getElementById(uniqueId);
      console.error("Error:", error);
      if (messageDiv) {
        messageDiv.innerHTML = "Houston, we have a problem! 🤯🤯";
      }
    }
  };

  const text =
    "Hi there! I'm your interview assistant, ready to guide you through the process. Let's get started!";

  const speed = 30;
  let i = 0;

  function typeText() {
    setIsProcessingResponse(true);

    if (i < text.length) {
      typingTextRef.current.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeText, speed);
    } else {
      setTimeout(() => {
        setIsProcessingResponse(false);
      }, 10);
    }
  }

  useEffect(() => {
    typeText();

    return () => {};
  }, []);

  function handleClick(event, messageId) {
    const button = event.currentTarget;
    const div = button.parentNode;

    const text = div.querySelector(".message").textContent;
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);

    setTimeout(() => {
      setCopiedMessageId(null);
    }, 3000);
  }

  const handleButtonClick = (buttonText) => {
    setInputValue(buttonText);
    setButtonText(buttonText);
  };

  useEffect(() => {
    if (inputValue.length > 1) {
      if (inputValue.trim() === buttonText.trim()) {
        handleSubmit();
      }
    }
    return () => {};
  }, [buttonText]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const autoResize = () => {
    const formElement = formRef.current;
    const textareaElement = textareaRef.current;
    const height =
      textareaElement.scrollHeight - textareaElement.scrollHeight * 0.5;
    if (textareaElement.scrollHeight > 62) {
      formElement.style.height = `${textareaElement.scrollHeight - height}px`;
    }
  };

  return (
    <>
      {requestLoading && <Loader />}
      <Toast
        setToastVisibility={setToastVisibility}
        showToast={showToast}
        toastMessage={toastMessage}
        toastStatus={toastStatus}
      />
      <div className="chat-container-body">
        <Header />
        <div id="app">
          <div id="typing-text" className="wrapper ai" ref={typingTextRef}>
            <span className="profile ai"></span>
          </div>
          <div id="chat_container">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`wrapper ${msg.isAi ? "ai" : ""}`}
                ref={index === chatMessages.length - 1 ? lastMessageRef : null}
              >
                {msg.isAi && (
                  <button
                    id="btn"
                    onClick={(event) => handleClick(event, msg.uniqueId)}
                  >
                    {copiedMessageId === msg.uniqueId ? (
                      <CheckCircle className={"svg"} size={18} />
                    ) : (
                      <CopyIcon size={18} />
                    )}

                    {copiedMessageId === msg.uniqueId ? (
                      <span className="copy_float">Copied</span>
                    ) : (
                      ""
                    )}
                  </button>
                )}

                <div className="chat">
                  <div className="profile">
                    {msg.isAi ? (
                      ""
                    ) : userName ? (
                      <span className="username">
                        {capitalizeFirstTwoLetters(userName)}
                      </span>
                    ) : (
                      <img src={user} alt="user" />
                    )}
                  </div>
                  <div className="message" id={msg.uniqueId}>
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="form-container"
            style={{ display: hideTextArea && "none" }}
          >
            <form
              style={{ minHeight: "62px" }}
              onSubmit={handleSubmit}
              onInput={autoResize}
              ref={formRef}
              className="form"
            >
              <textarea
                name="prompt"
                rows="1"
                cols="1"
                placeholder="Type Response..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                ref={textareaRef}
                disabled={isProcessingResponse}
                className="textarea"
              />
              <button type="submit">
                {isProcessingResponse ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="18" cy="12" r="0" fill="currentColor">
                      <animate
                        attributeName="r"
                        begin=".67"
                        calcMode="spline"
                        dur="1.5s"
                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                        repeatCount="indefinite"
                        values="0;2;0;0"
                      />
                    </circle>
                    <circle cx="12" cy="12" r="0" fill="currentColor">
                      <animate
                        attributeName="r"
                        begin=".33"
                        calcMode="spline"
                        dur="1.5s"
                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                        repeatCount="indefinite"
                        values="0;2;0;0"
                      />
                    </circle>
                    <circle cx="6" cy="12" r="0" fill="currentColor">
                      <animate
                        attributeName="r"
                        begin="0"
                        calcMode="spline"
                        dur="1.5s"
                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                        repeatCount="indefinite"
                        values="0;2;0;0"
                      />
                    </circle>
                  </svg>
                ) : (
                  <img src={send} alt="Send" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatComponent;
