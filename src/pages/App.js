import React from 'react';
import './App.css';
import AuthButton from './AuthButton'; // Import AuthButton component
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home';
import Dashboard from './Dashboard';
import Leaderboard from './Leaderboard';
import Edit_Tournament from './Edit_Tournament';
import ProtectedRoute from '../auth/ProtectedRoute';
import { AuthProvider } from '../contexts/AuthProvider';
import RedirectRoute from '../auth/RedirectRoute';
import Settings from './Settings'

function App() {
  return (
    <div>
      <BrowserRouter>
 
      <AuthProvider>
        <Routes>
          {/* <Route element={<RedirectRoute/>}> */}
            <Route path="/" element={<Home />}/>
          {/* </Route> */}
          <Route element={<ProtectedRoute/>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="edit_tournament" element={<Edit_Tournament />} />
            <Route path="/edit-tournament/:tournamentNumber" element={<Edit_Tournament />} />
            <Route path="settings" element={<Settings/>} />
          </Route>


        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  
  );
}

export default App;

