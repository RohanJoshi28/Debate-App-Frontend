import React, { useEffect, useState } from 'react';
import '../pages/Dashboard.css';
import '../pages/App.css';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

function Header(props) {
  const { setAuth } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const title = props.title;
  const diffModes = props.mode;

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        const response = await fetch("/protected_admin", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false); // Set loading to false when check is done
      }
    }
    checkAdminAccess();
  }, []);

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
          {!loading && <a href="dashboard">Dashboard</a>}
          {!loading && <a href="leaderboard">Leaderboard</a>}
          {!loading && isAdmin && <a href="settings">User Management</a>}
          {!loading && isAdmin && <a href="schoolsettings">School Management</a>}
          <Link to="/" style={{ float: "right" }} onClick={async () => { await logOut(); }}>Logout</Link>
        </div>
        <h1>{title}</h1>
        <JVVModeSwitch></JVVModeSwitch>
      </div>
    </div>
  );
}

export default Header;
