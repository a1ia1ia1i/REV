import './styling/registration.css'
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { login } from '../api'
import { AuthContext } from '../contexts/authcontext';

export default function LoginForm() {

// States for login
const [name, setName] = useState('');
const [password, setPassword] = useState('');
const { handleLogin } = useContext(AuthContext);
// States for checking the errors
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState(false);
const [authenticationError, setAuthError] = useState('');
const navigate = useNavigate();

// Checking Name
const handleName = (e) => {
setName(e.target.value);
setSubmitted(false);
};


// Checking password
const handlePassword = (e) => {
    setPassword(e.target.value);
    setSubmitted(false);
};

// Handling the form submission
const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPassword = password.trim();

    
    const processedName = trimmedName.replace(/\s/g, '');
    const processedPassword = trimmedPassword.replace(/\s/g, '');
    if (name === '' || password === '') {
    setError(true);
    } else {
        try{
            const response = await login(processedName, processedPassword);
            if (response.status === 202) {
                setSubmitted(true);
                setError(false);
                handleLogin(response.data.userID);
                navigate('/start');
            }
        } catch (error) {
            setAuthError('Unable to authenticate user');
        }
    }
};

// Showing success message
const successMessage = () => {
return (
<div
className="success"
style={{
display: submitted ? '' : 'none',
}}>
<h1>User {name} successfully logged in!!</h1>
</div>
);
};

// Showing error message if error is true
const errorMessage = () => {
return (
<div
className="error"
style={{
display: error ? '' : 'none',
}}>
<h1>Please enter all the fields</h1>
</div>
);
};

return (
<div className="form">


{/* Calling to the methods */}
<div className="messages">
{errorMessage()}
{successMessage()}
</div>

<form>
    <div class = "full-page-container">
    <div class="circle-container">
    <div class="form-elements">
{/* Labels and inputs for form data */}

<label className="label">Username</label>
<input onChange={handleName} className="input"
value={name} type="text" />

<label className="label">Password</label>
<input onChange={handlePassword} className="input"
value={password} type="password" />

<button onClick={handleSubmit} className="btn" type="submit">
Login
</button>
<p class = "swap">Don't have an account yet? <Link to = "/register"> Click Here</Link></p>
    </div>
    </div>
    </div>  
</form>
{authenticationError && <p>{authenticationError}</p>}
</div>
);
}