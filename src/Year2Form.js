import React from 'react';
import Dashboard from './Dashboard';

function Year2({setLoggedIn}) {
  return (
    <div>
        <Dashboard setLoggedIn={setLoggedIn}/>
        <h1>Year 2 Form</h1>
    </div>
  );
}

export default Year2;