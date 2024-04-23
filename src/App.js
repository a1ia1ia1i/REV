import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Start from './StartPage';
import LoginForm from './pages/Login';
import RegistrationForm from './pages/Registration';
import Header from './Header'
import './App.css';
import Year1 from './Year1';
import ProForma from './pages/proForma';
import Year2 from './Year2Form';
import Year3 from './Year3Form';
import { AuthContext } from './contexts/authcontext';
import ReverseEvaluation from './pages/ReverseEvaluation';
import Depreciation from './pages/depreciation';


function App() {
  const { isLoggedIn } = useContext(AuthContext);
  const { userID } = useContext(AuthContext);

  
  return (
    <div className="AppContainer">
    <Header />
    <Router>
        <Routes>
          <Route path="/" element={<LoginForm/>} />
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/start" element={isLoggedIn ? <Start/> : <Navigate to="/" />} />
          <Route path="/proForma" element={isLoggedIn ? <ProForma/> : <Navigate to="/" />} />
          <Route path="/revForm" element={isLoggedIn ? <ReverseEvaluation/> : <Navigate to="/"/>} />
          <Route path="/year1" element={isLoggedIn ? <Year1/> : <Navigate to="/" />} />
          <Route path="/year2" element={isLoggedIn ? <Year2/> : <Navigate to="/" />} />
          <Route path="/year3" element={isLoggedIn ? <Year3/> : <Navigate to="/" />} />
          <Route path="/depreciation" element={isLoggedIn ? <Depreciation/> : <Navigate to="/" />} />
        </Routes>

    </Router>
    </div>
  );
}

export default App;
