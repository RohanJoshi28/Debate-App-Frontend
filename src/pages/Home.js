import React from 'react';
import './App.css';
import AuthButton from './AuthButton'; // Import AuthButton component

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Debate Dashboard</h1>
        <AuthButton /> {/* Use AuthButton component */}
        
      </header>
    </div>
  );
}

export default Home;