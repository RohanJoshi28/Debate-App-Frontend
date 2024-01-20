import React from 'react';
import './Leaderboard.css';
import Header from '../components/header';

function Leaderboard() {
  return (
    <div>
      <Header title="Leaderboard"/>
  
      <div className="main">
        
        <div className="rank-section">
          <h2>JV Leaderboard 2023-2024</h2>
          <div>
            <h3>School Rankings</h3>
            <table className="rank-table">
              <tbody>
                <tr>
                  <th>Ranking</th>
                  <th>School</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>BCA</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Dumont</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Glen Rock</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Fort Lee</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Demarest</td>
                </tr>
              </tbody>
            </table>
            <button className="update-btn">Update</button>
          </div>
          <div>
            <h3>Partnership Rankings</h3>
            <table className="rank-table">
              <tbody>
                <tr>
                  <th>Ranking</th>
                  <th>Partnership</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>John Smith &amp; Jane Smith (BCA)</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>John Apple &amp; Marry Smith (Fort Lee)</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Tim Jacobs &amp; Robert McDonald (Glen Rock)</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Jim Lee and Michael Jones (BCA)</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Andy Kim and Joseph Brown (BCA)</td>
                </tr>
              </tbody>
            </table>
            <button className="update-btn">Update</button>
          </div>
          <div>
            <h3>Debater/Speaker Rankings</h3>
            <table className="rank-table">
              <tbody>
                <tr>
                  <th>Ranking</th>
                  <th>Debater</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>John Smith (BCA)</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jane Smith (BCA)</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Tim Jacobs (Glen Rock)</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>John Apple (Fort Lee)</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Mary Smith (Fort Lee)</td>
                </tr>
              </tbody>
            </table>
            <button className="update-btn">Update</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Leaderboard;