import Header from "./Header";
import Home from "./Home/Home";
import Entry from "./Entry/Entry";
import Login from "./credentials/Login/Login";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Register from "./credentials/signup/Register";
function App(){
    const [token, setToken] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    return (
        <>
        <Header isLoggedIn={isLoggedIn} />
        <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn}/>}/>
            <Route path="/entries" element={<Entry token={token} isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={<Login setToken={setToken} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register/>} />
        </Routes>
        </>                                    
    )
}

export default App