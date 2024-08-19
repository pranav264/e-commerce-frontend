import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import Home from "./Pages/Home";
import 'primeicons/primeicons.css';
import axios from "axios";
import { useEffect, useState } from "react";
const { REACT_APP_URL } = process.env;

function App() {
  const [username, setUsername] = useState("");

  const login = async () => {
    const response = await axios.post(`${REACT_APP_URL}/users/login`, {
      username: "Pranav234",
      password: "pranav456"
    });

    setUsername(response.data.username);
    sessionStorage.setItem("token", response.data.token);
  }

  useEffect(() => {
    login();
  },[])

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home username={username} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
