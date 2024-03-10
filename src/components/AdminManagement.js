import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fetch = () => {
  const [userEmailToDelete, setDeleteEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [invalidDelete, setInvalidDelete] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);
  const [modal, setModal] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setSuccess(false);
      setInvalidDelete(false);
      setSuccessDelete(false);
    }
    fetchUsers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await axios.post('http://127.0.0.1:5000/save_email', formData);
      toggleModal();
      setSuccess(true);
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  const queryUserDelete = async (email) => {
    setSuccess(false);
    setInvalidDelete(false);
    setSuccessDelete(false);
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
      } else {
        setDeleteEmail(email);
      }
    } catch (error) {
      console.error("Error fetching current user email:", error);
    }
  };


  const deleteUser = async (email) => {
    try {
      await axios.post('http://127.0.0.1:5000/deleteuser', { email });
      setSuccessDelete(true);
      fetchUsers(); // Fetch users after successful deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    if (userEmailToDelete) {
      console.log("Deleting user with email:", userEmailToDelete);
      deleteUser(userEmailToDelete);
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
            <tr key={index}>
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
        <p className="success">Successfully deleted user: {userEmailToDelete}</p>
      )}

      {invalidDelete && (
        <p className="fail">You cannot remove yourself as an admin!</p>
      )}

      {isSuccess && (
        <p className="success">Successfully added new admin!</p>
      )}

      <button onClick={toggleModal} className="btn-modal">Invite New Admins</button>

      {modal && (
        <div className="modal">
          <div className="overlay" onClick={toggleModal}></div>
          <div className="modal-content">
            <h1>Invite Admin</h1>
                      <form method="post" onSubmit={handleSubmit}>
            <label>
              Name: <input name="name" />
            </label>
            <p></p>
            <label>
              Email: <input name="email" type="email" /> {/* Updated input type to "email" */}
            </label>
            <hr />
            <button type="submit">Submit</button>
          </form>
            <button className='close-modal' onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fetch;
