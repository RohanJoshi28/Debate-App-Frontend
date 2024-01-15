import React from 'react';
import './App.css';
import AuthButton from './AuthButton'; // Import AuthButton component
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home';
import Dashboard from './Dashboard';
import Leaderboard from './Leaderboard';
import Edit_Tournament from './Edit_Tournament';
import ProtectedRoute from '../auth/ProtectedRoute';



function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route element={<ProtectedRoute/>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="Edit_Tournament" element={<Edit_Tournament />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </div>
  
  );
}

export default App;