import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './components/Home.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';

function App() {
  return (
    <>
        <div className="min-h-screen bg-cover bg-center bg-no-repeat">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
    </>
  );
}

export default App;
