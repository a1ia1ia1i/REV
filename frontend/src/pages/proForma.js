import React, { useState, useContext } from 'react';
import './styling/proforma.css';
import Dashboard from '../Dashboard';
import { AuthContext } from '../contexts/authcontext';
import { proFormaSubmit, proFormaGet } from '../api'
function ProForma() {
  const { mainFormID } = useContext(AuthContext);
  const [values, setValues] = useState({
    startYear: '',
    startMonth: '',
    startCapital: '',
    founder: '',
    year3goal: '',
    year1percent: '',
    year2percent: '',
    year3percent: '',
    year4percent: '',
    year5percent: '',
  });

  const [compensations, setCompensations] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMessage('');

    const allFieldsFilled = () => {
      return Object.values(values).every((value) => value.trim() !== '');
    };

    if (!allFieldsFilled()) {
      setErrorMessage('Please fill out all fields.');
    return;
    }
    
    const month = parseInt(values.startMonth);
    if (month < 1 || month > 12 || isNaN(month)) {
      setErrorMessage('Please enter a valid month (1-12).');
      return;
    }

    // Calculate compensations based on the inputs
    const calculatedCompensations = {
      year1: values.year3goal * (values.year1percent / 100),
      year2: values.year3goal * (values.year2percent / 100),
      year3: values.year3goal * (values.year3percent / 100),
      year4: values.year3goal * (values.year4percent / 100),
      year5: values.year3goal * ((values.year5percent / 100) * (values.year5percent / 100)), 
    };

    // Update the state to display the calculations
    setCompensations(calculatedCompensations);
    setIsSubmitted(true); // Set isSubmitted to true to switch to displaying the results
  };

  function getMonthName(monthNumber) {
    switch (monthNumber) {
      case '1': return 'January';
      case '2': return 'February';
      case '3': return 'March';
      case '4': return 'April';
      case '5': return 'May';
      case '6': return 'June';
      case '7': return 'July';
      case '8': return 'August';
      case '9': return 'September';
      case '10': return 'October';
      case '11': return 'November';
      case '12': return 'December';
      default: return 'Invalid Month';
    }
  }
  if (isSubmitted) {
    return (
      <div className="proForma-container">
      <div className="summary">
        <h3>Pro Forma Summary:</h3>
        <p>Founder: {values.founder}</p>
        <p>Starting Year: {values.startYear}</p>
        <p>Starting Month: {getMonthName(values.startMonth)}</p>
        <p>Starting Capital: ${values.startCapital}</p>
      </div>
      <div className="calculated-compensations">
        <h3>Calculated Compensations:</h3>
        <p>Year 1: {compensations.year1}</p>
        <p>Year 2: {compensations.year2}</p>
        <p>Year 3: {compensations.year3}</p>
        <p>Year 4: {compensations.year4}</p>
        <p>Year 5: {compensations.year5}</p>
      </div>
    </div>
    );
  } else {
    return (
      <>
      <Dashboard/>
      <form onSubmit={handleSubmit} className = "proForm">
      <label>
      <div className="form-row">
        Year: 
        <input type="number" name="startYear" value={values.startYear} onChange={handleChange} />
        </div>
      </label>
      <br />
      <label>
      <div className="form-row">
        Month (Enter 1 for January, 2 for February, etc): 
        <input type="number" name="startMonth" value={values.startMonth} onChange={handleChange} />
        </div>
      </label>
      <br />
      <label>
      <div className="form-row">
        Starting Capital: 
        <input type="number" step="0.001" name="startCapital" value={values.startCapital} onChange={handleChange} />
        </div>
      </label>
      <br />
      <label>
      <div className="form-row">
        Founder: 
        <input type="text" name="founder" value={values.founder} onChange={handleChange} />
        </div>
      </label>
      <br />
      <label>
      <div className="form-row">
        Expected year 3 compensation: 
        <input type="number" name="year3goal" value={values.year3goal} onChange={handleChange} />
        </div>
      </label>
      <br />
      <label>
      <div className="form-row">
        Expected year 1 compensation (as a % of year 3 (ex 33%)): 
        <input type="number" step="0.001" name="year1percent" value={values.year1percent} onChange={handleChange} />
        </div>
      </label>
      <br />
      <label>
      <div className="form-row">
        Expected year 2 compensation (as a % of year 3 (ex 33%)): 
        <input type="number" step="0.001" name="year2percent" value={values.year2percent} onChange={handleChange} />
        </div>
      </label>
      <br />
      <label>
      <div className="form-row">
        Expected year 3 compensation (as a % of year 3 (ex 33%)): 
        <input type="number" step="0.001" name="year3percent" value={values.year3percent} onChange={handleChange} />
        </div>
      </label>
      <br />
      <label>
      <div className="form-row">
        Expected year 4 compensation (as a % of year 3 (ex 33%)): 
        <input type="number" step="0.001" name="year4percent" value={values.year4percent} onChange={handleChange} />
        </div>
      </label>
      <br />
      <label>
      <div className="form-row">
        Expected year 5 compensation (as a % of year 3 (ex 33%)): 
        <input type="number" step="0.001" name="year5percent" value={values.year5percent} onChange={handleChange} />
        </div>
      </label>
      <br />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    <button type="submit">Submit</button>
    </form>
    </>
    );
  }
}

export default ProForma;