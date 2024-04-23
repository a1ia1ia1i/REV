import React, { useState, useEffect, useContext } from 'react';

import RevenueChart from './ RevenueChart';

import "./styling/Rev.css"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { openPdfWindow } from './PdfGenerator';
import Dashboard from '../Dashboard';
import { AuthContext } from '../contexts/authcontext';
import { revFormSubmit, revFormGet } from '../api'

function ReverseEvaluation() {
  const { mainFormID } = useContext(AuthContext);
  const [lastYearsRevenue, setLastYearsRevenue] = useState(0);
  const [amountNeeded, setAmountNeeded] = useState(0);
  const [totalMarket, settotalMarket] = useState(0);
  const [multiplierExpected, setMultiplierExpected] = useState('');
  const [equityPercentage, setEquityPercentage] = useState('');
  const [revenueMultiplierExit, setRevenueMultiplierExit] = useState('');
  const [growthProjection, setGrowthProjection] = useState('');
  const [forceTo, setForceTo] = useState(new Array(6).fill(''));

  

  const amountHopedForExit = parseFloat(amountNeeded) * parseFloat(multiplierExpected);
  const companyWorthAtYear3 = amountHopedForExit / (parseFloat(equityPercentage) / 100);
  const revenueNeededYear3 = companyWorthAtYear3 / parseFloat(revenueMultiplierExit);
  
  const calculatedGrowthProjection = lastYearsRevenue > 0 
    ? Math.pow((revenueNeededYear3 / lastYearsRevenue), 1/3) * 100 
    : growthProjection;
  
  // Calculations for Effective Interest
  const effectiveInterest3Years = amountNeeded > 0 ? (Math.pow((amountHopedForExit / amountNeeded), 1 / 3) - 1) : "-";
  const effectiveInterest5Years = amountNeeded > 0 ? (Math.pow((amountHopedForExit / amountNeeded), 1 / 5) - 1): "-";
  const effectiveInterest7Years = amountNeeded > 0 ? (Math.pow((amountHopedForExit / amountNeeded), 1 / 7) - 1) : "-";
  
 
  //Reality Check #2
  const [year5Revenue, setYear5Revenue] = useState(0);

  // Calculations for Segments At Year 1
  const [segmentNames, setSegmentNames] = useState(new Array(5).fill(''));
  const [avgRevenuePerCustomer, setAvgRevenuePerCustomer] = useState(new Array(5).fill(''));
  const [yourPercent, setYourPercent] = useState(new Array(5).fill(''));
  const [quickModelingPercentage, setQuickModelingPercentage] = useState(new Array(5).fill(''));
  const [revenue1, setRevenue1] = useState(new Array(5).fill(0));
  const [customers1, setCustomers1] = useState(new Array(5).fill(0));
  const [revenue2, setRevenue2] = useState(new Array(5).fill(0));
  const [customers2Year1, setCustomers2Year1] = useState(new Array(5).fill(0));
  const [visibleRowsYear1, setVisibleRowsYear1] = useState(1);

  // Calculations for Segments At Year 2
  const [segmentNamesYear2, setSegmentNamesYear2] = useState(new Array(5).fill(''));
  const [avgRevenuePerCustomerYear2, setAvgRevenuePerCustomerYear2] = useState(new Array(5).fill(''));
  const [yourPercentYear2, setYourPercentYear2] = useState(new Array(5).fill(''));
  const [quickModelingPercentageYear2, setQuickModelingPercentageYear2] = useState(new Array(5).fill(''));
  const [revenue1Year2, setRevenue1Year2] = useState(new Array(5).fill(0));
  const [customers1Year2, setCustomers1Year2] = useState(new Array(5).fill(0));
  const [revenue2Year2, setRevenue2Year2] = useState(new Array(5).fill(0));
  const [customers2Year2, setCustomers2Year2] = useState(new Array(5).fill(0));
  const [visibleColumnsYear2, setVisibleColumnsYear2] = useState(1);

  // Calculations for Segments At Year 3
  const [segmentNamesYear3, setSegmentNamesYear3] = useState(new Array(5).fill(''));
  const [avgRevenuePerCustomerYear3, setAvgRevenuePerCustomerYear3] = useState(new Array(5).fill(''));
  const [yourPercentYear3, setYourPercentYear3] = useState(new Array(5).fill(''));
  const [quickModelingPercentageYear3, setQuickModelingPercentageYear3] = useState(new Array(5).fill(''));
  const [revenue1Year3, setRevenue1Year3] = useState(new Array(5).fill(0));
  const [customers1Year3, setCustomers1Year3] = useState(new Array(5).fill(0));
  const [revenue2Year3, setRevenue2Year3] = useState(new Array(5).fill(0));
  const [customers2Year3, setCustomers2Year3] = useState(new Array(5).fill(0));
  const [visibleColumnsYear3, setVisibleColumnsYear3] = useState(1);

  const [submitted, setSubmitted] = useState(false);

  function downloadPDF() {
    console.log('Attempting to generate PDF...'); // Debugging log
    html2canvas(document.body).then(canvas => {
        console.log('Canvas is ready'); // Debugging log
        const imgData = canvas.toDataURL('image/png');
        console.log('Image data created'); // Debugging log
        const pdf = new jsPDF.jsPDF({
            orientation: 'portrait',
        });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        console.log('Image added to PDF'); // Debugging log
        pdf.save("download.pdf");
        console.log('PDF has been saved'); // Debugging log
    }).catch(error => {
        console.error('Error generating PDF:', error); // Error handling
    });
}


  function calculatePercentYear3(year) {
    switch (year) {
      case 0:
        return lastYearsRevenue / revenueNeededYear3;
      case 1:
        return (calculatePercentYear3(2) / growthProjection)*100;
      case 2:
        return (calculatePercentYear3(3)/ growthProjection)*100;
      case 3:
        return 1; // 100%
      case 4:
        return (calculatePercentYear3(3) * growthProjection)/100;
      case 5:
        return (calculatePercentYear3(4)  * growthProjection)/100;
      default:
        return 0;
    }
  };

  function calculateRevenue(year) {
    let revenue;
    switch (year) {
      case 0:
        revenue = lastYearsRevenue;
        break;
      case 1:
      case 2:
      case 4:
      case 5:
        revenue = isBlank(forceTo[year])
          ? calculateRevenue(3) * calculatePercentYear3(year)
          : calculateRevenue(3) * forceTo[year];
        break;
      case 3:
        revenue = revenueNeededYear3;
        break;
      default: 
        revenue = 0;
    }
    return revenue;
  }
  
  

  // Check if a value is blank or not
  const isBlank = (value) => value === '' || value === null || value === undefined;

  // Set the growth projection when the component updates
  React.useEffect(() => {
    if (lastYearsRevenue > 0) {
      setGrowthProjection(calculatedGrowthProjection.toFixed(2));
    }
  }, [lastYearsRevenue, revenueNeededYear3]);

  const chartData = [0, 1, 2, 3, 4, 5].map(year => ({
    year: year.toString(),
    revenue: calculateRevenue(year),
  }));
  useEffect(() => {
    console.log("Updated Chart Data:", chartData);
}, [chartData]);


  useEffect(() => {
    if(lastYearsRevenue > 0) {
      setGrowthProjection(calculatedGrowthProjection.toFixed(2));
    }
  }, [lastYearsRevenue, revenueNeededYear3]);
  //Reality Check#1
  const capturedAtYear5 = totalMarket > 0 ? (calculateRevenue(4) / totalMarket) * 100: 0;

 

  //Customer Segments At Year 1

  const addRowYear1 = () => {
    setVisibleRowsYear1((currentRows) => (currentRows < 5 ? currentRows + 1 : currentRows));
  };

  const handleAvgRevenueChange = (index, value) => {
    const updatedValues= [...avgRevenuePerCustomer];
    updatedValues[index] = value !== '' ? value : '0'; 
    setAvgRevenuePerCustomer(updatedValues);
  };

  

  function calculateQuickModelingPercentages(avgRevenuePerCustomer) {
    const avgRevenues = avgRevenuePerCustomer.map(avg => parseFloat(avg) || 0);
    
    // Determine the percentage for segment 1 year 1
    let segment1Percentage;
    if (avgRevenues.slice(1).every(val => val === 0)) { // Check if segments 2,3,4,5 are 0
      segment1Percentage = 100;
    } else if (avgRevenues[1] > 0 && avgRevenues.slice(2).every(val => val === 0)) {
      segment1Percentage = 70;
    } else if (avgRevenues.slice(1, 3).every(val => val > 0) && avgRevenues.slice(3).every(val => val === 0)) {
      segment1Percentage = 60;
    } else if (avgRevenues.slice(1, 4).every(val => val > 0) && avgRevenues[4] === 0) {
      segment1Percentage = 50;
    } else {
      segment1Percentage = 45;
    }
  
    // Determine percentages for segments 2 to 5 based on segment 1's percentage
    const percentages = [segment1Percentage]; // Initialize with segment 1's percentage
    percentages.push(segment1Percentage === 100 ? 0 : segment1Percentage === 70 ? 30 : segment1Percentage === 60 ? 25 : segment1Percentage === 50 ? 25 : segment1Percentage === 45 ? 25 : segment1Percentage);
    percentages.push(segment1Percentage >= 70 ? 0 : 15);
    percentages.push(segment1Percentage >= 60 ? 0 : 10);
    percentages.push(segment1Percentage >= 50 ? 0 : 5);
  
    return percentages;
  }


  useEffect(() => {
    const newQuickModelingPercentages = calculateQuickModelingPercentages(avgRevenuePerCustomer);
    setQuickModelingPercentage(newQuickModelingPercentages);
  }, [avgRevenuePerCustomer]);
  

  function calculateRevenue1() {
    const revenueYear1 = calculateRevenue(1); 
    return quickModelingPercentage.map(percentage => {
      const percentageDecimal = percentage / 100; 
      return revenueYear1 * percentageDecimal; 
    });
  }
  
  useEffect(() => {
    const newRevenue1Values = calculateRevenue1();
    setRevenue1(newRevenue1Values); 
  }, [quickModelingPercentage]);
  
  
  function calculateCustomers1() {
    return revenue1.map((revenue, index) => {
      const avgRevenue = parseFloat(avgRevenuePerCustomer[index]) || 0; 
      if (avgRevenue === 0) {
        return 0; 
      } else {
        return parseFloat((revenue / avgRevenue).toFixed(0));
      }
    });
  }
  
  useEffect(() => {
    const newCustomers1Values = calculateCustomers1();
    setCustomers1(newCustomers1Values); 
  }, [revenue1, avgRevenuePerCustomer]);

  function calculateRevenue2() {
    const year1Revenue = calculateRevenue(1); 
    return yourPercent.map(percent => year1Revenue * (parseFloat(percent) / 100));
  }
  useEffect(() => {
    const revenue2Values = calculateRevenue2();
    setRevenue2(revenue2Values);
  }, [yourPercent]);

  const handleCustomers2Year1Change = (index, value) => {
    const updatedValues = [...customers2Year1]; 
    updatedValues[index] = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setCustomers2Year1(updatedValues);
};


  //Customer Segments At Year 2

  const addRowYear2 = () => {
    setVisibleColumnsYear2((currentColumns) => (currentColumns < 5 ? currentColumns + 1 : currentColumns));
  };  

  const handleAvgRevenueChangeYear2 = (index, value) => {
    const updatedValues= [...avgRevenuePerCustomerYear2];
    updatedValues[index] = value !== '' ? value : '0'; 
    setAvgRevenuePerCustomerYear2(updatedValues);
  };

  const handleYourPercentChangeYear2 = (index, value) => {
    const updatedValues = [...yourPercentYear2];
    updatedValues[index] = value !== '' ? value : '0';
    setYourPercentYear2(updatedValues);
  };

  function calculateQuickModelingPercentagesYear2(avgRevenuePerCustomerYear2) {
    const avgRevenuesYear2 = avgRevenuePerCustomerYear2.map(avg => parseFloat(avg) || 0);
  // Determine the percentage for segment 1 year 1
  let segment1PercentageYear2 ;
  if (avgRevenuesYear2 .slice(1).every(val => val === 0)) { // Check if segments 2,3,4,5 are 0
    segment1PercentageYear2 = 100;
  } else if (avgRevenuesYear2 [1] > 0 && avgRevenuesYear2.slice(2).every(val => val === 0)) {
    segment1PercentageYear2  = 70;
  } else if (avgRevenuesYear2.slice(1, 3).every(val => val > 0) && avgRevenuesYear2.slice(3).every(val => val === 0)) {
    segment1PercentageYear2  = 60;
  } else if (avgRevenuesYear2.slice(1, 4).every(val => val > 0) && avgRevenuesYear2[4] === 0) {
    segment1PercentageYear2 = 50;
  } else {
    segment1PercentageYear2 = 45;
  }

  const percentagesYear2  = [segment1PercentageYear2]; 
  percentagesYear2.push(segment1PercentageYear2 === 100 ? 0 : segment1PercentageYear2 === 70 ? 30 : segment1PercentageYear2 === 60 ? 25 : segment1PercentageYear2 === 50 ? 25 : segment1PercentageYear2 === 45 ? 25 : segment1PercentageYear2);
  percentagesYear2.push(segment1PercentageYear2 >= 70 ? 0 : 15);
  percentagesYear2.push(segment1PercentageYear2 >= 60 ? 0 : 10);
  percentagesYear2.push(segment1PercentageYear2 >= 50 ? 0 : 5);

  return percentagesYear2;
}

useEffect(() => {
  const newQuickModelingPercentagesYear2 = calculateQuickModelingPercentagesYear2(avgRevenuePerCustomerYear2);
  setQuickModelingPercentageYear2(newQuickModelingPercentagesYear2);
}, [avgRevenuePerCustomerYear2]);

function calculateRevenue1Year2() {
  const revenueYear2 = calculateRevenue(2); 
  return quickModelingPercentageYear2.map(percentage => {
    const percentageDecimal = percentage / 100; 
    return revenueYear2 * percentageDecimal; 
  });
}

useEffect(() => {
  const newRevenue1ValuesYear2 = calculateRevenue1Year2();
  setRevenue1Year2(newRevenue1ValuesYear2); 
}, [quickModelingPercentageYear2]);

function calculateCustomers1Year2() {
  return revenue1Year2.map((revenueYear2, index) => {
    const avgRevenueYear2 = parseFloat(avgRevenuePerCustomerYear2[index]) || 0; 
    if (avgRevenueYear2 === 0) {
      return 0; 
    } else {
      return parseFloat((revenueYear2 / avgRevenueYear2).toFixed(0));
    }
  });
}

useEffect(() => {
  const newCustomers1ValuesYear2 = calculateCustomers1Year2();
  setCustomers1Year2(newCustomers1ValuesYear2); 
}, [revenue1Year2, avgRevenuePerCustomerYear2]);

function calculateRevenue2Year2() {
  const year2Revenue = calculateRevenue(2); 
  return yourPercentYear2.map(percent => year2Revenue * (parseFloat(percent) / 100));
}
useEffect(() => {
  const revenue2ValuesYear2 = calculateRevenue2Year2(1);
  setRevenue2Year2(revenue2ValuesYear2);
}, [yourPercentYear2]);


const handleCustomers2Year2Change = (index, value) => {
  const updatedValues = [...customers2Year2]; 
  updatedValues[index] = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  setCustomers2Year2(updatedValues);
};


//Customer Segments At Year 3

const addRowYear3 = () => {
  setVisibleColumnsYear3((currentColumns) => (currentColumns < 5 ? currentColumns + 1 : currentColumns));
};  

const handleAvgRevenueChangeYear3 = (index, value) => {
  const updatedValues= [...avgRevenuePerCustomerYear3];
  updatedValues[index] = value !== '' ? value : '0'; 
  setAvgRevenuePerCustomerYear3(updatedValues);
};

const handleYourPercentChangeYear3 = (index, value) => {
  const updatedValues = [...yourPercentYear3];
  updatedValues[index] = value !== '' ? value : '0';
  setYourPercentYear3(updatedValues);
};

function calculateQuickModelingPercentagesYear3(avgRevenuePerCustomerYear3) {
  const avgRevenuesYear3 = avgRevenuePerCustomerYear3.map(avg => parseFloat(avg) || 0);
// Determine the percentage for segment 1 year 1
let segment1PercentageYear3 ;
if (avgRevenuesYear3 .slice(1).every(val => val === 0)) { // Check if segments 2,3,4,5 are 0
  segment1PercentageYear3 = 100;
} else if (avgRevenuesYear3 [1] > 0 && avgRevenuesYear3.slice(2).every(val => val === 0)) {
  segment1PercentageYear3  = 70;
} else if (avgRevenuesYear3.slice(1, 3).every(val => val > 0) && avgRevenuesYear3.slice(3).every(val => val === 0)) {
  segment1PercentageYear3  = 60;
} else if (avgRevenuesYear3.slice(1, 4).every(val => val > 0) && avgRevenuesYear3[4] === 0) {
  segment1PercentageYear3 = 50;
} else {
  segment1PercentageYear3 = 45;
}

const percentagesYear3  = [segment1PercentageYear3]; 
percentagesYear3.push(segment1PercentageYear3 === 100 ? 0 : segment1PercentageYear3 === 70 ? 30 : segment1PercentageYear3 === 60 ? 25 : segment1PercentageYear3 === 50 ? 25 : segment1PercentageYear3 === 45 ? 25 : segment1PercentageYear3);
percentagesYear3.push(segment1PercentageYear3 >= 70 ? 0 : 15);
percentagesYear3.push(segment1PercentageYear3 >= 60 ? 0 : 10);
percentagesYear3.push(segment1PercentageYear3 >= 50 ? 0 : 5);

return percentagesYear3;
}

useEffect(() => {
const newQuickModelingPercentagesYear3 = calculateQuickModelingPercentagesYear3(avgRevenuePerCustomerYear3);
setQuickModelingPercentageYear3(newQuickModelingPercentagesYear3);
}, [avgRevenuePerCustomerYear3]);

function calculateRevenue1Year3() {
  const revenueYear3 = calculateRevenue(3); 
  return quickModelingPercentageYear3.map(percentage => {
    const percentageDecimal = percentage / 100; 
    return revenueYear3 * percentageDecimal; 
  });
}

useEffect(() => {
  const newRevenue1ValuesYear3 = calculateRevenue1Year3();
  setRevenue1Year3(newRevenue1ValuesYear3); 
}, [quickModelingPercentageYear3]);


function calculateCustomers1Year3() {
  return revenue1Year3.map((revenueYear3, index) => {
    const avgRevenueYear3 = parseFloat(avgRevenuePerCustomerYear3[index]) || 0; 
    if (avgRevenueYear3 === 0) {
      return 0; 
    } else {
      return parseFloat((revenueYear3 / avgRevenueYear3).toFixed(0));
    }
  });
}

useEffect(() => {
  const newCustomers1ValuesYear3 = calculateCustomers1Year3();
  setCustomers1Year3(newCustomers1ValuesYear3); 
}, [revenue1Year3, avgRevenuePerCustomerYear3]);


function calculateRevenue2Year3() {
  const year3Revenue = calculateRevenue(3); 
  return yourPercentYear3.map(percent => year3Revenue * (parseFloat(percent) / 100));
}
useEffect(() => {
  const revenue2ValuesYear3 = calculateRevenue2Year3(1);
  setRevenue2Year3(revenue2ValuesYear3);
}, [yourPercentYear3]);


const handleCustomers2Year3Change = (index, value) => {
  const updatedValues = [...customers2Year3]; 
  updatedValues[index] = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  setCustomers2Year3(updatedValues);
};


const handleSave = async () => {
  const mainform_id = 1;

  const effectiveInterest3YearsValue = amountNeeded > 0 ? (Math.pow((amountHopedForExit / amountNeeded), 1 / 3) - 1) : "-";
  const effectiveInterest5YearsValue = amountNeeded > 0 ? (Math.pow((amountHopedForExit / amountNeeded), 1 / 5) - 1) : "-";
  const effectiveInterest7YearsValue = amountNeeded > 0 ? (Math.pow((amountHopedForExit / amountNeeded), 1 / 7) - 1) : "-";

  const exitYears = {
    year0: { 
      percentage: calculatePercentYear3(0) * 100, // Assuming calculatePercentYear3 returns a decimal
      revenue: calculateRevenue(0),
      ForceTo: forceTo[0] || "-", // Ensure you have a default or validation for empty values
    },
    year1: { 
      percentage: calculatePercentYear3(1) * 100, 
      revenue: calculateRevenue(1),
      ForceTo: forceTo[1] || "-", 
    },
    year2: { 
      percentage: calculatePercentYear3(2) * 100, 
      revenue: calculateRevenue(2),
      ForceTo: forceTo[2] || "-", 
    },
    year3: { 
      percentage: calculatePercentYear3(3) * 100, 
      revenue: calculateRevenue(3),
      ForceTo: forceTo[3] || "-", 
    },
    year4: { 
      percentage: calculatePercentYear3(4) * 100, 
      revenue: calculateRevenue(4),
      ForceTo: forceTo[4] || "-", 
    },
    year5: { 
      percentage: calculatePercentYear3(5) * 100, 
      revenue: calculateRevenue(5),
      ForceTo: forceTo[5] || "-", 
    }
  };
  const revenueMultiplier = revenueMultiplierExit;

  const formData = {
    valuationParameters: {
      lastYearTotalRevenue: lastYearsRevenue, 
      amountNeeded: amountNeeded,
      revenueMultiplier: multiplierExpected,
      exitAmount: amountHopedForExit,
      equityPercentage: equityPercentage,
      year3CompanyWorth: companyWorthAtYear3,
      exitRevenueMultiplier: revenueMultiplierExit,
      revenueNeededYear3: revenueNeededYear3,
      growthProjection: growthProjection,
      forceTo,
      exitYears: exitYears,
      hit3YearGoals: {
        lastYearTotalRevenue: lastYearsRevenue,
        amountNeeded: amountNeeded,
        "3years": {
          effectiveInterest: effectiveInterest3YearsValue,
        },
        "5years": {
          effectiveInterest: effectiveInterest5YearsValue,
        },
        "7years": {
          effectiveInterest: effectiveInterest7YearsValue,
        }
      },
      exitAmount: revenueNeededYear3,
    },
    
    realityCheck1: {
      totalMarket: totalMarket,
      capturedAtYear5: capturedAtYear5
    },
    customerSegmentsYear1: segmentNames.map((segmentName, index) => ({
      segmentName,
      avgRevenuePerCustomer: avgRevenuePerCustomer[index],
      yourPercent: yourPercent[index],
      quickModelingPercentage: quickModelingPercentage[index],
      revenue1: revenue1[index],
      customers1: customers1[index],
      revenue2: revenue2[index],
      customers2: customers2Year1[index]
  })).filter(isSegmentValid), // Apply the filter here
  customerSegmentsYear2: segmentNamesYear2.map((segmentName, index) => ({
      segmentName,
      avgRevenuePerCustomer: avgRevenuePerCustomerYear2[index],
      yourPercent: yourPercentYear2[index],
      quickModelingPercentage: quickModelingPercentageYear2[index],
      revenue1: revenue1Year2[index],
      customers1: customers1Year2[index],
      revenue2: revenue2Year2[index],
      customers2: customers2Year2[index]
  })).filter(isSegmentValid), // Apply the filter here
  customerSegmentsYear3: segmentNamesYear3.map((segmentName, index) => ({
      segmentName,
      avgRevenuePerCustomer: avgRevenuePerCustomerYear3[index],
      yourPercent: yourPercentYear3[index],
      quickModelingPercentage: quickModelingPercentageYear3[index],
      revenue1: revenue1Year3[index],
      customers1: customers1Year3[index],
      revenue2: revenue2Year3[index],
      customers2: customers2Year3[index]
  })).filter(isSegmentValid) // Apply the filter here
};
function isSegmentValid(segment) {
  return segment.segmentName.trim() !== '' && parseFloat(segment.avgRevenuePerCustomer) > 0;
}
  
  const apiUrl = `http://localhost:8000/form/rev_form/${mainform_id}`;

  try {
    const response = await fetch(apiUrl, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    openNewWindowWithFormData(data);
  } catch (error) {
    console.error('Error submitting form data:', error);
  }
};

const handleOpenNewWindow = () => {
  const chartData = [0, 1, 2, 3, 4, 5].map(year => ({
      year: year.toString(),
      revenue: calculateRevenue(year),
  }));

  

  const dataString = prepareDataString(); 

  const newWindow = window.open("", "_blank");
  newWindow.document.write(`
      <html>
      <head>
          <title>Reverse Engineer Valuation Calculation Results</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.0.0-rc.7/html2canvas.min.js"></script>
      </head>
      <body>
          ${dataString}
          <h2>Revenue Graph</h2>
          <div id="chart-container"></div>
          <button onclick="downloadPDF()">Download as PDF</button>
          <script>
              const chartData = ${JSON.stringify(chartData)};
              ReactDOM.hydrate(React.createElement(RevenueChart, {data: chartData}), document.getElementById('chart-container'));

              function downloadPDF() {
                  html2canvas(document.body).then(canvas => {
                      const imgData = canvas.toDataURL('image/png');
                      const pdf = new jsPDF.jsPDF({
                          orientation: 'portrait',
                      });
                      const imgProps = pdf.getImageProperties(imgData);
                      const pdfWidth = pdf.internal.pageSize.getWidth();
                      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                      pdf.save("download.pdf");
                  }).catch(error => console.error('Error generating PDF:', error));
              }
          </script>
      </body>
      </html>
  `);
  newWindow.document.close();
};


const openNewWindowWithFormData = (data) => {
  const displayElement = document.getElementById('result-display');
    const formattedData = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    displayElement.innerHTML = formattedData;
}


const prepareDataString = () => {
  // Function to create HTML for revenue data
  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`; // Multiplies by 100 and rounds to 1 decimal place
};
  const createRevenueDataTable = () => {
      const rows = chartData.map(data => 
          `<tr>
              <td>${data.year}</td>
              <td>$${parseInt(data.revenue).toLocaleString()}</td>
          </tr>`
      ).join("");
      return `
          <table>
              <thead>
                  <tr>
                      <th>Year</th>
                      <th>Revenue</th>
                  </tr>
              </thead>
              <tbody>${rows}</tbody>
          </table>
      `;
  };
  const isRowValid = (segment) => {
    return segment.segmentName.trim() !== '' && parseFloat(segment.avgRevenuePerCustomer) > 0;
};

  // Function to create HTML for customer segment data
  const createSegmentDataTable = (segmentNames, avgRevenuePerCustomer, yourPercent, quickModelingPercentage, revenue1, customers1, revenue2, customers2) => {
      const rows = segmentNames.map((segment, index) => {
        const segmentData = {
          segmentName: segmentNames[index],
          avgRevenuePerCustomer: avgRevenuePerCustomer[index],
          yourPercent: yourPercent[index],
          quickModelingPercentage: quickModelingPercentage[index],
          revenue1: revenue1[index],
          customers1: customers1[index],
          revenue2: revenue2[index],
          customers2: customers2[index]
      
      };
      if (isRowValid(segmentData)) {
        return  `<tr>
              <td>${segment}</td>
              <td>$${avgRevenuePerCustomer[index]}</td>
              <td>${quickModelingPercentage[index]}%</td>
              <td>$${revenue1[index].toLocaleString()}</td>
              <td>${customers1[index]}</td>
              <td>${yourPercent[index]}%</td>
              <td>$${revenue2[index].toLocaleString()}</td>
              <td>${customers2[index]}</td>
          </tr>`
        }
        return ''; // Return empty string for invalid rows
    }).join("");
      return `
          <table>
              <thead>
                  <tr>
                      <th>Segment Name</th>
                      <th>Avg Revenue/Customer</th>
                      <th>Quick Modeling %</th>
                      <th>Revenue </th>
                      <th>Customers </th>
                      <th>Your %</th>
                      <th>Revenue </th>
                      <th>Customers </th>
                  </tr>
              </thead>
              <tbody>${rows}</tbody>
          </table>
      `;
  };

  return `
      <h1>Reverse Engineer Valuation Calculation Results</h1>
      <table>
          <tr><td>Last Year's Total Revenue:</td><td>$${lastYearsRevenue.toLocaleString()}</td></tr>
          <tr><td>Amount Needed:</td><td>$${amountNeeded.toLocaleString()}</td></tr>
          <tr><td>Multiplier Expected:</td><td>${multiplierExpected}X</td></tr>
          <tr><td>Equity Percentage:</td><td>${equityPercentage}%</td></tr>
          <tr><td>Revenue Multiplier at Exit:</td><td>${revenueMultiplierExit}</td></tr>
          <tr><td>Company Worth at Year 3:</td><td>$${companyWorthAtYear3.toLocaleString()}</td></tr>
          <tr><td>Revenue Needed by Year 3:</td><td>$${revenueNeededYear3.toLocaleString()}</td></tr>
          <tr><td>Growth Projection:</td><td>${growthProjection}%</td></tr>
          <tr><td>Effective Interest for 3 Years:</td><td>${formatPercentage(effectiveInterest3Years)}</td></tr>
          <tr><td>Effective Interest for 5 Years:</td><td>${formatPercentage(effectiveInterest5Years)}</td></tr>
          <tr><td>Effective Interest for 7 Years:</td><td>${formatPercentage(effectiveInterest7Years)}</td></tr>
          <tr><td>Total Market Size:</td><td>$${totalMarket.toLocaleString()}</td></tr>
          <tr><td>Market Capture at Year 5:</td><td>${capturedAtYear5.toFixed(2)}%</td></tr>
      </table>
      <h2>Revenue Data by Year</h2>
      ${createRevenueDataTable()}
      <h2>Customer Segments Details at Year 1</h2>
      ${createSegmentDataTable(segmentNames, avgRevenuePerCustomer, yourPercent, quickModelingPercentage, revenue1, customers1, revenue2, customers2Year1)}
      <h2>Customer Segments Details at Year 2</h2>
      ${createSegmentDataTable(segmentNamesYear2, avgRevenuePerCustomerYear2, yourPercentYear2, quickModelingPercentageYear2, revenue1Year2, customers1Year2, revenue2Year2, customers2Year2)}
      <h2>Customer Segments Details at Year 3</h2>
      ${createSegmentDataTable(segmentNamesYear3, avgRevenuePerCustomerYear3, yourPercentYear3, quickModelingPercentageYear3, revenue1Year3, customers1Year3, revenue2Year3, customers2Year3)}
  `;
}







  return (
    <div>
      <Dashboard />
      
    <div id="form-content" className="rev-container">
      <h1 className="rev-title">Reverse Engineer Valuation</h1>
      <table>
        <tr>
          <td  className="rev-table">Last Year's Total Revenue (if relevant)</td>
          <td><input className="input-table" type="float" value={`$${lastYearsRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`} onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setLastYearsRevenue(parseFloat(value) || 0); 
                    }}
                    placeholder="$1,000,000"/></td>
        </tr>
        <tr>
          <td className="rev-table">How much $$ do you need/want?</td>
          <td><input className="input-table" type="float" value={`$${amountNeeded.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`} onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setAmountNeeded(parseFloat(value) || 0); 
                    }}
                    placeholder="$1,000,000"/></td>
           
        </tr>
        <tr>
          <td className="rev-table">Multiplier the investor expects (e.g. 2-10X)</td>
          <td>
            <input className="input-table" type="integer" value={multiplierExpected} onChange={(e) => setMultiplierExpected(e.target.value.replace(/[^0-9.]/g, ''))} /></td>
        </tr>
        <tr>
          <td className="rev-table">Amount $$$$$ the investor hopes for @Exit</td>
          <td >{`$${amountHopedForExit.toLocaleString(undefined, {maximumFractionDigits:2}) || ''}`}</td>
        </tr>
        <tr>
          <td className="rev-table">What % of equity are you giving up (e.g. 5-25%)?</td>
          <td><input className="input-table" type="integer" value={`${equityPercentage}%`} onChange={(e) => setEquityPercentage(e.target.value.replace(/[^0-9.]/g, ''))} /></td>
        </tr>
        <tr>
          <td className="rev-table">What company needs to be worth @ Year 3</td>
          <td>{`$${companyWorthAtYear3.toLocaleString(undefined, {maximumFractionDigits:2}) || ''}`}</td>
        </tr>
        <tr>
          <td className="rev-table">Multiplier of revenue expected at exit (e.g. 2X)</td>
          <td><input className="input-table" type="integer" value={revenueMultiplierExit} onChange={(e) => setRevenueMultiplierExit(e.target.value)} /></td>
        </tr>
        <tr>
          <td className="rev-table">Revenue needed year 3 based upon multiplier</td>
          <td>{`$${revenueNeededYear3.toLocaleString(undefined, {maximumFractionDigits:2}) || ''}`}</td>
        </tr>
        <tr>
          <td className="rev-table">Growth Projection % per year (e.g. 500%)</td>
          <td><input className="input-table" type="integer" value={`${growthProjection}%`} onChange={(e) => setGrowthProjection(e.target.value.replace(/[^0-9.]/g, ''))} disabled={lastYearsRevenue > 0} /></td>
        </tr>
        <tr>
          <td  className="rev-table">Effective Interest in 3 Year</td>
          <td>{typeof effectiveInterest3Years === "number" ? effectiveInterest3Years.toLocaleString(undefined, {style: "percent", maximumFractionDigits: 1}) : effectiveInterest3Years}</td>
        </tr>
        <tr>
          <td className="rev-table">Effective Interest in 5 Years</td>
          <td>{typeof effectiveInterest5Years === "number" ? effectiveInterest5Years.toLocaleString(undefined, {style: "percent", maximumFractionDigits: 1}) : effectiveInterest5Years}</td>
        </tr>
        <tr>
          <td className="rev-table">Effective Interest in 7 Years</td>
          <td>{typeof effectiveInterest7Years === "number" ? effectiveInterest7Years.toLocaleString(undefined, {style: "percent", maximumFractionDigits: 1}) : effectiveInterest7Years}</td>
        </tr>
      </table>
      <table>
        <tr>
          <td className="rev-table1">Reality Check #1: What is the total market? </td>
          <td><input className="input-table" type="float" value={`$${totalMarket.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`} onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        settotalMarket(parseFloat(value) || 0); 
                    }}
                    placeholder="$1,000,000"/></td>
        </tr>
        <tr>
              <td className="rev-table1" >Market Capture at Year 5:</td>
              <td>{capturedAtYear5.toFixed(2)}%</td>
        </tr>

  
    </table>
     
   
      <table className="RevenueTable">
        <thead>
          <tr className="rev-table">
            <th className="year3">Year</th>
            <th className="year3">% Year 3</th>
            <th className="year3">Revenue</th>
            <th>Force to</th>
          </tr>
        </thead>
        <tbody>
        {[0, 1, 2, 3, 4, 5].map((year) => (
            <tr key={year}>
              <td className="year3">{year}</td>
              <td className="year3">{`${(calculatePercentYear3(year) * 100).toFixed(0)}%`}</td>
              <td className="year3">{`$${calculateRevenue(year).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</td>
              <td className="year3">
                {year === 3 ? '100%' : year === 0 ? '0%' : (
                  <input className="input-table"
                    type="integer"
                    value={forceTo[year]}
                    onChange={(e) => {
                      const newForceTo = [...forceTo];
                      newForceTo[year] = e.target.value ? parseFloat(e.target.value) : '';
                      setForceTo(newForceTo);
                  }} 
                />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <RevenueChart data={chartData} />
      <table className="Yaer1Table">
        <thead>
          <tr>
            <th className="segment-column, rev-table">Customer Segments At Year 1</th>
            <th className="rev-table">Avg Revenue/Customer</th>
            <th className="rev-table">Quick Modeling as % of Revenue</th>
            <th className="rev-table">Revenue</th>
            <th className="customers-column, rev-table">Customers</th>
            <th className="rev-table">Your %</th>
            <th className="rev-table">Revenue</th>
            <th className="customers-column, rev-table">Customers</th>
          </tr>
        </thead>
        <tbody>
          {segmentNames.slice(0, visibleRowsYear1).map((segmentName, index) => (
             <tr key={index}>
              <td>
                <input className="input-segment"
                  type="string"
                  value={segmentName}
                  onChange={(e) => {
                    const newSegmentNames = [...segmentNames];
                    newSegmentNames[index] = e.target.value;
                    setSegmentNames(newSegmentNames);
                  }}
                />
              </td>
              <td>
                <input className="input-table"
                  type="float"
                  value={`$${avgRevenuePerCustomer[index]}`}
                  onChange={(e) => handleAvgRevenueChange(index, e.target.value.replace(/[^0-9.]/g, ''))
                  }
                />
              </td>
              <td>{quickModelingPercentage[index] ? quickModelingPercentage[index].toFixed(0) : ''}%</td>
              
              <td>{`$${ revenue1[index].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</td>
              <td>{customers1[index]}</td>
              <td>
                <input className="input-table"
                  type="float"
                  value={`${yourPercent[index]}%`}
                  onChange={(e) => {
                    const newYourPercent = [...yourPercent];
                    newYourPercent[index] = e.target.value.replace(/[^0-9.]/g, '');
                    setYourPercent(newYourPercent);
                  }}
                />
              </td>
              <td>${revenue2[index].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
              <td> <input className="input-table"
              type="number"
              value={customers2Year1[index]}
              onChange={(e) => handleCustomers2Year1Change(index, e.target.value)}
              />
              </td>
            </tr>
          ))}
          <button className="no-print" onClick={addRowYear1} disabled={visibleRowsYear1 >= 5}>
            Add Row Year1
          </button>

        </tbody>
      </table>
      <table className="Yaer2Table">
        <thead  >
          <tr>
            <th className="segment-column, rev-table">Customer Segments At Year 2</th>
            <th className="rev-table">Avg Revenue/Customer</th>
            <th className="rev-table">Quick Modeling as % of Revenue</th>
            <th className="rev-table">Revenue</th>
            <th className="customers-column, rev-table">Customers</th>
            <th className="rev-table">Your %</th>
            <th className="rev-table">Revenue</th>
            <th className="customers-column, rev-table">Customers</th>
          </tr>
        </thead >
        <tbody > 
          {segmentNamesYear2.slice(0, visibleColumnsYear2).map((segmentNameYear2, index) => (
            <tr key={index} >
              <td >
                <input className="input-segment"
                  type="string"
                  value={segmentNamesYear2[index]}
                  onChange={(e) => {
                    const newSegmentNamesYear2 = [...segmentNamesYear2];
                    newSegmentNamesYear2[index] = e.target.value;
                    setSegmentNamesYear2(newSegmentNamesYear2);
                  }}
                />
              </td>
              <td className="SegName">
                <input className="input-table"
                  type="float"
                  value={`$${avgRevenuePerCustomerYear2[index]}`}
                  onChange={(e) => handleAvgRevenueChangeYear2(index, e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </td>
              <td>{quickModelingPercentageYear2[index] ? quickModelingPercentageYear2[index].toFixed(0) : ''}%</td>
              <td>${revenue1Year2[index].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
              <td>{customers1Year2[index]}</td>
              <td>
                <input className="input-table"
                  type="float"
                  value={`${yourPercentYear2[index]}%`}
                  onChange={(e) => {
                    const newYourPercentYear2 = [...yourPercentYear2];
                    newYourPercentYear2[index] = e.target.value.replace(/[^0-9.]/g, '');
                    setYourPercentYear2(newYourPercentYear2);
                  }}
                />
              </td>
              <td>{`$${revenue2Year2[index].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</td>
              <td> 
              <input className="input-table"
              type="number"
              value={customers2Year2[index]}
              onChange={(e) => handleCustomers2Year2Change(index, e.target.value)}
              />
              </td>
            </tr>
          ))}
          <button className="no-print" onClick={addRowYear2} disabled={visibleColumnsYear2 >= 5}>
            Add Row Year2
          </button>
        </tbody>
      </table>
      <table className="Yaer3Table">
        <thead>
          <tr>
            <th className="segment-column, rev-table">Customer Segments At Year 3</th>
            <th className="rev-table">Avg Revenue/Customer</th>
            <th className="rev-table">Quick Modeling as % of Revenue</th>
            <th className="rev-table">Revenue</th>
            <th className="customers-column, rev-table">Customers</th>
            <th className="rev-table">Your %</th>
            <th className="rev-table">Revenue</th>
            <th className="customers-column, rev-table">Customers</th>
          </tr>
        </thead>
        <tbody>
        {segmentNamesYear3.slice(0, visibleColumnsYear3).map((segmentNameYear3, index) => (
            <tr key={index}>
              <td>
                <input className="input-segment"
                  type="string"
                  value={segmentNamesYear3[index]}
                  onChange={(e) => {
                    const newSegmentNamesYear3 = [...segmentNamesYear3];
                    newSegmentNamesYear3[index] = e.target.value;
                    setSegmentNamesYear3(newSegmentNamesYear3);
                  }}
                />
              </td>
              <td>
              <input  className="input-table"
                  type="float"
                  value={`$${avgRevenuePerCustomerYear3[index]}`}
                  onChange={(e) => handleAvgRevenueChangeYear3(index, e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </td>
              <td>{quickModelingPercentageYear3[index] ? quickModelingPercentageYear3[index].toFixed(0) : '0'}%</td>
              <td>{`$${revenue1Year3[index].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</td>
              <td>{customers1Year3[index]}</td>
              <td>
                <input className="input-table"
                  type="float"
                  value={`${yourPercentYear3[index]}%`}
                  onChange={(e) => {
                    const newYourPercentYear3 = [...yourPercentYear3];
                    newYourPercentYear3[index] = e.target.value.replace(/[^0-9.]/g, '');
                    setYourPercentYear3(newYourPercentYear3);
                  }}
                />
              </td>
              <td>{`$${revenue2Year3[index].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</td>
              <td> <input className="input-table"
              type="number"
              value={customers2Year3[index]}
              onChange={(e) => handleCustomers2Year3Change(index, e.target.value)}
              />
              </td>
            </tr>
          ))}
          <button className="no-print" onClick={addRowYear3} disabled={visibleColumnsYear3 >= 5}>
            Add Row Year3
          </button>
        </tbody>
      </table>
      <button className="SaveButton no-print" onClick={handleOpenNewWindow}>Submit</button>

    
      </div>

    </div>
  );
}

export default ReverseEvaluation;
