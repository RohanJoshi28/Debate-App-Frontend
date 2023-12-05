import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import './AuthButton.css'; // You will create this CSS file for styling

function AuthButton() {

  const [confirmed, setConfirmed] = useState(false);
  const [ user, setUser ] = useState({});


  function handleCallbackResponse(response){
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwtDecode(response.credential);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "955820545978-t2p3gj01oa82sqngom0c9uj4clgd9t4f.apps.googleusercontent.com",
      callback: handleCallbackResponse //what function do we call when someone logs in

    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large"}
    );
  }, []);
  
  //show log out button if have user
  return (
    <div className="AuthButton">
      <div id="signInDiv"></div>
      { Object.keys(user).length != 0 &&
        <button onClick={ (e) => handleSignOut(e)}>Sign Out</button>
      }


      
      { user &&
        <div>
          <img src={user.picture}></img>
          <h3>{user.name}</h3>
        </div>
      }
    </div>
  );
  console.log("hello")
  

  const handleClick = () => {
    axios.post('http://127.0.0.1:5000/increment')
      .then(response => {
        setConfirmed(true);
      })
      .catch(error => console.error('Error:', error));
  };

  // return (
  //   <div>
  //     <button className="google-auth-button" onClick={handleClick}>Fake Google Auth</button>
  //     {confirmed && <p>Confirmed</p>}
  //   </div>
  // );
}

export default AuthButton;