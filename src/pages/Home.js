import React from 'react';
import './App.css';
import AuthButton from './AuthButton'; // Import AuthButton component
import Auth from '../auth/Auth';
import { GoogleOAuthProvider } from "@react-oauth/google";

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Debate Dashboard</h1>

        <GoogleOAuthProvider clientId="955820545978-t2p3gj01oa82sqngom0c9uj4clgd9t4f.apps.googleusercontent.com">
        <Auth></Auth>
        </GoogleOAuthProvider>
        
        
      </header>
    </div>
  );
}

export default Home;