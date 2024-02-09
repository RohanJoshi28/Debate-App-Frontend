import React, { useState, useEffect } from 'react';
import axios from 'axios';



  const Fetch = () => {

  const [userDeleteQuery, queryDelete] = useState(false);
  const [userEmailToDelete, setDeleteEmail] = useState("");
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

  const queryUserDelete = (email) => {
    setDeleteEmail(email);
    queryDelete(true);
    window.location.reload();
  }
  const deleteUser = (email) => {
    axios.post('http://127.0.0.1:5000/deleteuser', {
      email: email
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    
  };

  useEffect(() => {
    if (userDeleteQuery) { // if user is queried for deletion
      deleteUser(userEmailToDelete);
    }
  });

  return (
    <div>
      <h2>Admins</h2>
      <table className="settings-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id || index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => queryUserDelete(user.email)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Fetch;




