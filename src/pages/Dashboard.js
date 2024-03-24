import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import './App.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Header from '../components/header.js';


function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const { setAuth } = useAuth();
  let navigate = useNavigate();

  const [isAddTournamentModalVisible, setIsAddTournamentModalVisible] = useState(false);
  const [newTournamentData, setNewTournamentData] = useState({
    host_school_name: '',
    datetime: ''
  });

  function handleAddTournamentButtonOnClick(event) {
    setIsAddTournamentModalVisible(true);
  }

  function handleModalClose() {
    setIsAddTournamentModalVisible(false);
  }

  async function handleAddTournament(event) {
    event.preventDefault();
    try {
      const response = await fetch('/add_tournament', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTournamentData)
      });
      if (response.ok) {
        setIsAddTournamentModalVisible(false);
        const addedTournament = await response.json();
        setTournaments([...tournaments, addedTournament]);
      } else {
        console.error('Failed to add tournament');
      }
    } catch (error) {
      console.error('Error adding tournament:', error);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewTournamentData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

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

  const routeChange = (tournamentNumber) => {
    navigate(`/edit-tournament/${tournamentNumber}`);
  }

  const routeChangeAddTournament = () => {
    navigate(`/addtournament`);
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
            <button onClick={() => routeChange(tournament.id)}>Edit</button>
          </div>
        ))}
        <div className="add-tournament-card">
          <button onClick={() => routeChangeAddTournament()}>+</button>
        </div>
        {isAddTournamentModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleModalClose}>&times;</span>
            <h2>Add New Tournament</h2>
            <form onSubmit={handleAddTournament}>
              <label>
                Host School Name:
                <input
                  type="text"
                  name="host_school_name"
                  value={newTournamentData.host_school_name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Date (MM/DD/YYYY):
                <input
                  type="text"
                  name="datetime"
                  placeholder="4/2/2024"
                  value={newTournamentData.datetime}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit">Add Tournament</button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Dashboard;
