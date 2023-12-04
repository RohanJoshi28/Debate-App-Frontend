import React from 'react';
import './App.css';
import AuthButton from './AuthButton'; // Import AuthButton component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthButton /> {/* Use AuthButton component */}
      </header>
    </div>
  );
}

export default App;