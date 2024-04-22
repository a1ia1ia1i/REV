import { useState } from 'react';
import { Link } from 'react-router-dom';
import './styling/registration.css'
import { register } from '../api';

export default function RegistrationForm() {

// States for registration
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// States for checking the errors
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState(false);

// Handling the name change
const handleName = (e) => {
setName(e.target.value);
setSubmitted(false);
};

// Handling the email change
const handleEmail = (e) => {
setEmail(e.target.value);
setSubmitted(false);
};

// Handling the password change
const handlePassword = (e) => {
setPassword(e.target.value);
setSubmitted(false);
};

// Handling the form submission
const handleSubmit = async (e) => {
e.preventDefault();
if (name === '' || email === '' || password === '') {
setError(true);
} else {
    try{
        const response = await register(name, email, password);
        if (response.status === 201) {
            setSubmitted(true);
            setError(false);
        }

    } catch (error) {
        setError(true);
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
<h1>User {name} successfully registered!!</h1>
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
<div>
<h1>User Registration</h1>
</div>

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

<label className="label">Email</label>
<input onChange={handleEmail} className="input"
value={email} type="email" />

<label className="label">Password</label>
<input onChange={handlePassword} className="input"
value={password} type="password" />

<button onClick={handleSubmit} className="btn" type="submit">
Submit
</button>
<p class = "swap">Already signed up? <Link to = "/login"> Click Here</Link></p>
    </div>
    </div>
    </div>  
</form>
</div>
);
}