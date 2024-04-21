
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/header';
import './AddTournament.css';
import { useNavigate } from 'react-router-dom';

const AddTournament = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [hostSchool, setHostSchool] = useState('');
  const [tournamentDate, setTournamentDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [pairs, setPairs] = useState('');
  const [judges, setJudges] = useState('');
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

  const handleSchoolChange = (schoolId) => {
    setSelectedSchools((prevSelectedSchools) => {
      if (prevSelectedSchools.includes(schoolId)) {
        return prevSelectedSchools.filter((id) => id !== schoolId);
      } else {
        toggleModal(schoolId); // Toggle modal when a school is selected
        return [...prevSelectedSchools, schoolId];
      }
    });
  };

  const handleHostSchoolChange = (event) => {
    setHostSchool(event.target.value);
  };

  const handleDateChange = (event) => {
    setTournamentDate(event.target.value);
  };

  const toggleModal = (schoolId) => {
    if (!showModal){
        setInvalidInput(false);
    }
    setSelectedSchoolId(schoolId);

    // Find the selected school in the schools array
    const selectedSchool = schools.find(school => school.id === schoolId);
    
    // If the selected school is found, set the pairs and judges values
    if (selectedSchool) {
        setPairs(selectedSchool.num_debaters.toString());
        setJudges(selectedSchool.num_judges.toString());
    }

    setShowModal(!showModal);
};

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    if (!pairs || !judges) {
      setInvalidInput(true);
      return;
    }
    const formData = new FormData();
    formData.append('pairs', pairs);
    formData.append('judges', judges);
    try {
      await axios.post(`/updateschool/${selectedSchoolId}`, formData);
     
      setShowModal(false);
      fetchSchools();
    } catch (error) {
      console.error('Error updating school:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
        host_school_id: hostSchool,
        datetime: tournamentDate,
        schools: selectedSchools,
    };
    try {
        const response = await axios.post('/add_tournament', formData);
        console.log('Tournament added successfully:', response.data);

    } catch (error) {
        console.error('Error adding tournament:', error);
    }

    routeChange();
};

  return (
    <div>
      <header className="edittournamentheader">
        <h1>Add Tournament</h1>
        <button onClick={() => routeChange()}>Return to Dashboard</button>
      </header>

      <div className="add-tournament-container">
        <form onSubmit={handleSubmit} className="tournament-form">
          <label htmlFor="tournamentDate">Date:</label>
          <input
            type="date"
            id="tournamentDate"
            value={tournamentDate}
            onChange={handleDateChange}
            required
          />
        <div className="school-checkboxes">
                        {schools.map((school) => (
            <div key={school.id}>
                <input
                    type="checkbox"
                    id={`school-${school.id}`}
                    onChange={() => handleSchoolChange(school.id)}
                />
                <label htmlFor={`school-${school.id}`}>
                    {school.name} ({school.num_debaters} pairs, {school.num_judges} judges)
                </label>
            </div>
        ))}
        

        </div>

          <label htmlFor="hostSchool">Host School:</label>
          <select id="hostSchool" onChange={handleHostSchoolChange} required>
            <option value="">Select Host School</option>
            {schools
              .filter((school) => selectedSchools.includes(school.id))
              .map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
          </select>
          <button type="submit">Add Tournament</button>
        </form>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h1>Edit School</h1>
            {invalidInput && <p className="small-fail">Please enter a valid integer for pairs and judges!</p>}
            <form onSubmit={handleSubmitModal}>
              <label>
                Num Pairs: <input type="number" value={pairs} onChange={(e) => setPairs(e.target.value)} />
              </label>
              <label>
                Num Judges: <input type="number" value={judges} onChange={(e) => setJudges(e.target.value)} />
              </label>
              <hr />
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTournament;
