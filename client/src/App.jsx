import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage/MainPage";
import ChatComponent from "./pages/Chat/ChatComponent";
import SignUp from "./pages/SignUp/Main";
import SignIn from "./pages/SignIn/Main";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import SuccessPage from "./pages/SuccessPage/Main";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="chat" element={<ChatComponent />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="interview-done" element={<SuccessPage />} />
      </Routes>
    </>
  );
}

export default App;
