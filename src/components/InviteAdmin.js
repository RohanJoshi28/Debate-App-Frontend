import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
function InviteAdmin() {
    let navigate = useNavigate();
    const [successSubmit, setSuccess] = useState(false);
    const refresh = () =>{
        let path = '../settings';
        navigate(path);
    }

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
    
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        // You can pass formData as a fetch body directly:
        fetch('http://127.0.0.1:5000/save_email', { method: form.method, body: formData });
        window.location.reload(false);

      }

    
  if (successSubmit){
    return (
        <div class="tournament-card">
    
            <h1>Invite Admin</h1>
            <form method="post" onSubmit={handleSubmit}>
          <label>
            Name: <input name="name" />
          </label>
        
        <p></p>
          <label>
            Email: <input name="email" />
          </label>
          
          <hr />
          <button type="submit">Submit</button>
        </form>
        <p class="success">Successully added new admin!</p>
        </div>
      );
  } else {
    return (
        <div class="tournament-card">
    
            <h1>Invite Admin</h1>
            <form method="post" onSubmit={handleSubmit}>
          <label>
            Name: <input name="name" />
          </label>
        
        <p></p>
          <label>
            Email: <input name="email" />
          </label>
          
          <hr />
          <button type="submit">Submit</button>
        </form>
        </div>
      );
  }
  
}

export default InviteAdmin;