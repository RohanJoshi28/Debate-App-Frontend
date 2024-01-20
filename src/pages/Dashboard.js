import React from 'react';
import './Dashboard.css';
import './App.css';
import './AddTournament.js'
import { useNavigate } from 'react-router-dom';
import Edit_Tournament from './Edit_Tournament';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Header from '../components/header.js';
function handleAddTournamentButtonOnClick(event) {
}



function Dashboard() {

  const { setAuth } = useAuth();
  let navigate = useNavigate();
  const routeChange = () =>{
    let path = '../Edit_Tournament';
    navigate(path);
  }

  async function logOut(){
    setAuth({"loggedin":false});
    var response = await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }


  return (
    
    <div>
      <Header title="Debate Tournament Management"/>
    
      <div class="main">
        
        <div class="tournament-card">
          <h4>Tournament 1</h4>
          <p>Date: 10/23/2023</p>
          <p>Schools attending: 10</p>
          <p>Location: Bergen County Academies</p>
          <p>Judges: 30</p>
          <button onClick={routeChange}>Edit</button>
        
        </div>

        <div class="tournament-card">
          <h4>Tournament 2</h4>
          <p>Date: 11/26/2023</p>
          <p>Schools attending: 9</p>
          <p>Location: Fort Lee</p>
          <p>Judges: 27</p>
          <button onclick="window.location='edit_tournament.html'">Edit</button>

        </div>
        <div class="tournament-card">
          <h4>Tournament 3</h4>
          <p>Date: 12/8/2023</p>
          <p>Schools attending: 11</p>
          <p>Location: Bergen County Academies</p>
          <p>Judges: 30</p>
          <button onclick="window.location='edit_tournament.html'">Edit</button>

        </div>
        <div class="tournament-card">
          <h4>Tournament 4</h4>
          <p>Date: 1/6/2024</p>
          <p>Schools attending: 7</p>
          <p>Location: Demarest</p>
          <p>Judges: 24</p>
          <button onclick="window.location='edit_tournament.html'">Edit</button>

        </div>
        <div class="tournament-card">
          <h4>Tournament 5</h4>
          <p>Date: 2/12/2024</p>
          <p>Schools attending: 13</p>
          <p>Location: Old Tappan</p>
          <p>Judges: 32</p>
          <button onclick="window.location='edit_tournament.html'">Edit</button>

        </div>
        <div class="add-tournament-card">
          <button onClick={ (e) => handleAddTournamentButtonOnClick}>+</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;