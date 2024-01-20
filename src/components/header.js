import React from 'react';
import '../pages/Dashboard.css'
import '../pages/App.css';
import '../pages/AddTournament.js'
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';


function Header(props) {

  const { setAuth } = useAuth();
  const title = props.title;

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
      <div class="header">
        <div class="navbar">
          <a href="dashboard">Dashboard</a>
          <a href="leaderboard">Leaderboard</a>
          <Link to="/" style={{ float: "right" }} onClick={async () => {await logOut();}}>Logout</Link>
        </div>

        <h1>{title}</h1>
  
        <div class="tab">
          <button class="tablinks active">Junior Varsity</button>
          <button class="tablinks">Varsity</button>
        </div>
      </div>
    </div>
  );
}

export default Header;