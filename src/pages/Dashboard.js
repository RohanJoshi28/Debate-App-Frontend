import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import './App.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Header from '../components/header.js';

function handleAddTournamentButtonOnClick(event) {
  // Your logic for handling the add tournament button click will go here
}

function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const { setAuth } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    GetTournaments().then(tournamentsData => {
      // Calculate total number of judges for each tournament
      const enrichedTournaments = tournamentsData.map(t => ({
        ...t,
        totalJudges: t.schools.reduce((total, school) => total + school.num_judges, 0)
      }));
      setTournaments(enrichedTournaments);
    });
  }, []);

  async function GetTournaments() {
    var response = await fetch("/tournaments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }

  async function logOut(){
    setAuth({"loggedin":false});
    await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    navigate('/login');
  }

  const routeChange = () =>{
    let path = '../Edit_Tournament';
    navigate(path);
  }

  return (
    <div>
      <Header title="Debate Tournament Management" mode="true"/>

      <div className="main">
        {tournaments.map((tournament, index) => (
          <div key={index} className="tournament-card">
            <h4>{tournament.name}</h4>
            <p>Date: {new Date(tournament.datetime).toLocaleDateString()}</p>
            <p>Schools attending: {tournament.schools.length}</p>
            <p>Location: {tournament.host_school.name}</p>
            <p>Judges: {tournament.totalJudges}</p>
            <button onClick={routeChange}>Edit</button>
          </div>
        ))}
        <div className="add-tournament-card">
          <button onClick={handleAddTournamentButtonOnClick}>+</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
