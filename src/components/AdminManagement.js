import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fetch = () => {
  const [userEmailToDelete, setDeleteEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [invalidDelete, setInvalidDelete] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const queryUserDelete = async (email) => {
    try {
      const response = await fetch("/protected", {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const currentUserData = await response.json(); 
      const currentUserEmail = currentUserData.logged_in_as;
      console.log("Current user email:", currentUserEmail);
      if (currentUserEmail === email) {
        console.log("Cannot delete the currently logged-in user.");
        setInvalidDelete(true);
        return;
      }
      setDeleteEmail(email);
    } catch (error) {
      console.error("Error fetching current user email:", error);
    }
  };

  const deleteUser = async (email) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/deleteuser', { email });
      console.log(response.data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    if (userEmailToDelete) {
      console.log("Deleting user with email:", userEmailToDelete);
      deleteUser(userEmailToDelete);
      setSuccessDelete(true);
      window.location.reload();
    }
  }, [userEmailToDelete]);

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

      {successDelete && (
            <p class="success">Successully deleted user: {userEmailToDelete}</p>
        )}

      {invalidDelete && (
                  <p class="fail">You cannot remove yourself as an admin!</p>
              )}
    </div>
  );
};

export default Fetch;