import React from 'react';
import { axiosInstance } from './libs/axios.lib';

import './app.css';

function App() {
  async function callfun() {
    try {
      const response = await axiosInstance.post('/auth/login', {
        password: 'omarora123',
        email: 'om@gmail.com',
      });

      console.log('Login Successful:', response.data); 
    } catch (error) {
      console.error('Login Failed:', error.response ? error.response.data : error.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <button className="btn btn-primary" onClick={callfun}>Click Me</button>
    </div>
  );
}

export default App;
