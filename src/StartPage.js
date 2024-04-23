import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/authcontext';
import { createMainForm, getMainForms } from './api';
import Header from './Header';

const StartPage = () => {
  const navigate = useNavigate();
  const { userID, handleSelectMainForm } = useContext(AuthContext);
  const [mainForms, setMainForms] = useState([]);
  const [newFormName, setNewFormName] = useState('');
  const { handleLogout } = useContext(AuthContext);

  useEffect(() => {
    fetchMainForms();
  }, [userID]);  // Ensure re-fetch when userID changes

  const fetchMainForms = async () => {
    try {
      const response = await getMainForms(userID);
      
      setMainForms(response.data);
    } catch (error) {
      console.error('Error fetching Main Forms:', error);
    }
  };

  const handleCreateMainForm = async () => {
    try {
      await createMainForm(userID, { form_name: newFormName });
      fetchMainForms();
      setNewFormName('');
    } catch (error) {
      console.error('Error creating Main Form:', error);
    }
  };

  const handleMainFormClick = (mainFormID) => {
    console.log("Start page main form id: "+mainFormID);
    handleSelectMainForm(mainFormID); 
    navigate('/revForm'); 
  };

  return (
    <div>
      <h1>Start Page</h1>
      <button style={{ float: 'right' }} onClick={handleLogout}>Logout</button>
      <div>
        <h2>Create New Main Form</h2>
        <input
          type="text"
          value={newFormName}
          onChange={(e) => setNewFormName(e.target.value)}
        />
        <button onClick={handleCreateMainForm}>Create</button>
      </div>
      <div>
        <h2>Existing Main Forms</h2>
        {mainForms.map((form, indexForm) => (
          <div className="MainForms" key={indexForm} onClick={() => handleMainFormClick(form.main_form_id)}>
            <p>Name: {form.form_name}</p>
            <p>Created: {form.created}</p>
            <p>Last Updated: {form.last_update}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartPage;