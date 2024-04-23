        import React, { useState, useContext } from 'react';
        import './styling/depreciation.css'
        import Dashboard from '../Dashboard';
        import { AuthContext } from '../contexts/authcontext';
        import { depreciationGet, depreciationSubmit } from '../api'
        function Depcreciation() {
        const { mainFormID } = useContext(AuthContext);
        const [values, setValues] = useState({
        category: '',
        description: '',
        startYear: '',
        startMonth: '',
        valueAtTime: '',
        yearsLeft: '',
        salvageValue: '',
        method: '',
        });

        let methods = [
        {label: "Straight-Line", value: "Straight Line"}, 
        {label: "Sum of the Months", value: "Sum of the Months"},
        {label: "Double Declining Balance", value: "Double Declining Balance"}
        ]

        //let [method, setMethod] = useState("method")

        let handleMethodChange = (e) => {
        const newMethod = e.target.value;
        setValues((prevValues) => ({
            ...prevValues,
            method: newMethod
        }));
        };

        const [depreciations, setDepreciations] = useState({});
        const [monthlyDepreciations, setMonthlyDepreciations] = useState([]);
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

        let sumMonthsDepreciations = [];
        const monthlySumDepreciations = [];

        //Straight line method calculations
        if(values.method === "Straight Line"){
          let straightDepreciations = 0;
          for (let i = 0; i < 36; i++) {
            let depreciation = (values.valueAtTime - values.salvageValue) / (values.yearsLeft * 12);
            monthlyDepreciations.push(depreciation);
            straightDepreciations += depreciation;
          }

          monthlySumDepreciations.forEach((dep, index) => {
            sumMonthsDepreciations[`month${index + 1}`] = dep;
          });

          const calculatedStraightDepreciations = {
            offSheet: values.valueAtTime - values.salvageValue - straightDepreciations
          };
        setDepreciations(calculatedStraightDepreciations);
        }

         //this next section calculates the sum of the months method of depreciation
        if(values.method === "Sum of the Months"){
        const monthsLeft = values.yearsLeft * 12;
        let sumOfMonthDigits = (monthsLeft * (monthsLeft + 1)) / 2;
        let sumDepreciations = 0;
        for (let i = 0; i < 36; i++) {
          let totalMonths = monthsLeft - i;
          let depreciation = (values.valueAtTime - values.salvageValue) * (totalMonths) / sumOfMonthDigits;
          monthlyDepreciations.push(depreciation);
          sumDepreciations += depreciation;
      }
      monthlySumDepreciations.forEach((dep, index) => {
        sumMonthsDepreciations[`month${index + 1}`] = dep;
      });
      const calculatedSumDepreciations = {
          offSheet: values.valueAtTime - values.salvageValue - sumDepreciations
        };
        setDepreciations(calculatedSumDepreciations);
        setMonthlyDepreciations(monthlyDepreciations);
        }

        //calculates double declining method balance method
        if(values.method === "Double Declining Balance"){
        let depreciationRate = 2 / values.yearsLeft;
        let decliningDepreciation = 0;

        //year 1 counter
        for (let i = 0; i < 12; i++) {
          let depreciation = (values.valueAtTime * depreciationRate) / 12;
          monthlyDepreciations.push(depreciation);
          decliningDepreciation += depreciation;
        }
        let adjustedValueAfterYear1 = values.valueAtTime - decliningDepreciation;

        //year 2 counter
        for (let i = 0; i < 12; i++) {
          let depreciation = (adjustedValueAfterYear1 * depreciationRate) / 12;
          monthlyDepreciations.push(depreciation);
          decliningDepreciation += depreciation;
        }
        let adjustedValueAfterYear2 = values.valueAtTime - decliningDepreciation;

        //year 3 counter
        for (let i = 0; i < 12; i++) {
          let depreciation = (adjustedValueAfterYear2 * depreciationRate) / 12;
          monthlyDepreciations.push(depreciation);
          decliningDepreciation += depreciation;
        }
        const calculatedDecliningDepreciations = {
          offSheet: values.valueAtTime - values.salvageValue - decliningDepreciation
        };
        setDepreciations(calculatedDecliningDepreciations);
        }
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
            <h3>Depreciation Summary:</h3>
            <p>Category: {values.category}</p>
            <p>Description: {values.description}</p>
            <p>Starting Month: {getMonthName(values.startMonth)}</p>
            <p>Starting Year: {values.startYear}</p>
            <p>Value at Start Time: ${values.valueAtTime}</p>
            <p>Salvage Value: ${values.salvageValue}</p>
            <p>Depreciation Method: {values.method}</p>
            <p>Off Sheet: ${Math.round(depreciations.offSheet * 100) / 100}</p>
          </div>
          <div className="calculated-depreciation">
          <h1>Monthly Depreciation Details</h1>
            <ul>
                {Object.entries(monthlyDepreciations).map(([month, value], index) => (
                    <li key={index}>
                        <p>Month: {index + 1}: ${value.toFixed(2)}</p>
                    </li>
                ))}
            </ul>
        </div>
        </div>
        );
        }
        else{

        return (
        <div>
        <Dashboard />
        <form onSubmit={handleSubmit} className = "proForm">
        <label>
        <div className="form-row">
          Category: 
          <input type="text" name="category" value={values.category} onChange={handleChange} />
          </div>
        </label>
        <br />
        <label>
        <div className="form-row">
          Description: 
          <input type="text" name="description" value={values.description} onChange={handleChange} />
          </div>
        </label>
        <br />    
        <label>
        <div className="form-row">
          First Year Used: 
          <input type="number" name="startYear" value={values.startYear} onChange={handleChange} />
          </div>
        </label>
        <br />
        <label>
        <div className="form-row">
          First Month Used (Enter 1 for January, 2 for February, etc): 
          <input type="number" name="startMonth" value={values.startMonth} onChange={handleChange} />
          </div>
        </label>
        <br />
        <label>
        <div className="form-row">
          Value at Start Time: 
          <input type="number" name="valueAtTime" value={values.valueAtTime} onChange={handleChange} />
          </div>
        </label>
        <br />
        <label>
        <div className="form-row">
          Number of Years Left: 
          <input type="number" name="yearsLeft" value={values.yearsLeft} onChange={handleChange} />
          </div>
        </label>
        <br />
        <label>
        <div className="form-row">
          Salvage Value: 
          <input type="number" name="salvageValue" value={values.salvageValue} onChange={handleChange} />
          </div>
        </label>
        <br />
        <label>
        <div className="form-row">
          Depreciation Method: 
          <select onChange = {handleMethodChange}>
            {
                
            }
            <option hidden disabled selected value = "method">Select a Depreciation Method</option>
            {methods.map((method) => <option key={method.label} value={method.value}>{method.label}</option>)}
          </select>
          </div>
        </label>
        <br />
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit">Submit</button>
        </form>
        </div>
        );
        }
        }

        export default Depcreciation;