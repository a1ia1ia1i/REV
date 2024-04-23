import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = (username, password) => {
  return api.post('login/', { username, password });
};

export const register = (username, email, password) => {
  return api.post('register/', { username, email, password });
};

export const logout = () => {
  return api.post('logout/');
};

// Additional API functions
export const getUserData = (userId) => {
  return api.get(`users/${userId}/`);
};

export const updateUserProfile = (userId, userData) => {
  return api.put(`users/${userId}/`, userData);
};

//ALL form submits
export const proFormaSubmit = (mainFormId, userData) => {
  return api.post(`form/pro_forma/${mainFormId}`, userData);
}
export const revFormSubmit = (mainFormId, userData) => {
  return api.post(`form/rev_form/${mainFormId}`, userData);
}
export const depreciationSubmit = (mainFormId, userData) => {
  return api.post(`form/depreciation/${mainFormId}`, userData);
}
export const year1Submit = (mainFormId, yearNumber, userData) => {
  return api.post(`/form/year_form/${mainFormId}/${yearNumber}`, userData);
}
export const year2Submit = (mainFormId, yearNumber, userData) => {
  return api.post(`/form/year_form/${mainFormId}/${yearNumber}`, userData);
}
export const year3Submit = (mainFormId, yearNumber, userData) => {
  return api.post(`/form/year_form/${mainFormId}/${yearNumber}`, userData);
}

//ALL form gets
export const revFormGet = (mainFormId) => {
  return api.get(`form/rev_form/${mainFormId}`);
}
export const proFormaGet = (mainFormId) => {
  return api.get(`form/pro_forma/${mainFormId}`);
}
export const depreciationGet = (mainFormId) => {
  return api.get(`form/depreciation/${mainFormId}`);
}
export const year1Get = (mainFormId, yearNumber) => {
  return api.post(`/form/year_form/${mainFormId}/${yearNumber}`);
}
export const year2Get = (mainFormId, yearNumber) => {
  return api.post(`/form/year_form/${mainFormId}/${yearNumber}`);
}
export const year3Get = (mainFormId, yearNumber) => {
  return api.post(`/form/year_form/${mainFormId}/${yearNumber}`);
}

//Create and get main forms
export const createMainForm = (userId, formName) => {
  return api.post(`form/${userId}`, formName);
}
export const getMainForms = (userId) => {
  return api.get(`form/${userId}`);
}