import React from 'react';
import Dashboard from './Dashboard';


function RevForm({setLoggedIn}) {
  return (
    <div>
        <Dashboard setLoggedIn={setLoggedIn}/>
        <h1>Reverse Engineering Form</h1>
    </div>
  );
}

export default RevForm;