import React from "react";
import { useNavigate } from "react-router-dom";
import "./styling/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate(); 

  const goToLoginPage = () => {
    navigate("/login"); 
  };
    return (
      <div className="landing-container">
        <nav className="navbar">
          <div className="logo">REVyourSTARTUP</div>
          <div className="nav-links">
            <a href="/home">Home</a>
            <a href="/about">About</a>
            <button className="get-started" onClick={goToLoginPage}>Get Started</button>
          </div>
        </nav>
        <header className="header-content">
          <h1>REVyourSTARTUP</h1>
          <h2>Reverse evaluation of your start up: </h2>
           <h2> Fast, Accurate, Everywhere.</h2>
          <div className="buttons">
            <button className="get-started" onClick={goToLoginPage}>Get Started</button>
            <button className="about-us">About Us</button>
          </div>
        </header>
      </div>
    );
  }
  
  export default LandingPage;