import React from 'react';
import { useEffect, useState} from 'react';
import './Edit_Tournament.css';
import axios from 'axios';

function Edit_Tournament() {

  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/tournamentschedule/1')
      .then((response) => {
        setSchedule(response.data);
      })
      .catch((error) => {
        // Handle error
        console.error('Error fetching schedule:', error);
      });
  }, []);


  return (
    <div>
      

<>
  <header>
    <h1>EDIT - Tournament</h1>
    <a href="dashboard" class="active">Dashboard</a>
  </header>
  <section className="schools">
    <div className="school">
      <h3>A - Bergen Academies (Host)</h3>
      <p>Debaters: 15</p>
      <p>Judges: 15</p>
      <p>Coach: Mr. Russo</p>
      <button>Edit</button>
    </div>
    <div className="school">
      <h3>B - Glen Rock</h3>
      <p>Debaters: 9</p>
      <p>Judges: 4</p>
      <p>Coach: Mr. Joshi</p>
      <button>Edit</button>
    </div>
    <div className="school">
      <h3>C - Old Tappan</h3>
      <p>Debaters: 9</p>
      <p>Judges: 3</p>
      <p>Coach: Mr. Kim</p>
      <button>Edit</button>
    </div>
    <div className="school">
      <h3>D - Fort Lee</h3>
      <p>Debaters: 3</p>
      <p>Judges: 5</p>
      <p>Coach: Mr. Rodriguez</p>
      <button>Edit</button>
    </div>
    <div className="school">
      <h3>E - Demarest</h3>
      <p>Debaters: 7</p>
      <p>Judges: 3</p>
      <p>Coach: Mr. Krstevski</p>
      <button>Edit</button>
    </div>
  </section>
  <button>Add More Schools</button>
  <section className="schedule">
    <h2>Current Schedule / Matchups (Round 1)</h2>

    <p>{schedule}</p>

    <table>
      <tbody>
        <tr>
          <th>Affirmative</th>
          <th>Negative</th>
          <th>Judge</th>
          <th>Room</th>
        </tr>
        <tr>
          <td>A1</td>
          <td>B1</td>
          <td>CJ1</td>
          <td>42</td>
        </tr>
        <tr>
          <td>A2</td>
          <td>B2</td>
          <td>CJ2</td>
          <td>90</td>
        </tr>
        <tr>
          <td>A3</td>
          <td>B3</td>
          <td>CJ3</td>
          <td>115</td>
        </tr>
      </tbody>
    </table>
  </section>
  <section className="schedule">
    <h2>Current Schedule / Matchups (Round 2)</h2>
    <table>
      <tbody>
        <tr>
          <th>Affirmative</th>
          <th>Negative</th>
          <th>Judge</th>
          <th>Room</th>
        </tr>
        <tr>
          <td>B1</td>
          <td>A2</td>
          <td>CJ3</td>
          <td>42</td>
        </tr>
        <tr>
          <td>B2</td>
          <td>A1</td>
          <td>CJ4</td>
          <td>90</td>
        </tr>
        <tr>
          <td>B3</td>
          <td>A4</td>
          <td>CJ2</td>
          <td>115</td>
        </tr>
      </tbody>
    </table>
  </section>
  <footer>
    <button>Generate New Schedule</button>
    <button>Manually Edit Schedule</button>
    <button>Download/Print Schedule</button>
  </footer>
</>


    </div>
  );
}

export default Edit_Tournament;