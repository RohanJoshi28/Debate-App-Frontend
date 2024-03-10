import React from 'react';
import './Dashboard.css';
import './App.css';
import './AddTournament.js'
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Header from '../components/header.js';
import AdminManagement from '../components/AdminManagement.js'
import InviteAdmin from '../components/Modals/InviteAdmin.js';
function handleAddTournamentButtonOnClick(event) {
}



function Settings() {

  return (
    
    <div>
      <Header title="User Management"/>
    
      <div class="main">
        <AdminManagement/>
        {/* <InviteAdmin/> */}
      </div>
    </div>
  );
}

export default Settings;