import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from "react-hot-toast"; 

import Navbar from './components/Navbar';
import {useThemeStore} from './store/useThemeStore';

function App() {
  const{ theme }=useThemeStore();
  return (
    <div data-theme={ theme }>
      <Navbar />
      <Outlet /> 
      <Toaster /> 
    </div>
  );
}

export default App;
