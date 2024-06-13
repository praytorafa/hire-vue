import React, { useState, useEffect, useRef } from "react";
import bot from "../../assets/lunabot1.png";
import user from "../../assets/user.png";
import send from "../../assets/send.png";
import "./ChatComponent.scss";
import CopyIcon from "../../components/Icons/CopyIcon";
import CheckCircle from "../../components/Icons/CheckCircle";
import Header from "../../components/Header/Header";
import KeepWebsiteAlive from "../../components/KeepWebsiteAlive";

const ChatComponent = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [isProcessingResponse, setIsProcessingResponse] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  KeepWebsiteAlive();

  const typingTextRef = useRef(null);
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const completionContainerRef = useRef(null);

  const capitalizeFirstTwoLetters = (str) => {
    return str
      .split(" ")
      .map((word) => {
        const firstTwoLetters = word.slice(0, 1).toUpperCase();
        return firstTwoLetters;
      })
      .join("");
  };

  const userName = localStorage.getItem("lunaClient");

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

  // let loadInterval;

  // function loader(element) {
  //   element.textContent = "";

  //   loadInterval = setInterval(() => {
  //     element.textContent += ".";

  //     if (element.textContent === "....") {
  //       element.textContent = "";
  //     }
  //   }, 300);
  // }

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

    const hasReceivedValidResponse = localStorage.getItem(
      "hasReceivedValidResponse"
    );

    const uniqueId = generateUniqueId();

    if (hasReceivedValidResponse) {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          isAi: true,
          message:
            "⚠ ⚠I'm sorry, requests are being limited to one trial per person to save costs",
          uniqueId,
        },
      ]);
      return;
    } else {
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
    }

    // const response = {
    //   ok: true,
    //   json: async () => ({ bot: "Hello! I am a simulated response." }),
    // };

    try {
      const response = await fetch("https://hire-vue.onrender.com", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          prompt: inputValue,
        }),
      });

      const messageDiv = document.getElementById(uniqueId);

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        messageDiv.innerHTML = "";
        typedText(document.getElementById(uniqueId), parsedData);
        // localStorage.setItem("hasReceivedValidResponse", "true");
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
    <div className="chat-container-body">
      <Header />
      <div id="app">
        <div id="typing-text" className="wrapper ai" ref={typingTextRef}>
          <span className="profile ai"></span>
        </div>
        <div id="chat_container">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`wrapper ${msg.isAi ? "ai" : ""}`}>
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

        <div className="form-container">
          {!isProcessingResponse && chatMessages.length < 1 ? (
            <div
              className="completetion-container-main"
              ref={completionContainerRef}
            >
              <ButtonWithImage
                buttonText="What Is Artificial Intelligence?"
                onButtonClick={handleButtonClick}
              />
              <ButtonWithImage
                buttonText="Write a birthday wish for my friend"
                onButtonClick={handleButtonClick}
              />
              <ButtonWithImage
                buttonText="Give me a list of Instagram captions"
                onButtonClick={handleButtonClick}
              />
              <ButtonWithImage
                buttonText="Who was the best Roman emperor?"
                onButtonClick={handleButtonClick}
              />
            </div>
          ) : (
            ""
          )}
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
  );
};

export default ChatComponent;

const ButtonWithImage = ({ buttonText, onButtonClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const phoneScreenWidth = 700;
  const isPhoneScreen = window.innerWidth < phoneScreenWidth;

  return (
    <button
      className="completetion-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onButtonClick(buttonText)}
    >
      {buttonText}{" "}
      {isHovered && !isPhoneScreen ? <img src={send} alt="Send" /> : ""}
    </button>
  );
};
