
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/header';
import './AddTournament.css';
import { useNavigate } from 'react-router-dom';
import './AddSchool.css'
const AddSchool = () => {
  const [schools, setSchools] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [numDebaters, setNumDebaters] = useState('');
  const [numJudges, setNumJudges] = useState('');
  const [invalidInput, setInvalidInput] = useState(false);
  let navigate = useNavigate();
  const routeChange = () => {
    navigate(`/dashboard`);
  }
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await axios.get('/schools');
      setSchools(response.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };



  const toggleModal = () => {
    if (!showModal){
        setInvalidInput(false);
        setName('');
        setNumDebaters('');
        setNumJudges('');
    }

    
    // If the selected school is found, set the pairs and judges values
    // if (selectedSchool) {
    //     setPairs(selectedSchool.num_debaters.toString());
    //     setJudges(selectedSchool.num_judges.toString());
    // }

    setShowModal(!showModal);
};

const handleSubmitModal = async (e) => {
    e.preventDefault();

    const formData = {
      name: name,
      num_debaters: parseInt(numDebaters),
      num_judges: parseInt(numJudges),
    };

    try {
      await axios.post('/add_school', formData);   
      toggleModal();
      fetchSchools();
    } catch (error) {
      console.error('Error adding school:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: name,
      num_debaters: parseInt(numDebaters),
      num_judges: parseInt(numJudges),
    };

    try {
      await axios.post('/add_school', formData);   
      toggleModal();
      fetchSchools();

    } catch (error) {
      console.error('Error adding school:', error);
    }

    
};

    const deleteSchool = async (name) => {
        try {
        const response = await axios.post('/delete_school', { name });
        fetchSchools();
        } catch (error) {
        console.error('Error deleting school:', error);
        }
    };

  return (
    <div>
      
      <Header title="School Management" mode="true"/>
   
    <div className="table-container">
      <h2>Schools (Junior Varsity)</h2>
      <table class="table">
        <thead>
          <tr>
            <th class="shrink">Name</th>
            <th class="shrink">Pairs</th>
            <th class="shrink">Judges</th>
            <th class="shrink">Remove</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school, index) => (
            <tr key={index}>
              <td class="shrink">{school.name}</td>
              <td class="shrink">{school.num_debaters}</td>
              <td class="shrink">{school.num_judges}</td>
              <td class="shrink">
                <button onClick={() => deleteSchool(school.name)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
{/* 
      {successDelete && (
            <p class="success">Successully deleted user: {userEmailToDelete}</p>
        )}

      {invalidDelete && (
                  <p class="fail">You cannot remove yourself as an admin!</p>
              )} */}
    </div>
  
        <button
            onClick={toggleModal}
            className="btn-modal">
                Add New School
        </button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h1>Add School</h1>
            <form onSubmit={handleSubmitModal}>
                <label>
                    Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                    Num Pairs: <input type="number" value={numDebaters} onChange={(e) => setNumDebaters(e.target.value)} required />
                </label>
                <label>
                    Num Judges: <input type="number" value={numJudges} onChange={(e) => setNumJudges(e.target.value)} required />
                </label>
                <hr />
                <button type="submit">Save</button>
                </form>
                <button
                className='close-modal'
                onClick={toggleModal}>
                Close
            </button>
          </div>
         
        </div>
        
      )}
    </div>
  );
};

export default AddSchool;
