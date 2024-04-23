import React, {useContext} from 'react';
import NavigationBar from './NavigationBar';
import { AuthContext } from './contexts/authcontext';
import './navbar.css';


function Dashboard() {
  const { handleLogout } = useContext(AuthContext);
  
  

  return (
    <div className="dashboard">
      <NavigationBar />
      <button style={{ float: 'right' }} onClick={handleLogout}>Logout</button>
    </div>
    
  );
}

export default Dashboard;