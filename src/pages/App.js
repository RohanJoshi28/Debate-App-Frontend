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
import AddTournamentPage from './AddTournament';
import AddSchool
 from './AddSchool';
import ProtectedAdminRoute from '../auth/ProtectedAdminRoute';
import ProtectedCoachRoute from '../auth/ProtectedCoachRoute';
import Tournaments from './Tournaments';
import ViewTournamentSchedule from './ViewTournamentSchedule';
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
          <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="viewtournaments" element={<Tournaments />} />
            <Route path="/viewtournamentschedule/:tournamentNumber" element={<ViewTournamentSchedule />} />
            <Route path="schoolsettings" element={<AddSchool/>} />
          </Route>

          

          <Route element={<ProtectedCoachRoute/>}>
          <Route path="dashboard" element={<Dashboard />} />
            
            <Route path="edit_tournament" element={<Edit_Tournament />} />
              <Route path="/edit-tournament/:tournamentNumber" element={<Edit_Tournament />} />
              <Route path="/addtournament" element={<AddTournamentPage />} />
          </Route>

          <Route element={<ProtectedAdminRoute/>}>
            <Route path="edit_tournament" element={<Edit_Tournament />} />
              <Route path="settings" element={<Settings/>} />
              
          </Route>
            
         


        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  
  );
}

export default App;

