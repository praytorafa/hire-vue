import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage/MainPage";
import ChatComponent from "./pages/Chat/ChatComponent";
import SignUp from "./pages/SignUp/Main";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="chat" element={<ChatComponent />} />
        <Route path="signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
