import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fetch = () => {
  const [userEmailToDelete, setDeleteEmail] = useState("");
  const [admins, setAdmins] = useState([]); //these guys are admins for now
  const [coaches, setCoaches] = useState([]);
  const [invalidDelete, setInvalidDelete] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);
  const [modal, setModal] = useState(false);
  const [coachModal, setCoachModal] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isCoachSuccess, setCoachSuccess] = useState(false);
  useEffect(() => {
    // fetchUsers();
    fetchAdmins();
    fetchCoaches();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admins');
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCoaches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/coaches');
      setCoaches(response.data);
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
    fetchAdmins();
  };

  const toggleCoachModal = () => {
    setCoachModal(!coachModal);
    if (!coachModal) {
      setCoachSuccess(false);
      setInvalidDelete(false);
      setSuccessDelete(false);
    }
    fetchCoaches();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (coachModal){
      try {
        await axios.post('http://127.0.0.1:5000/save_coach_email', formData);
        toggleCoachModal();
        setCoachSuccess(true);
      } catch (error) {
        console.error('Error saving email:', error);
      }
    } 

    if (modal){
      try {
        await axios.post('http://127.0.0.1:5000/save_admin_email', formData);
        toggleModal();
        setSuccess(true);
      } catch (error) {
        console.error('Error saving email:', error);
      }
    }
    
  };

  const handleCoachSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await axios.post('http://127.0.0.1:5000/save_coach_email', formData);
      toggleCoachModal();
      setCoachSuccess(true);
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  const queryUserDelete = async (email) => {
    setSuccess(false);
    setCoachSuccess(false)
    setInvalidDelete(false);
    setSuccessDelete(false);
    setDeleteEmail(email)
    // try {
    //   const response = await fetch("/protected", {
    //     method: "GET",
    //     credentials: "include",
    //     mode: "cors",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   const currentUserData = await response.json(); 
    //   const currentUserEmail = currentUserData.logged_in_as;
    //   console.log("Current user email:", currentUserEmail);
    //   if (currentUserEmail === email) {
    //     console.log("Cannot delete the currently logged-in user.");
    //     setInvalidDelete(true);
    //   } else {
    //     setDeleteEmail(email);
    //   }
    // } catch (error) {
    //   console.error("Error fetching current user email:", error);
    // }
  };


  const deleteUser = async (email) => {
    try {
      await axios.post('http://127.0.0.1:5000/deletecoach', { email });
      setSuccessDelete(true);
      fetchCoaches(); // Fetch users after successful deletion
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
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={index}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Coaches</h2>
      <table className="settings-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {coaches.map((coach, index) => (
            <tr key={index}>
              <td>{coach.name}</td>
              <td>{coach.email}</td>
              <td>
                <button onClick={() => queryUserDelete(coach.email)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {successDelete && (
        <p className="success">Successfully deleted coach: {userEmailToDelete}</p>
      )}

      {invalidDelete && (
        <p className="fail">You cannot remove yourself as an admin!</p>
      )}

      {isSuccess && (
        <p className="success">Successfully added new admin!</p>
      )}

      {isCoachSuccess && (
              <p className="success">Successfully added new coach!</p>
            )}

      <button onClick={toggleModal} className="btn-modal">Invite New Admins</button>
      <button onClick={toggleCoachModal} className="btn-modal">Invite New Coaches</button>


      {modal && (
        <div className="modal">
          <div className="overlay" onClick={toggleModal}></div>
          <div className="modal-content">
            <h1>Invite Admin</h1>
                      <form method="post" onSubmit={handleSubmit}>
            <h4>Note: Once an admin is added, you will not be able to remove them!</h4>
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

      {coachModal && (
              <div className="modal">
                <div className="overlay" onClick={toggleCoachModal}></div>
                <div className="modal-content">
                  <h1>Invite Coach</h1>
                            <form method="post" onSubmit={handleSubmit}>
                  <label>
                    Name: <input name="name" />
                  </label>
                  <p></p>
                  <label>
                    Email: <input name="email" type="email" /> 
                  </label>
                  <label>
                    School: <input name="school"/> 
                  </label>
                  <hr />
                  <button type="submit">Submit</button>
                </form>
                  <button className='close-modal' onClick={toggleCoachModal}>Close</button>
                </div>
              </div>
            )}
    </div>
  );
};

export default Fetch;
