import React, { useState, useEffect } from 'react';
import axios from 'axios';



  const Fetch = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then((res) => {
        return res.json();
        //setUsers(res.data); // Set the users in state
      })
      .then((data) => {
        setUsers(data);
      })
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Fetch;




