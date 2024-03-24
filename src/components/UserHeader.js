import React, { useEffect, useState } from 'react';
import '../pages/Dashboard.css';
import '../pages/App.css';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

function UserHeader(props) {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(true); // Add loading state
  const title = props.title;
  const diffModes = props.mode;

  async function logOut() {
    setAuth({ loggedin: false });
    await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  function JVVModeSwitch(){
    if (diffModes === "true"){
      return (
        <div className="tab">
          <button className="tablinks active">Junior Varsity</button>
          <button className="tablinks">Varsity</button>
        </div>
      );
    }
  }


  return (
    <div>
      <div className="header">
        <div className="navbar">
          <a href="viewtournaments">Tournaments</a>
          <a href="leaderboard">Leaderboard</a>
          <Link to="/" style={{ float: "right" }} onClick={async () => { await logOut(); }}>Logout</Link>
        </div>
        <h1>{title}</h1>
        <JVVModeSwitch></JVVModeSwitch>
      </div>
    </div>
  );
}

export default UserHeader;
