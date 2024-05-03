import Signup from "./components/Signup.jsx";
import Signin from "./components/SIgn.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Upload from "./components/Upload.jsx";
import Home from "./components/Home.jsx";
import { useEffect, useState } from "react";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  

  useEffect(() => {
    const handleToken = () => {
      setToken(localStorage.getItem('token'));
    }
    window.addEventListener("storage", handleToken);
    return () => {
      window.removeEventListener("storage", handleToken);
    }
  },[])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="signup" element={<Signup />} />
          <Route path="signin" element={<Signin setToken={setToken} />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/" element={<Home token={token} setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
