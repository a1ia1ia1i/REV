import React from 'react';
import logo from './RevLogo.webp';
import './navbar.css';
function Header() {
  return (
    <div className="header">
      <img src={logo} style={{ maxWidth: '10%', maxHeight: '50%'}} alt="RevYourStartup Logo" />
      
    </div>
  );
}

export default Header;