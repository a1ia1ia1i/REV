import React from 'react';
import Dashboard from './Dashboard';


function Depreciation({setLoggedIn}) {
  return (
    <div>
        <Dashboard setLoggedIn={setLoggedIn}/>
        <h1>Depreciation Form</h1>
    </div>
  );
}

export default Depreciation;