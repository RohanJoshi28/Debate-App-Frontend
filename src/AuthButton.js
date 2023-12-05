import React, { useState } from 'react';
import axios from 'axios';
import './AuthButton.css'; // You will create this CSS file for styling

function AuthButton() {
  console.log("hello")
  const [confirmed, setConfirmed] = useState(false);

  const handleClick = () => {
    axios.post('http://127.0.0.1:5000/increment')
      .then(response => {
        setConfirmed(true);
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <button className="google-auth-button" onClick={handleClick}>Fake Google Auth</button>
      {confirmed && <p>Confirmed</p>}
    </div>
  );
}

export default AuthButton;