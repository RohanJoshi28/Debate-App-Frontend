import React, { useState } from 'react';
import './Leaderboard.css';
import Header from '../components/header';
import axios from 'axios';

function Leaderboard() {
  // State to hold the updated rankings
  const [updatedSchoolRankings, setUpdatedSchoolRankings] = useState([]);
  const [updatedPartnershipRankings, setUpdatedPartnershipRankings] = useState([]);

  // Function to handle updating school rankings
  const updateSchoolRankings = () => {
    axios.post('https://api.rohanjoshi.dev/updateschoolranking', { rankings: updatedSchoolRankings })
      .then(response => {
        console.log(response.data);
        // Handle success
      })
      .catch(error => {
        console.error('Error updating school rankings:', error);
        // Handle error
      });
  };

  // Function to handle updating partnership rankings
  const updatePartnershipRankings = () => {
    axios.post('https://api.rohanjoshi.dev/updatepartnershipranking', { rankings: updatedPartnershipRankings })
      .then(response => {
        console.log(response.data);
        // Handle success
      })
      .catch(error => {
        console.error('Error updating partnership rankings:', error);
        // Handle error
      });
  };

  return (
    <div>
      <Header title="Leaderboard" mode="true"/>

      <div className="main">
        {/* Your leaderboard sections */}
        {/* Implement functionality to update updatedSchoolRankings and updatedPartnershipRankings arrays */}
        {/* Implement UI to display and edit the rankings */}

        {/* Update buttons */}
        <button onClick={updateSchoolRankings} className="update-btn">Update School Rankings</button>
        <button onClick={updatePartnershipRankings} className="update-btn">Update Partnership Rankings</button>
      </div>
    </div>
  );
}

export default Leaderboard;