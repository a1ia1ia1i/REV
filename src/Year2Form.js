import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './contexts/authcontext';
import _, { initial } from 'lodash';
import './Year1.css';
import { year2Submit, year2Get } from './api'

import Dashboard from './Dashboard';
// Example data structure

const objectListTest = [{
  name: "Kilter Roller Chair",
  numberToSell: 10,
  price: 3999
},
{name: "Kilter Roller",
numberToSell: 5,
price: 85}];

function Year2() {
  const {userID} = useContext(AuthContext);
  const { mainFormID } = useContext(AuthContext);
  const initialMonthlyData = Array.from({ length: 12 }, () => ({ amount: 0 }));
  const mainFormId = useState(0);
  const [customerSegments, setCustomerSegments] = useState([]);
  const [additionalRevenue, setAdditionalRevenue] = useState({
    sourceNames: Array.from({ length: 5 }, () => ' '),
    sources: Array.from({ length: 5 }, () => Array.from({ length: 12 }, () => ({ amount: 0 }))),
    totalMonthly: Array.from({ length: 12 }, () => ({ amount: 0 }))
  });  
  const [fundingInvestment, setFundingInv] = useState({
    sourceNames: Array.from({ length: 5 }, () => ' '),
    sources: Array.from({ length: 5 }, () => _.cloneDeep(initialMonthlyData)),
    totalMonthly: Array.from({ length: 12 }, () => ({ amount: 0 }))
  });
  const [totalAllIncome, setTotalIncome] = useState(_.cloneDeep(initialMonthlyData));
  const [Distributions, setDistributions] = useState([]);
  const [cashOnHand, setCashOnHand] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(_.cloneDeep(initialMonthlyData));
  const [foundersDraw, setFoundersDraw] = useState([]);
  const [returnReworks, setReturnReworks] = useState([]);
  const newMarketingExpensesNames = ["Brand-Related Expenses", "Owned Media (blogs…etc)", "Public Relations", "Content Creation", "Marketing Analytics", "Marketing Research", "Conferences", "Trade Shows", "Marketing Training", "Sales Support Tools", "Website Expenses", "Mobile Platform Expenses", "Social Media Marketing", "Affiliate Marketing", "Traditional Media"];
  const [marketingExpenses, setMarketingExpenses] = useState({
    expensesList: newMarketingExpensesNames.map((name) => ({
    sourceName: name,
    monthlyData: _.cloneDeep(initialMonthlyData)
  })),
    totalMonthly: _.cloneDeep(initialMonthlyData)
  });
  const [fixedAssets, setFixedAssets] = useState([]);
  const propertyRelatedNames = ["Interest (Mortgage)", "Rent of Lease (business property)", "Rent or lease (vehicles, machinery, and equipment", "Repairs and maintenance", "Depletion", "Other"];
  const [propertyRelated, setPropertyRelated] = useState({
    expensesList: propertyRelatedNames.map((name) => ({
      sourceName: name,
      monthlyData: _.cloneDeep(initialMonthlyData),
    })),
    totalMonthly: _.cloneDeep(initialMonthlyData)
  });
  const serviceNames = ["Lawyer", "Accounting", "Bookkeeping", "Insurance", "Other"];
  const [legalAndProfessionalServices, setLegalAndProfessionalServices] = useState({
    expensesList: serviceNames.map((name) => ({
      sourceName: name,
      monthlyData: _.cloneDeep(initialMonthlyData),
    })),
    totalMonthly: _.cloneDeep(initialMonthlyData)
  });
  const officeExpensesNames = ["Phone", "Internet", "Utilities", "Office supplies", "Misc. Office Equipment", "Cleaning Service", "Taxes and Licenses"];
  const [officeGeneralBusiness, setOfficeGeneralBusiness] = useState({
    expensesList: officeExpensesNames.map((name) => ({
      sourceName: name,
      monthlyData: _.cloneDeep(initialMonthlyData),
    })),
    totalMonthly: _.cloneDeep(initialMonthlyData)
  });
  const bankingFeesNames = ["Interest (Banks/Credit)", "Interest (Other)"];
  const [bankingFees, setBankingFees] = useState({
    expensesList: bankingFeesNames.map((name) => ({
      sourceName: name,
      monthlyData: _.cloneDeep(initialMonthlyData),
    })),
    totalMonthly: _.cloneDeep(initialMonthlyData)
  });
  const travelExpensesNames = ["Car and Truck expenses", "Travel/Expenses", "Deductible Meals", "Mileage", "Parking/Tools", "Other"];
  const [travelVehicleRelated, setTravelVehicleRelated] = useState({
    expensesList: travelExpensesNames.map((name) => ({
      sourceName: name,
      monthlyData: _.cloneDeep(initialMonthlyData),
    })),
    totalMonthly: _.cloneDeep(initialMonthlyData)
  });
  const [productionRelated, setProductionRelated] = useState([]);
  const [otherExpenses, setOtherExpenses] = useState({
    expensesList: Array.from({ length: 5 }, () => ({
      sourceName: "Misc.",
      monthlyData: _.cloneDeep(initialMonthlyData)
    })),
    totalMonthly: _.cloneDeep(initialMonthlyData),
  });
  const [salariedWorkers, setSalariedWorkers] = useState({
    workersList: Array.from({ length: 6 }, () => ({
      description: "Misc.",
      monthlySalary: 0,
      monthlyData: _.cloneDeep(initialMonthlyData)
    })),
    totalMonthly: _.cloneDeep(initialMonthlyData),
  });
  const [fullTimeWorkers, setFullTimeWorkers] = useState({
    workersList: Array.from({ length: 6 }, () => ({
      description: "Misc.",
      monthlySalary: 0,
      monthlyData: _.cloneDeep(initialMonthlyData)
    })),
    totalMonthly: _.cloneDeep(initialMonthlyData),
  });
  const [partTimeWorkers, setPartTimeWorkers] = useState({
    workersList: Array.from({ length: 6 }, () => ({
      description: "Misc.",
      monthlySalary: 0,
      monthlyData: _.cloneDeep(initialMonthlyData)
    })),
    totalMonthly: _.cloneDeep(initialMonthlyData),
  });
  const [workersHeadCount, setWorkersHeadCount] = useState({
    foundersHeadCount: _.cloneDeep(initialMonthlyData),
    salariedHeadCount: _.cloneDeep(initialMonthlyData),
    fullTimeHeadCount: _.cloneDeep(initialMonthlyData),
    partTimeHeadCount: _.cloneDeep(initialMonthlyData),
    totalMonthly: _.cloneDeep(initialMonthlyData)
  });
  const [selectedValue, setSelectedValue] = useState("option1")
  const taxesAndBenefitsNames = ["Social Security (Rate)", "Social Security (Base)", "Medicare", "Federal Unemployment Tax (FUTA)", "Federal Unemployment Tax (Base)", "State Unemployment Tax (SUTA)", "State Unemployment Tax (Base)", "Employee Pension Programs", "Worker's Compensation", "Employee Health Insurace", "Other Employee Benefit Programs"];
  const [payRollTaxesAndBenefits, setPayRollTaxesAndBenefits] = useState({
    payrollList: taxesAndBenefitsNames.map((name) => ({
      sourceName: name,
      value: 0,
      monthlyData: _.cloneDeep(initialMonthlyData),
    })),
    totalMonthly: _.cloneDeep(initialMonthlyData)
  });
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const monthsOnly = monthNames.map((month, index) => `${month}-${currentYear}`);
  const extendedMonths = Array.from({ length: 22 }, (_, index) => `Ext +${index + 1}`);
  const months = monthsOnly.concat(extendedMonths);


   
 
  // Effect to update customerSegments when objectList prop changes
  useEffect(() => {
    if (objectListTest.length > 0) {
      console.log("yea Making it baby!")
      const initialMonthData = {
        NumbersSold: 0,
        Deposit: 0,
        Original: 0,
        ExtraFromPreviousMonths: 0,
        commission: 0,
        fixedFees: 0
      }
      // Create customerSegments array based on objectList
      const newCustomerSegments = objectListTest.map((item) => ({
        name: item.name,
        numberToSell: item.numberToSell,
        numbersToSellOriginal: item.numberToSell,
        price: item.price,
        status: 'Pending', // Example status, you can initialize it as needed
        inputData: {
          deposit: 0,
          deliveredIn: 0,
          extraMonths: 0,
          commission: 0,
          fixedFees: 0
        },
        monthlyData: Array.from({ length: 34 }, () => (_.cloneDeep(initialMonthData))),
        totalMonthlyData: Array.from({ length: 34 }, () => ({ amount: 0 }))
      }));
      // Update the state with the new customerSegments array

      setCustomerSegments(newCustomerSegments);
      const newReturnReworks = objectListTest.map((item) => ({
        name: item.name,
        percentOfRevenue: 0,
        monthlyData: _.cloneDeep(initialMonthlyData)
      }));
      const newReturnReworksWithTotal = newReturnReworks.map((item) => ({
        ...item,
        totalMonthly: _.cloneDeep(initialMonthlyData)
      }));
      setReturnReworks(newReturnReworksWithTotal);

      const materialExpensesNames = ["Overall Material/Supplies", "Overall Contract Labor", "Material/Supplies", "Contract Labor", "Packaging", "Shipping"]
      const newProductionRelated = objectListTest.map((item) => ({
        name: item.name,
        expensesList: materialExpensesNames.map((name) => ({
          sourceName: name,
          monthlyData: _.cloneDeep(initialMonthlyData),
        }))
      }));
      const newProductionRelatedWithTotal = newProductionRelated.map((item) => ({
        ...item,
        totalMonthly: _.cloneDeep(initialMonthlyData)
      }));
      setProductionRelated(newProductionRelatedWithTotal);

    }

    const newDistributions = {
      includeInvestments: true,
      percentOfIncomeDistributed: 0,
      withInvestments: _.cloneDeep(initialMonthlyData), // Deep copy of initialMonthlyData
      withoutInvestments: _.cloneDeep(initialMonthlyData) // Another deep copy of initialMonthlyData
    };
    setDistributions(newDistributions);

    const newCashOnHand = {
      excludeDepreciation: true,
      initialCashOnHand: 0,
      withDepreciation: _.cloneDeep(initialMonthlyData),
      withoutDepreciation: _.cloneDeep(initialMonthlyData)
    }
    setCashOnHand(newCashOnHand);

    const newFoundersDraw = {
      numberOfFounders: 1,
      foundersShare: 1,
      foundersDrawPayArray: Array.from({length: 1}, () => _.cloneDeep(initialMonthlyData)),
      totalMonthly: _.cloneDeep(initialMonthlyData)
    }
    setFoundersDraw(newFoundersDraw);

    const newFixedAssets = {
      newAcquisitions:  _.cloneDeep(initialMonthlyData),
      depreciation:  _.cloneDeep(initialMonthlyData),
      totalMonthly: _.cloneDeep(initialMonthlyData)
    }
    setFixedAssets(newFixedAssets);
    
  }, []); // Execute effect whenever objectList prop changes
  const handleYesInclude = () => {
    const copy = _.cloneDeep(Distributions);
    copy.includeInvestments = true;
    setDistributions(copy);
  }
  const handleNoInclude = () => {
    const copy = _.cloneDeep(Distributions);
    copy.includeInvestments = false;
    setDistributions(copy);
  }
  const handleYesExclude = () => {
    const copy = _.cloneDeep(cashOnHand);
    copy.excludeDepreciation = true;
    setCashOnHand(copy);
  }
  const handleNoExclude = () => {
    const copy = _.cloneDeep(cashOnHand);
    copy.excludeDepreciation = false;
    setCashOnHand(copy);
  }
  const handlePayrollValueChange = (index, event) => {
    const newValue = parseFloat(event.target.value) || 0;  // Default to 0 if invalid input

    setPayRollTaxesAndBenefits(prevState => ({
        ...prevState,
        payrollList: prevState.payrollList.map((item, idx) => {
            if (idx === index) {
                return { ...item, value: newValue };
            }
            return item;
        })
    }));
  };
  const calculatePayrollMonthlyData = () => {
    setPayRollTaxesAndBenefits(prevState => {
        const newPayrollList = [...prevState.payrollList];
        const medicareRate = findPayrollItemRate(newPayrollList, "Medicare");
        const socialSecurityRate = findPayrollItemRate(newPayrollList, "Social Security (Rate)");

        // Assume you have functions to fetch these totalMonthly sums:
        const totalSalary = getTotalMonthlyByCategory(salariedWorkers);
        const totalFullTime = getTotalMonthlyByCategory(fullTimeWorkers);
        const totalPartTime = getTotalMonthlyByCategory(partTimeWorkers);
        const totalFounders = selectedValue === "option1" ? getTotalMonthlyByCategory(foundersDraw) : [];

        const totalForCalculations = totalSalary.map((item, index) => ({
            amount: item.amount + totalFullTime[index].amount + totalPartTime[index].amount + (totalFounders[index] ? totalFounders[index].amount : 0)
        }));

        updatePayrollItemMonthlyData(newPayrollList, "Medicare", totalForCalculations, medicareRate);
        updatePayrollItemMonthlyData(newPayrollList, "Social Security (Rate)", totalForCalculations, socialSecurityRate);

        return {
            ...prevState,
            payrollList: newPayrollList
        };
    });
  };

  function findPayrollItemRate(payrollList, itemName) {
      const item = payrollList.find(p => p.sourceName === itemName);
      return item ? item.value : 0;
  }

  function getTotalMonthlyByCategory(categoryState) {
      return categoryState.totalMonthly.map(month => ({ amount: month.amount }));
  }

  function updatePayrollItemMonthlyData(payrollList, itemName, totalMonthly, rate) {
      const index = payrollList.findIndex(item => item.sourceName === itemName);
      if (index !== -1) {
          payrollList[index].monthlyData = payrollList[index].monthlyData.map((data, monthIndex) => {
              return {
                  ...data,
                  amount: totalMonthly[monthIndex].amount * rate
              };
          });
      }
  }
  function updateTotalMonthly(workersList, monthIndex, setWorkersHeadCount) {
    // Calculate the sum of amounts for the specified month across all workers
    const totalForMonth = workersList.reduce((total, worker) => {
        return total + (worker.monthlyData[monthIndex].amount || 0);
    }, 0);

    // Update the totalMonthly array in the workersHeadCount state
    setWorkersHeadCount(prevState => {
        let newTotalMonthly = [...prevState.totalMonthly];
        newTotalMonthly[monthIndex] = { ...newTotalMonthly[monthIndex], amount: totalForMonth };

        return {
            ...prevState,
            totalMonthly: newTotalMonthly
        };
    });
  }
  const handlePartTimeDescriptionChange = (index, event) => {
    const newDescription = event.target.value;
  
    setPartTimeWorkers(prevState => ({
      ...prevState,
      workersList: prevState.workersList.map((worker, i) => {
        if (i === index) {
          return { ...worker, description: newDescription };
        }
        return worker;
      })
    }));
  };
  
  const handlePartTimeSalaryChange = (index, event) => {
    const newSalary = parseFloat(event.target.value) || 0;
  
    setPartTimeWorkers(prevState => {
      const updatedWorkersList = prevState.workersList.map((worker, wIdx) => {
        if (wIdx === index) {
          return { ...worker, monthlySalary: newSalary };
        }
        return worker;
      });
  
      // Calculate the sum of all monthly salaries
      const totalMonthlySalaries = updatedWorkersList.reduce((acc, worker) => acc + worker.monthlySalary, 0);
  
      // Recalculate totals for each month
      const updatedTotalMonthly = prevState.totalMonthly.map((total, tIdx) => {
        const sumOfAmounts = updatedWorkersList.reduce((acc, worker) => acc + (worker.monthlyData[tIdx].amount || 0), 0);
        const totalForMonth = totalMonthlySalaries * sumOfAmounts;
        return { ...total, amount: totalForMonth };
      });
  
      return {
        ...prevState,
        workersList: updatedWorkersList,
        totalMonthly: updatedTotalMonthly
      };
    });
  };
  const handlePartTimeMonthlyDataChange = (workerIndex, monthIndex, event) => {
    const newAmount = parseFloat(event.target.value) || 0;

    setPartTimeWorkers(prevState => {
        // Update the individual monthly data for the specific worker
        const updatedWorkersList = prevState.workersList.map((worker, wIdx) => {
            if (wIdx === workerIndex) {
                const updatedMonthlyData = worker.monthlyData.map((data, mDataIdx) => {
                    if (mDataIdx === monthIndex) {
                        return { ...data, amount: newAmount };
                    }
                    return data;
                });
                return { ...worker, monthlyData: updatedMonthlyData };
            }
            return worker;
        });

        // Calculate the sum of all monthly salaries
        const totalMonthlySalaries = updatedWorkersList.reduce((acc, worker) => acc + worker.monthlySalary, 0);
        
        // Prepare sums of amounts for each month across all workers before state updates
        const sumsOfAmounts = updatedWorkersList[0].monthlyData.map((_, tIdx) => 
            updatedWorkersList.reduce((acc, worker) => acc + (worker.monthlyData[tIdx].amount || 0), 0)
        );

        // Update the totalMonthly using the product of sums
        const updatedTotalMonthly = prevState.totalMonthly.map((total, tIdx) => ({
            ...total,
            amount: totalMonthlySalaries * sumsOfAmounts[tIdx]
        }));

        // Update the workersHeadCount for part-time workers
        setWorkersHeadCount(headCounts => ({
            ...headCounts,
            partTimeHeadCount: headCounts.partTimeHeadCount.map((count, cIdx) => ({
                ...count,
                amount: sumsOfAmounts[cIdx]
            }))
        }));
        updateTotalMonthly(updatedWorkersList, monthIndex, setWorkersHeadCount);
        return {
            ...prevState,
            workersList: updatedWorkersList,
            totalMonthly: updatedTotalMonthly
        };
    });
  };
  const handleFullTimeMonthlyDataChange = (workerIndex, monthIndex, event) => {
    const newAmount = parseFloat(event.target.value) || 0;

    setFullTimeWorkers(prevState => {
        // Update the individual monthly data for the specific worker
        const updatedWorkersList = prevState.workersList.map((worker, wIdx) => {
            if (wIdx === workerIndex) {
                const updatedMonthlyData = worker.monthlyData.map((data, mDataIdx) => {
                    if (mDataIdx === monthIndex) {
                        return { ...data, amount: newAmount };
                    }
                    return data;
                });
                return { ...worker, monthlyData: updatedMonthlyData };
            }
            return worker;
        });

        // Calculate the sum of all monthly salaries
        const totalMonthlySalaries = updatedWorkersList.reduce((acc, worker) => acc + worker.monthlySalary, 0);
        
        // Prepare sums of amounts for each month across all workers before state updates
        const sumsOfAmounts = updatedWorkersList[0].monthlyData.map((_, tIdx) => 
            updatedWorkersList.reduce((acc, worker) => acc + (worker.monthlyData[tIdx].amount || 0), 0)
        );

        // Update the totalMonthly using the product of sums
        const updatedTotalMonthly = prevState.totalMonthly.map((total, tIdx) => ({
            ...total,
            amount: totalMonthlySalaries * sumsOfAmounts[tIdx]
        }));

        // Update the workersHeadCount for full-time workers
        setWorkersHeadCount(headCounts => ({
            ...headCounts,
            fullTimeHeadCount: headCounts.fullTimeHeadCount.map((count, cIdx) => ({
                ...count,
                amount: sumsOfAmounts[cIdx]
            }))
        }));
        updateTotalMonthly(updatedWorkersList, monthIndex, setWorkersHeadCount);
        return {
            ...prevState,
            workersList: updatedWorkersList,
            totalMonthly: updatedTotalMonthly
        };
    });
  };
  const handleFullTimeDescriptionChange = (index, event) => {
    const newDescription = event.target.value;
  
    setFullTimeWorkers(prevState => ({
      ...prevState,
      workersList: prevState.workersList.map((worker, i) => {
        if (i === index) {
          return { ...worker, description: newDescription };
        }
        return worker;
      })
    }));
  };
  
  const handleFullTimeSalaryChange = (index, event) => {
    const newSalary = parseFloat(event.target.value) || 0;

    setFullTimeWorkers(prevState => {
        const updatedWorkersList = prevState.workersList.map((worker, wIdx) => {
            if (wIdx === index) {
                return { ...worker, monthlySalary: newSalary };
            }
            return worker;
        });

        // Calculate the sum of all monthly salaries
        const totalMonthlySalaries = updatedWorkersList.reduce((acc, worker) => acc + worker.monthlySalary, 0);

        // Calculate the new totals for each month based on the updated monthly salaries
        const updatedTotalMonthly = prevState.totalMonthly.map((total, tIdx) => {
            const sumOfAmounts = updatedWorkersList.reduce((acc, worker) => acc + (worker.monthlyData[tIdx].amount || 0), 0);
            const totalForMonth = totalMonthlySalaries * sumOfAmounts;
            return { ...total, amount: totalForMonth };
        });

        return {
            ...prevState,
            workersList: updatedWorkersList,
            totalMonthly: updatedTotalMonthly
        };
    });
  };
  const addNewWorker = () => {
    const newWorker = {
      description: "New Worker",
      monthlySalary: 0,
      monthlyData: _.cloneDeep(initialMonthlyData)
    };
  
    setSalariedWorkers(prevState => ({
      ...prevState,
      workersList: [...prevState.workersList, newWorker]
    }));
  };
  const addNewFullTimeWorker = () => {
    const newWorker = {
        description: "New Full-Time Worker",
        monthlySalary: 0,
        monthlyData: _.cloneDeep(initialMonthlyData)
    };

    setFullTimeWorkers(prevState => ({
        ...prevState,
        workersList: [...prevState.workersList, newWorker]
    }));
  };
  const addNewPartTimeWorker = () => {
    const newWorker = {
        description: "New Part-Time Worker",
        monthlySalary: 0,
        monthlyData: _.cloneDeep(initialMonthlyData)
    };

    setPartTimeWorkers(prevState => ({
        ...prevState,
        workersList: [...prevState.workersList, newWorker]
    }));
  };
  const handleMonthlyDataChange = (workerIndex, monthIndex, event) => {
    const newAmount = parseFloat(event.target.value) || 0;

    setSalariedWorkers(prevState => {
        // Update the monthly data for the specific worker
        const updatedWorkersList = prevState.workersList.map((worker, wIdx) => {
            if (wIdx === workerIndex) {
                const updatedMonthlyData = worker.monthlyData.map((data, mDataIdx) => {
                    if (mDataIdx === monthIndex) {
                        return { ...data, amount: newAmount };
                    }
                    return data;
                });
                return { ...worker, monthlyData: updatedMonthlyData };
            }
            return worker;
        });

        // Calculate the sum of all monthly salaries
        const totalMonthlySalaries = updatedWorkersList.reduce((acc, worker) => acc + worker.monthlySalary, 0);

        // Prepare sums of amounts for each month across all workers before state updates
        const sumsOfAmounts = updatedWorkersList[0].monthlyData.map((_, tIdx) => 
            updatedWorkersList.reduce((acc, worker) => acc + (worker.monthlyData[tIdx].amount || 0), 0)
        );

        // Update the totalMonthly using the product of sums
        const updatedTotalMonthly = prevState.totalMonthly.map((total, tIdx) => ({
            ...total,
            amount: totalMonthlySalaries * sumsOfAmounts[tIdx]
        }));

        // Update the salariedHeadCount state in workersHeadCount
        setWorkersHeadCount(headCounts => ({
            ...headCounts,
            salariedHeadCount: headCounts.salariedHeadCount.map((count, cIdx) => ({
                ...count,
                amount: sumsOfAmounts[cIdx]
            }))
        }));
        // After updating the workers, call updateTotalMonthlyForHeadCount to adjust the totalMonthly
        updateTotalMonthly(updatedWorkersList, monthIndex, setWorkersHeadCount);
        return {
            ...prevState,
            workersList: updatedWorkersList,
            totalMonthly: updatedTotalMonthly
        };
    });
  };
  const handleDescriptionChange = (index, event) => {
    const newDescription = event.target.value;
  
    setSalariedWorkers(prevState => ({
      ...prevState,
      workersList: prevState.workersList.map((worker, i) => {
        if (i === index) {
          return { ...worker, description: newDescription };
        }
        return worker;
      })
    }));
  };
  
  const handleSalaryChange = (index, event) => {
    const newSalary = parseFloat(event.target.value) || 0;
  
    setSalariedWorkers(prevState => {
      // Update the monthly salary for the specific worker
      const updatedWorkersList = prevState.workersList.map((worker, wIdx) => {
        if (wIdx === index) {
          return { ...worker, monthlySalary: newSalary };
        }
        return worker;
      });
  
      // Calculate the sum of all monthly salaries
      const totalMonthlySalaries = updatedWorkersList.reduce((acc, worker) => acc + worker.monthlySalary, 0);
  
      // Recalculate totals for each month using the product of sums
      const updatedTotalMonthly = prevState.totalMonthly.map((total, tIdx) => {
        const sumOfAmounts = updatedWorkersList.reduce((acc, worker) => acc + (worker.monthlyData[tIdx].amount || 0), 0);
        const totalForMonth = totalMonthlySalaries * sumOfAmounts;
        return { ...total, amount: totalForMonth };
      });
  
      return {
        ...prevState,
        workersList: updatedWorkersList,
        totalMonthly: updatedTotalMonthly
      };
    });
  };
  const addOtherNewExpense = () => {
    setOtherExpenses(prevState => ({
      ...prevState,
      expensesList: [
        ...prevState.expensesList,
        { sourceName: "New Expense", monthlyData: _.cloneDeep(initialMonthlyData) }
      ]
    }));
  };
  const handleExpenseAmountChange = (expenseIndex, monthIndex, event) => {
    const newAmount = parseFloat(event.target.value) || 0;
  
    setOtherExpenses(prevState => ({
      ...prevState,
      expensesList: prevState.expensesList.map((expense, expIdx) => {
        if (expIdx === expenseIndex) {
          const updatedMonthlyData = expense.monthlyData.map((month, mIdx) => {
            if (mIdx === monthIndex) {
              return { ...month, amount: newAmount };
            }
            return month;
          });
          return { ...expense, monthlyData: updatedMonthlyData };
        }
        return expense;
      })
    }));
  };
  const handleExpenseNameChange = (index, event) => {
    const newName = event.target.value;
  
    setOtherExpenses(prevState => ({
      ...prevState,
      expensesList: prevState.expensesList.map((expense, i) => {
        if (i === index) {
          return { ...expense, sourceName: newName };
        }
        return expense;
      })
    }));
  };
  const handleProductionChange = (outerIndex, expenseIndex, monthIndex, event) => {
    const newAmount = parseFloat(event.target.value) || 0; // Convert input to a number
  
    setProductionRelated(prevState => {
      return prevState.map((item, idx) => {
        if (idx === outerIndex) {
          const updatedExpenses = item.expensesList.map((expense, eIdx) => {
            if (eIdx === expenseIndex) {
              const updatedMonthlyData = expense.monthlyData.map((monthData, mIdx) => {
                if (mIdx === monthIndex) {
                  return { ...monthData, amount: newAmount };
                }
                return monthData;
              });
              return { ...expense, monthlyData: updatedMonthlyData };
            }
            return expense;
          });
  
          return { ...item, expensesList: updatedExpenses };
        }
        return item;
      });
    });
  };
  const handleTravelChange = (index, indexM, event) => {
    const newAmount = parseFloat(event.target.value) || 0; // Convert input to a number, defaulting to 0 if invalid
  
    setTravelVehicleRelated(prevState => {
      // Update the monthly data for the specific expense item
      const updatedExpenses = prevState.expensesList.map((expense, expIndex) => {
        if (expIndex === index) {
          const updatedMonthlyData = expense.monthlyData.map((monthData, monthIndex) => {
            if (monthIndex === indexM) {
              return { ...monthData, amount: newAmount };
            }
            return monthData;
          });
          return { ...expense, monthlyData: updatedMonthlyData };
        }
        return expense;
      });
  
      // Recalculate totals
      const updatedTotalMonthly = prevState.totalMonthly.map((total, monthIndex) => {
        const sum = updatedExpenses.reduce((sum, { monthlyData }) => sum + monthlyData[monthIndex].amount, 0);
        return { ...total, amount: sum };
      });
  
      return {
        expensesList: updatedExpenses,
        totalMonthly: updatedTotalMonthly
      };
    });
  };
  
  const handleBankingChange = (index, indexM, event) => {
    const newAmount = parseFloat(event.target.value) || 0; // Convert the input to a number, defaulting to 0 if invalid
  
    setBankingFees(prevState => {
      // Update the monthly data for the specific expense item
      const updatedExpenses = prevState.expensesList.map((expense, expIndex) => {
        if (expIndex === index) {
          const updatedMonthlyData = expense.monthlyData.map((monthData, monthIndex) => {
            if (monthIndex === indexM) {
              return { ...monthData, amount: newAmount };
            }
            return monthData;
          });
          return { ...expense, monthlyData: updatedMonthlyData };
        }
        return expense;
      });
  
      // Recalculate totals
      const updatedTotalMonthly = prevState.totalMonthly.map((total, monthIndex) => {
        const sum = updatedExpenses.reduce((sum, { monthlyData }) => sum + monthlyData[monthIndex].amount, 0);
        return { ...total, amount: sum };
      });
  
      return {
        expensesList: updatedExpenses,
        totalMonthly: updatedTotalMonthly
      };
    });
  };
  const handleOfficeChange = (index, indexM, event) => {
    const newAmount = parseFloat(event.target.value) || 0;  // Convert the input to a number, defaulting to 0 if invalid
  
    setOfficeGeneralBusiness(prevState => {
      // Update the monthly data for the specific expense item
      const updatedExpenses = prevState.expensesList.map((expense, expIndex) => {
        if (expIndex === index) {
          const updatedMonthlyData = expense.monthlyData.map((monthData, monthIndex) => {
            if (monthIndex === indexM) {
              return { ...monthData, amount: newAmount };
            }
            return monthData;
          });
          return { ...expense, monthlyData: updatedMonthlyData };
        }
        return expense;
      });
  
      // Recalculate totals
      const updatedTotalMonthly = prevState.totalMonthly.map((total, monthIndex) => {
        const sum = updatedExpenses.reduce((sum, { monthlyData }) => sum + monthlyData[monthIndex].amount, 0);
        return { ...total, amount: sum };
      });
  
      return {
        expensesList: updatedExpenses,
        totalMonthly: updatedTotalMonthly
      };
    });
  };
  const handleServiceChange = (index, indexM, event) => {
    const newAmount = parseFloat(event.target.value) || 0;  // Convert the input to a number, defaulting to 0 if invalid
  
    setLegalAndProfessionalServices(prevState => {
      // Update the monthly data for the specific expense item
      const updatedExpenses = prevState.expensesList.map((expense, expIndex) => {
        if (expIndex === index) {
          const updatedMonthlyData = expense.monthlyData.map((monthData, monthIndex) => {
            if (monthIndex === indexM) {
              return { ...monthData, amount: newAmount };
            }
            return monthData;
          });
          return { ...expense, monthlyData: updatedMonthlyData };
        }
        return expense;
      });
  
      // Recalculate totals
      const updatedTotalMonthly = prevState.totalMonthly.map((total, monthIndex) => {
        const sum = updatedExpenses.reduce((sum, { monthlyData }) => sum + monthlyData[monthIndex].amount, 0);
        return { ...total, amount: sum };
      });
  
      return {
        expensesList: updatedExpenses,
        totalMonthly: updatedTotalMonthly
      };
    });
  };
  const handlePropertyChange = (index, indexM, event) => {
    const newAmount = parseFloat(event.target.value); // Ensure the input is treated as a float
    console.log(`New amount for expense ${index} month ${indexM}: ${newAmount}`);
    setPropertyRelated(prevState => {
      const updatedExpenses = prevState.expensesList.map((expense, expIndex) => {
        if (expIndex === index) {
          // Update only the specific month data of the specific expense
          const updatedMonthlyData = expense.monthlyData.map((data, monthIndex) => {
            if (monthIndex === indexM) {
              return { ...data, amount: newAmount }; // Update the amount for the changed month
            }
            return data; // Return existing data for other months
          });
          return { ...expense, monthlyData: updatedMonthlyData };
        }
        return expense;
      });
  
      // Recalculate totals for each month
      const updatedTotalMonthly = prevState.totalMonthly.map((total, monthIndex) => {
        const sum = updatedExpenses.reduce((acc, curr) => acc + (curr.monthlyData[monthIndex].amount || 0), 0);
        return { ...total, amount: sum };
      });
  
      return {
        ...prevState,
        expensesList: updatedExpenses,
        totalMonthly: updatedTotalMonthly
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const finalTotalAllExpenses = _.cloneDeep(totalExpenses);
    const finalDistributions = _.cloneDeep(Distributions);
    const finalCashOnHand = _.cloneDeep(cashOnHand);
  
    // Helper function to calculate distribution amounts
    const calculateDistribution = (incomeAmount, reduction = 0) => {
      return (incomeAmount - reduction) * finalDistributions.percentOfIncomeDistributed;
    };
  
    // Update distribution amounts based on whether investments are included
    finalDistributions.withInvestments.forEach((month, index) => {
      month.amount = calculateDistribution(totalAllIncome[index].amount);
    });
    finalDistributions.withoutInvestments.forEach((month, index) => {
      month.amount = calculateDistribution(totalAllIncome[index].amount, fundingInvestment.totalMonthly[index].amount);
    });
   

    // Helper function to update cash on hand
    const updateCashOnHand = (includeDepreciation) => {
      finalCashOnHand[includeDepreciation ? 'withDepreciation' : 'withoutDepreciation'].forEach((month, index) => {
        const previousAmount = index === 0 ? finalCashOnHand.initialCashOnHand : finalCashOnHand[includeDepreciation ? 'withDepreciation' : 'withoutDepreciation'][index-1].amount;
        const depreciation = includeDepreciation ? fixedAssets.depreciation[index].amount : 0;
        const distribution = finalDistributions[finalDistributions.includeInvestments ? 'withInvestments' : 'withoutInvestments'][index].amount;
        month.amount = previousAmount + totalAllIncome[index].amount - distribution - totalExpenses[index].amount - depreciation;
      });
    };
  
    // Calculate cash on hand for both scenarios
    updateCashOnHand(true); // with depreciation
    updateCashOnHand(false); // without depreciation
  
    // Clone and calculate totals for founders draw and production-related expenses
    const newFoundersDraw = _.cloneDeep(foundersDraw);
   

    const productionRelatedPerMonth = new Array(initialMonthlyData.length).fill(0);
    _.cloneDeep(productionRelated).forEach(item => {
      item.totalMonthly.forEach((value, index) => {
        productionRelatedPerMonth[index] += value;
      });
    });
    const returnReworksEachMonth = returnReworks.reduce((acc, item) => {
      item.totalMonthly.forEach((amount, index) => {
        if (acc[index] === undefined) {
          acc[index] = 0; // Initialize if not already set
        }
        acc[index] += amount; // Add the amount at this index
      });
      return acc;
    }, []);
    
    
    // Calculate and update total expenses per month
    finalTotalAllExpenses.forEach((month, index) => {
      month.amount = newFoundersDraw.foundersDrawPayArray[0][index].amount
        + marketingExpenses.totalMonthly[index].amount
        + returnReworksEachMonth[index]
        
        + fixedAssets.totalMonthly[index].amount
        + propertyRelated.totalMonthly[index].amount
        + legalAndProfessionalServices.totalMonthly[index].amount
        + officeGeneralBusiness.totalMonthly[index].amount
        + bankingFees.totalMonthly[index].amount
        
        + travelVehicleRelated.totalMonthly[index].amount
        + productionRelatedPerMonth[index]
        + otherExpenses.totalMonthly[index].amount
        + salariedWorkers.totalMonthly[index].amount
        
        + fullTimeWorkers.totalMonthly[index].amount
        + partTimeWorkers.totalMonthly[index].amount
        + payRollTaxesAndBenefits.totalMonthly[index].amount;
        
      });

      
    console.log("End5");
    // Log the final states for debugging
    console.log('Final Cash on Hand:', finalCashOnHand);
    console.log('Final Distributions:', finalDistributions);
    console.log('Final Total All Expenses:', finalTotalAllExpenses);
    const userData = {
      year2: {
        customerSegments: _.cloneDeep(customerSegments),
        additionalRevenue: _.cloneDeep(additionalRevenue),
        fundingInvestment: _.cloneDeep(fundingInvestment),
        totalAllIncome: [...totalAllIncome],
        distributions: _.cloneDeep(finalDistributions),
        cashOnHand: _.cloneDeep(finalCashOnHand),
        totalExpenses: [...finalTotalAllExpenses],
        foundersDraw: _.cloneDeep(foundersDraw),
        returnReworks: _.cloneDeep(returnReworks),
        marketingExpenses: _.cloneDeep(marketingExpenses),
        fixedAssets: _.cloneDeep(fixedAssets),
        propertyRelated: _.cloneDeep(propertyRelated),
        legalAndProfessionalServices: _.cloneDeep(legalAndProfessionalServices),
        officeGeneralBusiness: _.cloneDeep(officeGeneralBusiness),
        bankingFees: _.cloneDeep(bankingFees),
        travelVehicleRelated: _.cloneDeep(travelVehicleRelated),
        productionRelated: _.cloneDeep(productionRelated),
        otherExpenses: _.cloneDeep(otherExpenses),
        salariedWorkers: _.cloneDeep(salariedWorkers),
        fullTimeWorkers: _.cloneDeep(fullTimeWorkers),
        partTimeWorkers: _.cloneDeep(partTimeWorkers),
        workersHeadCount: _.cloneDeep(workersHeadCount),
        payRollTaxesAndBenefits: _.cloneDeep(payRollTaxesAndBenefits)
      }
           
    }
    
    try {
      console.log(userData);
      const response = await year2Submit(mainFormId, userData);

    }
    catch (error) {
      console.error("Failted to submit form", error);
    }
  };

  
  const sumArray = (arr1, arr2) => {
    const result = [];
    for (let i = 0; i < arr1.length; i++) {
      result.push({ amount: arr1[i].amount + arr2[i].amount });
    }
    return result;
  };
  useEffect(() => {
    const newTotalMonthly = sumArray(additionalRevenue.totalMonthly, fundingInvestment.totalMonthly);
    let totalMonthly = [...newTotalMonthly]; // Initialize with newTotalMonthly

    customerSegments.forEach(item => {
      totalMonthly = sumArray(totalMonthly, item.totalMonthlyData); // Accumulate the total monthly data
    });

    setTotalIncome(totalMonthly);
    
    

  }, [fundingInvestment, additionalRevenue, customerSegments]);
  
  const handleChange = (index, field, value) => {
    const updatedSegments = _.cloneDeep(customerSegments);
    updatedSegments[index].inputData[field] = +value;
    updatedSegments[index].monthlyData.forEach(month => month.ExtraFromPreviousMonths = 0);
    
    // Loop through each month to recalculate based on the current numbers sold
    updatedSegments[index].monthlyData.forEach((monthData, currentMonth) => {
      const numbersSold = monthData.NumbersSold;
      const { deposit, deliveredIn, extraMonths, commission, fixedFees } = updatedSegments[index].inputData;
      const depositPercent = deposit / 100;
      const itemPrice = updatedSegments[index].price;
      const depositAmount = Math.ceil(itemPrice * depositPercent);
      const commissionPercentage = commission/100;
      monthData.Deposit = depositAmount * numbersSold;
  
      const amountDue = (itemPrice * numbersSold) - (depositAmount * numbersSold);
      const amountPerMonth = amountDue / (extraMonths + 1);
      const startingMonth = currentMonth + deliveredIn;
      if ((startingMonth)<34) {
        updatedSegments[index].monthlyData[startingMonth].Original = Math.ceil(amountPerMonth);
      }
      // Apply the calculated changes to all relevant future months
      for (let i = startingMonth+1; i < updatedSegments[index].monthlyData.length && i <= startingMonth + extraMonths; i++) {
        updatedSegments[index].monthlyData[i].ExtraFromPreviousMonths += Math.ceil(amountPerMonth);
      }
      monthData.commission = ((monthData.Deposit+monthData.Original+monthData.ExtraFromPreviousMonths)*commissionPercentage);
      monthData.fixedFees = (fixedFees*numbersSold);
    });
  
    // Recalculate the total for each month
    updatedSegments[index].totalMonthlyData = updatedSegments[index].monthlyData.map((data) => {
      const totalAmount = (data.Original + data.ExtraFromPreviousMonths + data.Deposit) - (data.commission + data.fixedFees);
      return { amount: totalAmount };
    });
  
    // Update the main state with the new customerSegments array
    setCustomerSegments(updatedSegments);
  };
  const handleChangeMonthlyData = (index, indexM, field, value) => {
    const updatedSegments = _.cloneDeep(customerSegments);  
    updatedSegments[index].monthlyData[indexM].NumbersSold = +value;  // Directly update the numbers sold for the selected month
    // Reset ExtraFromPreviousMonths to 0 for recalculation
    updatedSegments[index].monthlyData.forEach(month => month.ExtraFromPreviousMonths = 0);
    // Calculate the total numbers sold after the update
    const totalNumbersSold = updatedSegments[index].monthlyData.reduce((acc, month) => acc + month.NumbersSold, 0);
    
    // Update the numberToSell for the segment
    updatedSegments[index].numberToSell = updatedSegments[index].numbersToSellOriginal - totalNumbersSold;
  
    // Loop through each month to recalculate based on the current numbers sold
    updatedSegments[index].monthlyData.forEach((monthData, currentMonth) => {
      const numbersSold = monthData.NumbersSold;
      const { deposit, deliveredIn, extraMonths, commission, fixedFees } = updatedSegments[index].inputData;
      const depositPercent = deposit / 100;
      const itemPrice = updatedSegments[index].price;
      const depositAmount = Math.ceil(itemPrice * depositPercent);
      const commissionPercentage = commission/100;
      monthData.Deposit = depositAmount * numbersSold;
  
      const amountDue = (itemPrice * numbersSold) - (depositAmount * numbersSold);
      const amountPerMonth = amountDue / (extraMonths + 1);
      const startingMonth = currentMonth + deliveredIn;
      if ((startingMonth)<34) {
        updatedSegments[index].monthlyData[startingMonth].Original = Math.ceil(amountPerMonth);
      }
      // Apply the calculated changes to all relevant future months
      for (let i = startingMonth+1; i < updatedSegments[index].monthlyData.length && i <= startingMonth + extraMonths; i++) {
        updatedSegments[index].monthlyData[i].ExtraFromPreviousMonths += Math.ceil(amountPerMonth);
      }
      monthData.commission = ((monthData.Deposit+monthData.Original+monthData.ExtraFromPreviousMonths)*commissionPercentage);
      monthData.fixedFees = (fixedFees*numbersSold);
    });
  
    // Recalculate the total for each month
    updatedSegments[index].totalMonthlyData = updatedSegments[index].monthlyData.map((data) => {
      const totalAmount = (data.Original + data.ExtraFromPreviousMonths + data.Deposit) - (data.commission + data.fixedFees);
      return { amount: totalAmount };
    });
  
    // Update the main state with the new customerSegments array
    setCustomerSegments(updatedSegments);
  };
  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleSourceNameChange = (stateName, index, newName) => {
    if (stateName==="additional_revenue") {
      const newSourceNames = [...additionalRevenue.sourceNames];
      newSourceNames[index] = newName;
      setAdditionalRevenue(prev => ({ ...prev, sourceNames: newSourceNames }));
    } else if (stateName==="funding_investment") {
      const newSourceNames = [...fundingInvestment.sourceNames];
      newSourceNames[index] = newName;
      setFundingInv(prev => ({ ...prev, sourceNames: newSourceNames }));
    }
    console.log(additionalRevenue.sourceNames[index]);
    
  };
  const handleAmountChange = (stateName, sourceIndex, monthIndex, newValue) => {
    if (stateName==="additional_revenue") {
      setAdditionalRevenue(prev => {
        // Update specific source amount at the given month index
        const newSources = [...prev.sources];
        newSources[sourceIndex][monthIndex] = { ...newSources[sourceIndex][monthIndex], amount: parseFloat(newValue) || 0 };
  
        // Recalculate the total for the month across all sources
        const newTotalMonthly = prev.totalMonthly.map((total, idx) => {
          if (idx === monthIndex) {
            // Sum up all sources' amounts for this month
            const sum = newSources.reduce((acc, source) => acc + (source[idx].amount || 0), 0);
            return { ...total, amount: sum };
          }
          return total;
        });
  
        return { ...prev, sources: newSources, totalMonthly: newTotalMonthly };
      });

    } else if (stateName==="funding_investment") {
      setFundingInv(prev => {
    // Create a new copy of sources to ensure immutability
        const newSources = prev.sources.map((source, idx) => {
          if (idx === sourceIndex) {
            // Only update the month's amount for the current source
            return source.map((data, idx) => idx === monthIndex ? { ...data, amount: parseFloat(newValue) || 0 } : data);
          }
          return source;
        });
        // Calculate new totals for the updated month
        const newTotalMonthly = prev.totalMonthly.map((total, idx) => {
          if (idx === monthIndex) {
            // Sum up all sources' amounts for the current month
            const sum = newSources.reduce((acc, source) => acc + (source[idx].amount || 0), 0);
            return { ...total, amount: sum };
          }
          return total;
        });

        return {
          ...prev,
          sources: newSources,
          totalMonthly: newTotalMonthly
        };
      });
    }
  };
  const handleInputChange = (index, indexM, event) => {
    const newAmount = event.target.value; // Capture the new input value
  
    // Create a new state object based on the current state
    setMarketingExpenses(prevExpenses => {
      // Create a deep copy of expensesList to avoid direct state mutation
      const updatedExpenses = [...prevExpenses.expensesList];
  
      // Update the specific month's data for the specific source
      updatedExpenses[index].monthlyData[indexM] = newAmount;
  
      return {
        ...prevExpenses, // Spread the rest of the previous state
        expensesList: updatedExpenses // Implement the update
      };
    });
  };
  const addNewExpense = (stateName) => {
    const newExpense = { sourceName: 'Other', monthlyData: _.cloneDeep(initialMonthlyData) };
    // Assuming setMarketingExpenses is a useState setter function
    if (stateName === "MarketingExpenses") {
      setMarketingExpenses(prev => ({
        ...prev,
        expensesList: [...prev.expensesList, newExpense],
        totalMonthly: prev.totalMonthly.map(total => ({
          ...total,
          amount: total.amount // No change needed, just 0 added
        }))
      }));
    }
  };
  const handleReworksChange = (index, value) => {
    const newValue = +value;
    const newReworks = _.cloneDeep(returnReworks);
    newReworks[index].percentOfRevenue = newValue;
    const result = [];
    for (let i = 0; i < 12; i++) {
      let newAmount = (newReworks[index].monthlyData[i].amount + totalAllIncome[i].amount)*(newValue/100);
      result.push({ amount: newAmount });
    }
    newReworks[index].monthlyData = [...result];

    
    setReturnReworks(newReworks);
  };
const addNewSource = (stateName) => {
  // Define a helper function to update the state
  const updateState = (setterFunction, newStateName) => {
    setterFunction(prev => {
      const newSource = Array.from({ length: 12 }, () => ({ amount: 0 }));
      const newSourceName = newStateName === "additional_revenue" ? ' ' : ' ';

      const newSourceNames = [...prev.sourceNames, newSourceName];
      const newSources = [...prev.sources, newSource];
      const newTotalMonthly = prev.totalMonthly.map(total => ({
        ...total,
        amount: total.amount // No change needed, just 0 added
      }));

      return {
        ...prev,
        sourceNames: newSourceNames,
        sources: newSources,
        totalMonthly: newTotalMonthly
      };
    });
  };

  // Decide which state to update based on the stateName
  if (stateName === "additional_revenue") {
    updateState(setAdditionalRevenue, "additional_revenue");
  } else if (stateName === "funding_investment") {
    updateState(setFundingInv, "funding_investment");
  }
};

  return (
    <div className="formPlacement">
      <Dashboard />
      <h2>Year 2 Income Overview</h2>

      <form onSubmit={handleSubmit}>
      <table className="tableizer-table2">
        <thead>
          <tr>
            <th>Product/Service</th>
            <th>Month Data</th>
          </tr>
        </thead>
        <tbody>
          {customerSegments && customerSegments.map((item, outerIndex) => (
            <tr key={outerIndex}>
              <td>{item.name}</td>
              <td>
                <table className="nested-table">
                  <thead className="thead2">
                    <tr>
                      <th>{item.numberToSell}</th>
                      {months.map((month, index) => <th className="monthHeader" key={index}>{month}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Number of Customers @ {item.price}</td>
                      {item.monthlyData && item.monthlyData.map((rowValue, indexM) => (
                        <td key={indexM}><input type="number" value={item.monthlyData[indexM].NumbersSold} onChange={e => handleChangeMonthlyData(outerIndex, indexM,'numbersSold', e.target.value)}></input></td>
                      ))}
                    </tr>
                    <tr>
                      <td>Deposit % <input type="number" name={`depositPercent-${outerIndex}`} value={item.inputData.deposit} onChange={e => handleChange(outerIndex, 'deposit', e.target.value)} /></td>
                      {item.monthlyData && item.monthlyData.map((rowValue, indexA) => (
                        <td key={indexA}>{rowValue.Deposit}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Delivered in X months <input type="number" name={`deliveredInMonths-${outerIndex}`} value={item.inputData.deliveredIn} onChange={e => handleChange(outerIndex, 'deliveredIn', e.target.value)} /></td>
                      {item.monthlyData && item.monthlyData.map((rowValue, indexB) => (
                        <td key={indexB}>{rowValue.Original}</td>
                      ))}
                    </tr>
                    <tr>
                      <td># of extra months to pay <input type="number" name={`extraMonths-${outerIndex}`} value={item.inputData.extraMonths} onChange={e => handleChange(outerIndex, 'extraMonths', e.target.value)} /></td>
                      {item.monthlyData && item.monthlyData.map((rowValue, indexC) => (
                        <td key={indexC}>{rowValue.ExtraFromPreviousMonths}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Commission as % of income <input type="number" name={`commissionPercent-${outerIndex}`} value={item.inputData.commission} onChange={e => handleChange(outerIndex, 'commission', e.target.value)} /></td>
                      {item.monthlyData && item.monthlyData.map((rowValue, indexD) => (
                        <td key={indexD}>{rowValue.commission}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Fixed Fees/Customer <input type="number" name={`fixedFees-${outerIndex}`} value={item.inputData.fixedFees} onChange={e => handleChange(outerIndex, 'fixedFees', e.target.value)} /></td>
                      {item.monthlyData && item.monthlyData.map((rowValue, indexE) => (
                        <td key={indexE}>{rowValue.fixedFees}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>TOTAL</td>
                      {item.totalMonthlyData && item.totalMonthlyData.map((columnTotal, indexF) => (
                        <td key={indexF}>{columnTotal.amount}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        <h2>Additional Revenue</h2>
        <table className="tableizer-table2">
          <thead>
            <tr>
              <th>Source Names</th>
              {monthsOnly.map(month => <th className="monthHeader" key={`month-${month}`}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            {additionalRevenue.sources.map((source, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={additionalRevenue.sourceNames[index]}
                    onChange={e => handleSourceNameChange("additional_revenue", index, e.target.value)}
                  />
                </td>
                {source.map((monthData, indexM) => (
                  <td key={indexM}>
                    <input
                      type="number"
                      value={monthData.amount}
                      onChange={e => handleAmountChange("additional_revenue", index, indexM, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td>Total</td>
              {additionalRevenue.totalMonthly && additionalRevenue.totalMonthly.map(month => <td key={month}>${month.amount}</td>)}
            </tr>
            
          </tbody>
        </table>
        <button onClick={() => addNewSource("additional_revenue")}>+</button>
        <h2>Funding/Investment</h2>
        <table className="tableizer-table2">
          <thead>
            <tr>
              <th>Source Names</th>
              {monthsOnly.map(month => <th className="monthHeader" key={month}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            {fundingInvestment.sources.map((source, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={fundingInvestment.sourceNames[index]}
                    onChange={e => handleSourceNameChange("funding_investment", index, e.target.value)}
                  />
                </td>
                {source.map((monthData, monthIndex) => (
                  <td key={monthIndex}>
                    <input
                      type="number"
                      value={monthData.amount}
                      onChange={e => handleAmountChange("funding_investment", index, monthIndex, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td>Total</td>
              {fundingInvestment.totalMonthly.map((month, index) => (
                <td key={index}>${month.amount}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <button onClick={() => addNewSource("funding_investment")}>+</button>
        <h2>Total All Income</h2>
        <table class="tableizer-table2">
          <thead>
            <tr>
              {monthsOnly.map(month => <th className="monthHeader" key={month}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              {totalAllIncome.map(month => <td>${month.amount}</td>)}
            </tr>
          </tbody>
        </table>

        <h2>Distributions</h2>
        <table class="tableizer-table2">
          <thead>
            <tr>
              <th>Include Investments</th>
              {monthsOnly.map(month => <th className="monthHeader" key={month}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><button className="buttonYes" onClick={() => handleYesInclude()}>Yes</button><button className="buttonNo" onClick={() => handleNoInclude()}>No</button></td>
              {Distributions.includeInvestments ? 
                (Array.isArray(Distributions.withInvestments) && Distributions.withInvestments.length > 0 ?
                Distributions.withInvestments.map(month => (
                  <td key={month}>${month.amount}</td>
                )) 
                : null)
                : (Array.isArray(Distributions.withoutInvestments) && Distributions.withoutInvestments.length > 0 ?
                  Distributions.withoutInvestments.map(month => (
                    <td key={month}>${month.amount}</td>
                )) 
                : null)
              }
                
          </tr>
          </tbody>
        </table>

        <h2>Cash On Hand</h2>
        <table class="tableizer-table2">
          <thead>
            <tr>
              <th>Exclude Depreciation</th>
              <th>Startup Capital</th>
              {monthsOnly.map(month => <th className="monthHeader" key={month}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><button className="buttonYes" onClick={() => handleYesExclude()}>Yes</button><button className="buttonNo" onClick={() => handleNoExclude()}>No</button></td>
              <td>${cashOnHand.initialCashOnHand}</td>
              {cashOnHand.excludeDepreciation ? 
                (Array.isArray(cashOnHand.withoutDepreciation) && cashOnHand.withoutDepreciation.length > 0 ?
                cashOnHand.withoutDepreciation.map(month => (
                  <td key={month}>${month.amount}</td>
                )) 
                : null)
                : (Array.isArray(cashOnHand.withDepreciation) && cashOnHand.withDepreciation.length > 0 ?
                  cashOnHand.withDepreciation.map(month => (
                    <td key={month}>${month.amount}</td>
                )) 
                : null)
              }
                
          </tr>
          </tbody>
        </table>

        <h2>Expenses</h2>
        <h3>Total All Expenses</h3>
        <table class="tableizer-table2">
          <thead>
            <tr>
              {monthsOnly.map(month => <th className="monthHeader" key={month}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
            {totalExpenses && totalExpenses.map(month => <td key={month}>${month.amount}</td>)}
          </tr>
          </tbody>
        </table>


        <h2>Founder's Draw</h2>
        <table class="tableizer-table2">
          <thead>
            <tr>
              {monthsOnly.map(month => <th className="monthHeader" key={month}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
          {foundersDraw.foundersDrawPayArray && foundersDraw.foundersDrawPayArray.map((source, index) => (
            <tr key={index}>
                {Array.isArray(source) && source.map((month, indexM) => (
              <td key={indexM}>${month.amount}</td>
              ))}
            </tr>
          ))}
      
          </tbody>
        </table>
        
        <h2>Returns/Rework</h2>
        <table class="tableizer-table2">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Percent of Revenue</th>
              {monthsOnly.map(month => <th className="monthHeader" key={month}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
          {returnReworks && returnReworks.map((source, index) => (
            <tr key={index}>
              <td>{source.name}</td>
              <td><input type="number" value={source.percentOfRevenue} onChange={e => handleReworksChange(index, e.target.value)}></input></td>
              {Array.isArray(source.monthlyData) && source.monthlyData.map((month, indexM) => (
                <td key={indexM}>${month.amount}</td>
              ))}
            </tr>
          ))}
      
          </tbody>
        </table>

        <h2>Marketing Expenses</h2>
        <table class="tableizer-table2">
          <thead>
            <tr>
              <th>Sources</th>
              {monthsOnly.map(month => <th className="monthHeader" key={month}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
          {marketingExpenses.expensesList && marketingExpenses.expensesList.map((source, index) => (
            <tr key={index}>
              <td>{source.sourceName}</td>
                {Array.isArray(source.monthlyData) && source.monthlyData.map((month, indexM) => (
              <td key={indexM}><input type="number" value={month.amount} onChange={(event) => handleInputChange(index, indexM, event)}></input></td>
              ))}
            </tr>
          ))}
          </tbody>
        </table> 
        <button onClick={() => addNewExpense("MarketingExpenses")}>+</button>

        <h2>Fixed Assets</h2>
        <table class="tableizer-table2">
          <thead>
            <tr>
              <th></th>
              {monthsOnly.map(month => <th className="monthHeader" key={month}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
          <tr>
            <td>New Acquisitions</td>
            {fixedAssets.newAcquisitions && fixedAssets.newAcquisitions.map(month => <td key={month}>${month.amount}</td>)}
          </tr>
          <tr>
            <td>Depreciation</td>
            {fixedAssets.depreciation && fixedAssets.depreciation.map(month => <td key={month}>${month.amount}</td>)}

          </tr>
      
          </tbody>
        </table>
        <h2>Recurring Expenses</h2>
        <h3>Property Related</h3>
        <table class="tableizer-table2">
          <thead>
            <tr>
              <th></th>
              {monthsOnly.map(month => <th className="monthHeader" key={month}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
          {propertyRelated.expensesList.map((expense, index) => (
            <tr key={index}>
              <td>{expense.sourceName}</td>
              {expense.monthlyData && expense.monthlyData.map((data, indexM) => (
                <td key={`${index}-${indexM}`}>  {/* Ensure keys are unique and stable */}
                  <input type="number" value={data.amount} onChange={(event) => handlePropertyChange(index, indexM, event)} />
                </td>
              ))}
            </tr>
          ))}
            <tr>
              <td>Total</td>
              {propertyRelated.totalMonthly && propertyRelated.totalMonthly.map(month => <td key={month}>${month.amount}</td>)}
            </tr>
          </tbody>
        </table>

        <h3>Legal and Professional Services</h3>
        <table className="tableizer-table2">
          <thead>
            <tr>
              <th></th>
              {monthsOnly.map((month, index) => <th className="monthHeader" key={index}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            {legalAndProfessionalServices.expensesList && legalAndProfessionalServices.expensesList.map((expense, index) => (
              <tr key={expense.sourceName}> 
                <td>{expense.sourceName}</td>
                {expense.monthlyData && expense.monthlyData.map((data, indexM) => (
                  <td key={index + '-' + indexM}>  
                    <input type="number" value={data.amount} onChange={(event) => handleServiceChange(index, indexM, event)} />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td>Total</td>
              {legalAndProfessionalServices.totalMonthly && legalAndProfessionalServices.totalMonthly.map((month, index) => (
                <td key={index}>${month.amount}</td>  
              ))}
            </tr>
          </tbody>
        </table>


        <h3>Office/General Business</h3>
        <table className="tableizer-table2">
          <thead>
            <tr>
              <th></th>
              {monthsOnly.map((month, index) => <th className="monthHeader" key={index}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            {officeGeneralBusiness.expensesList && officeGeneralBusiness.expensesList.map((expense, index) => (
              <tr key={expense.sourceName}>  
                <td>{expense.sourceName}</td>
                {expense.monthlyData && expense.monthlyData.map((data, indexM) => (
                  <td key={index + '-' + indexM}>  
                    <input type="number" value={data.amount} onChange={(event) => handleOfficeChange(index, indexM, event)} />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td>Total</td>
              {officeGeneralBusiness.totalMonthly && officeGeneralBusiness.totalMonthly.map((month, index) => (
                <td key={index}>${month.amount}</td>
              ))}
            </tr>
          </tbody>
        </table>

        <h3>Banking Fees</h3>
        <table className="tableizer-table2">
          <thead>
            <tr>
              <th></th>
              {monthsOnly.map((month, index) => <th className="monthHeader" key={index}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            {bankingFees.expensesList && bankingFees.expensesList.map((expense, index) => (
              <tr key={expense.sourceName}> 
                <td>{expense.sourceName}</td>
                {expense.monthlyData && expense.monthlyData.map((data, indexM) => (
                  <td key={index + '-' + indexM}>  
                    <input type="number" value={data.amount} onChange={(event) => handleBankingChange(index, indexM, event)} />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td>Total</td>
              {bankingFees.totalMonthly && bankingFees.totalMonthly.map((month, index) => (
                <td key={index}>{month.amount}</td> 
              ))}
            </tr>
          </tbody>
        </table>
        <h3>Travel/Vehicle Related</h3>
        <table className="tableizer-table2">
          <thead>
            <tr>
              <th></th>
              {monthsOnly.map((month, index) => <th className="monthHeader" key={index}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            {travelVehicleRelated.expensesList && travelVehicleRelated.expensesList.map((expense, index) => (
              <tr key={expense.sourceName}>  
                <td>{expense.sourceName}</td>
                {expense.monthlyData && expense.monthlyData.map((data, indexM) => (
                  <td key={index + '-' + indexM}> 
                    <input type="number" value={data.amount} onChange={(event) => handleTravelChange(index, indexM, event)} />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td>Total</td>
              {travelVehicleRelated.totalMonthly && travelVehicleRelated.totalMonthly.map((month, index) => (
                <td key={index}>${month.amount}</td>  
              ))}
            </tr>
          </tbody>
        </table>

        <h3>Production Related</h3>
        <table className="tableizer-table2">
          <thead>
            <tr>
              <th>Product/Services</th>
              <th>Month Data</th>              
            </tr>
          </thead>
          <tbody>
            {productionRelated && productionRelated.map((item, outerIndex) => (
              <tr key={outerIndex}>
                <td>{item.name}</td>
                <td>
                  <table className="nested-table">
                    <thead>
                      <tr>
                        <th></th>
                        {monthsOnly.map((month, index) => <th className="monthHeader" key={index}>{month}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {item.expensesList && item.expensesList.map((expense, expenseIndex) => (
                        <tr key={expense.sourceName}>
                          <td>{expense.sourceName}</td>
                          {expense.monthlyData && expense.monthlyData.map((month, monthIndex) => (
                            <td key={monthIndex}>
                              <input type="number" value={month.amount} onChange={(event) => handleProductionChange(outerIndex, expenseIndex, monthIndex, event)} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Other Expenses</h3>
        <table className="tableizer-table2">
          <thead>
            <tr>
              <th>Expense Name</th>
              {monthsOnly.map((month, index) => <th className="monthHeader" key={index}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            {otherExpenses.expensesList && otherExpenses.expensesList.map((expense, index) => (
              <tr key={index}>
                <td><input type="text" value={expense.sourceName} onChange={(event) => handleExpenseNameChange(index, event)} /></td>
                {expense.monthlyData && expense.monthlyData.map((month, mIndex) => (
                  <td key={mIndex}><input type="number" value={month.amount} onChange={(event) => handleExpenseAmountChange(index, mIndex, event)} /></td>
                ))}
              </tr>
            ))}
          
          </tbody>
        </table>
        <button onClick={addOtherNewExpense}>+</button>

        <h2>Employee Related</h2>
        <h3>Salaried</h3>
        <table className="tableizer-table2">
          <thead>
            <tr>
              <th>Description</th>
              <th>Monthly Salary</th>
              {monthsOnly.map((month, index) => <th className="monthHeader" key={index}># of workers</th>)}
            </tr>
          </thead>
          <tbody>
            {salariedWorkers.workersList && salariedWorkers.workersList.map((worker, index) => (
              <tr key={index}>
                <td><input type="text" value={worker.description} onChange={(event) => handleDescriptionChange(index, event)} /></td>
                <td><input type="number" value={worker.monthlySalary} onChange={(event) => {handleSalaryChange(index, event); calculatePayrollMonthlyData()}} /></td>
                {worker.monthlyData.map((month, mIndex) => (
                  <td key={mIndex}><input type="number" value={month.amount} onChange={(event) => {handleMonthlyDataChange(index, mIndex, event); calculatePayrollMonthlyData()}} /></td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="totalTD" colSpan={2}>Total</td>
              {salariedWorkers.totalMonthly && salariedWorkers.totalMonthly.map((month, index) => (
                <td key={index}>${month.amount}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <button onClick={addNewWorker}>+</button>

        <h3>Hourly Full Time</h3>
        <table className="tableizer-table2">
          <thead>
            <tr>
              <th>Description</th>
              <th>Monthly Salary</th>
              {monthsOnly.map((month, index) => <th className="monthHeader" key={index}># of workers</th>)}
            </tr>
          </thead>
          <tbody>
            {fullTimeWorkers.workersList && fullTimeWorkers.workersList.map((worker, index) => (
              <tr key={index}>
                <td><input type="text" value={worker.description} onChange={(event) => handleFullTimeDescriptionChange(index, event)} /></td>
                <td><input type="number" value={worker.monthlySalary} onChange={(event) => {handleFullTimeSalaryChange(index, event); calculatePayrollMonthlyData()}} /></td>
                {worker.monthlyData && worker.monthlyData.map((month, mIndex) => (
                  <td key={mIndex}><input type="number" value={month.amount} onChange={(event) => {handleFullTimeMonthlyDataChange(index, mIndex, event); calculatePayrollMonthlyData()}} /></td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="totalTD" colSpan={2}>Total</td>
              {fullTimeWorkers.totalMonthly && fullTimeWorkers.totalMonthly.map((month, index) => (
                <td key={index}>${month.amount}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <button onClick={addNewFullTimeWorker}>+</button>


        <h3>Hourly Part Time</h3>
        <table className="tableizer-table2">
          <thead>
            <tr>
              <th>Description</th>
              <th>Monthly Salary</th>
              {monthsOnly.map((month, index) => <th className="monthHeader" key={index}># of workers</th>)}
            </tr>
          </thead>
          <tbody>
            {partTimeWorkers.workersList && partTimeWorkers.workersList.map((worker, index) => (
              <tr key={index}>
                <td><input type="text" value={worker.description} onChange={(event) => handlePartTimeDescriptionChange(index, event)} /></td>
                <td><input type="number" value={worker.monthlySalary} onChange={(event) => {handlePartTimeSalaryChange(index, event); calculatePayrollMonthlyData()}} /></td>
                {worker.monthlyData && worker.monthlyData.map((month, mIndex) => (
                  <td key={mIndex}><input type="number" value={month.amount} onChange={(event) => {handlePartTimeMonthlyDataChange(index, mIndex, event); calculatePayrollMonthlyData()}} /></td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="totalTD" colSpan={2}>Total</td>
              {partTimeWorkers.totalMonthly && partTimeWorkers.totalMonthly.map((month, index) => (
                <td key={index}>${month.amount}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <button onClick={addNewPartTimeWorker}>+</button>

        <br></br>
        <h3>Workers Head Count</h3>
        <table class="tableizer-table2">
          <thead>
            <tr>
              <th>Description</th>
              {monthsOnly.map(month => <th className="monthHeader" key={month}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Founders Head Count</td>
              {workersHeadCount.foundersHeadCount && workersHeadCount.foundersHeadCount.map(month => <td key={month}>{month.amount}</td>)} 
            </tr>
            <tr>
              <td>Salaried Head Count</td>
              {workersHeadCount.salariedHeadCount && workersHeadCount.salariedHeadCount.map(month => <td key={month}>{month.amount}</td>)} 
            </tr>
            <tr>
              <td>Full Time Head Count</td>
              {workersHeadCount.fullTimeHeadCount && workersHeadCount.fullTimeHeadCount.map(month => <td key={month}>{month.amount}</td>)} 
            </tr>
            <tr>
              <td>Part Time Head Count</td>
              {workersHeadCount.partTimeHeadCount && workersHeadCount.partTimeHeadCount.map(month => <td key={month}>{month.amount}</td>)} 
            </tr>
            <tr>
              <td className="totalTD">Total</td>
              {workersHeadCount.totalMonthly && workersHeadCount.totalMonthly.map(month => <td key={month}>{month.amount}</td>)}
            </tr>

          </tbody>
        </table>
        <br></br>
        <label htmlFor="dropdown">Founder(s) Status:</label>
        <select id="dropdown" value={selectedValue} onChange={e => {handleDropdownChange(); calculatePayrollMonthlyData()}}>
          <option value="option1">Founder(s) NOT Taxed (in gray below)</option>
          <option value="option2">Founder(s) Are Taxed as Employees</option>
        </select>
        <br></br>

        <h3>Payroll Taxes and Benefits</h3>
        <table class="tableizer-table2">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              {monthsOnly.map(month => <th className="monthHeader" key={month}>{month}</th>)}
            </tr>
          </thead>
          <tbody>
            {payRollTaxesAndBenefits.payrollList && payRollTaxesAndBenefits.payrollList.map((row_item, index) => 
            <tr key={row_item}>
              <td>{row_item.sourceName}</td>
              <td><input type="number" value={row_item.value} onChange={event => {handlePayrollValueChange(index, event); calculatePayrollMonthlyData()}}></input></td>
              {row_item.sourceName!=="State Unemployment Tax (Base)" && row_item.sourceName!=="Federal Unemployment Tax (Base)" && row_item.sourceName!=="Social Security (Base)" && row_item.monthlyData && row_item.monthlyData.map(month => <td key={month}>{month.amount}</td>)}
              {(row_item.sourceName==="State Unemployment Tax (Base)") && ((row_item.monthlyData) && (row_item.monthlyData.map(month => <td className="blackTD" key={month}></td>)))}
              {(row_item.sourceName==="Federal Unemployment Tax (Base)") && ((row_item.monthlyData) && (row_item.monthlyData.map(month => <td className="blackTD" key={month}></td>)))}
              {(row_item.sourceName==="Social Security (Base)") && ((row_item.monthlyData) && (row_item.monthlyData.map(month => <td className="blackTD" key={month}></td>)))}

            </tr>)}
            <tr>
              <td className="totalTD" colSpan={2}>Total</td>
              {payRollTaxesAndBenefits.totalMonthly && payRollTaxesAndBenefits.totalMonthly.map(month => <td key={month}>${month.amount}</td>)}
            </tr>
            
          </tbody>
        </table> 

        

        <button type="submit">Submit</button>
        </form>



      
    </div>
  );
};

export default Year2;