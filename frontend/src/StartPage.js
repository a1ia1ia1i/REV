import React from 'react';
import Dashboard from './Dashboard';


function Start({ setLoggedIn }) {
    
    return (
        
            <div>
                <Dashboard setLoggedIn={setLoggedIn}/>
                <h1>Hello?</h1>
            </div>
        
    );
}

export default Start;