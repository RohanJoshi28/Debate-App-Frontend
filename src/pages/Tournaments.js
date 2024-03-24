import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import './App.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import UserHeader from '../components/UserHeader.js';


function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const { setAuth } = useAuth();
  let navigate = useNavigate();

  const [newTournamentData, setNewTournamentData] = useState({
    host_school_name: '',
    datetime: ''
  });



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
      credentials: "include",
    });
    return await response.json();
  }

  const routeChange = (tournamentNumber) => {
    navigate(`/viewtournamentschedule/${tournamentNumber}`);
  }

  return (
    <div>
      <UserHeader title="Debate Tournaments" mode="true"/>

      <div className="main">
        {tournaments.map((tournament, index) => (
          <div key={index} className="tournament-card">
            <h4>{tournament.name}</h4>
            <p>Date: {new Date(tournament.datetime).toLocaleDateString()}</p>
            <p>Schools attending: {tournament.schools.length}</p>
            <p>Location: {tournament.host_school.name}</p>
            <p>Judges: {tournament.totalJudges}</p>
            <button onClick={() => routeChange(tournament.id)}>View Schedule</button>
          </div>
        ))}

       
      </div>
    </div>
  );
}

export default Tournaments;
