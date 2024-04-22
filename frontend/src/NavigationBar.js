import React from 'react';
import './navbar.css';

import { Link } from 'react-router-dom';

function NavigationBar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/revForm" target="_blank">Rev Form</Link></li>
        <li><Link to="/proForma" target="_blank">Pro Forma</Link></li>
        <li><Link to="/year1" target="_blank">Year 1 form</Link></li>
        <li><Link to="/depreciation" target="_blank">Depreciation form</Link></li>
        <li><Link to="/year2" target="_blank">Year 2 form</Link></li>
        <li><Link to="/year3" target="_blank">Year 3 form</Link></li>
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
}

export default NavigationBar;