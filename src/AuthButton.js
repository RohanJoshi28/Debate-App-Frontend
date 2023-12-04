import React, { useState } from 'react';
import axios from 'axios';
import './AuthButton.css'; // You will create this CSS file for styling

function AuthButton() {
  console.log("hello")
  const [confirmed, setConfirmed] = useState(false);

  const handleClick = () => {
    console.log("hi")
    axios.post('http://localhost:5000/increment')
      .then(response => {
        console.log(response.data);
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