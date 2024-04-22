import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Start from './StartPage';
import LoginForm from './pages/Login';
import RegistrationForm from './pages/Registration';
import Header from './Header'
import './App.css';
import Year1 from './Year1';
import ReverseEvaluation from './pages/ReverseEvaluation';
import ProForma from './pages/proForma';
import Year2 from './Year2Form';
import Year3 from './Year3Form';
import Depreciation from './pages/depreciation';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Perform login logic, set loggedIn to true upon successful login
    setLoggedIn(true);
  };

  return (
    <div>
    <Header />
    <Router>
      <Routes>
        <Route path="/" element={loggedIn ? <Navigate to="/start" /> : <LoginForm isLoggedIn={handleLogin} />} />
        <Route path="/login" element={loggedIn ? <Navigate to="/start" /> : <LoginForm isLoggedIn={handleLogin} />} />
        <Route path="/start" element={loggedIn ? <Start setLoggedIn={setLoggedIn} /> : <Navigate to="/" />} />
        {/* Route for registration */}
        <Route path="/register" element={<RegistrationForm setLoggedIn={setLoggedIn}/>} />
        <Route path="/revForm" element={<ReverseEvaluation setLoggedIn={setLoggedIn}/> } />
        <Route path="/proForma" element={<ProForma setLoggedIn={setLoggedIn}/> } />
        <Route path="/year1" element={<Year1 setLoggedIn={setLoggedIn}/> } />
        <Route path="/year2" element={<Year2 setLoggedIn={setLoggedIn}/> } />
        <Route path="/year3" element={<Year3 setLoggedIn={setLoggedIn}/> } />
        <Route path="/depreciation" element={<Depreciation setLoggedIn={setLoggedIn}/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
