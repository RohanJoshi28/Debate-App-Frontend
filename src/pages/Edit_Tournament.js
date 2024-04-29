import React from 'react';
import { useEffect, useState} from 'react';
import './Edit_Tournament.css';
import axios from 'axios';
import { PDFViewer, Document, Page, View, Text } from '@react-pdf/renderer';
import ReactDOM from 'react-dom'; 
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function Edit_Tournament() {
  const [schedule, setSchedule] = useState([]);
  const [roundsData, setRoundsData] = useState([]);
  const [pdfTitle, setTitle] = useState("Schedule");
  const [schools, setSchools] = useState([]);
  const { tournamentNumber } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(-1);
  const [invalidInput, setInvalidInput] = useState(false)
  let navigate = useNavigate();

  const routeChange = () => {
    navigate(`/dashboard`);
  }

  useEffect(() => {
    fetchTournamentSchedule();
    fetchTournamentData();
  }, [tournamentNumber]);

  const fetchTournamentSchedule = async () => {
    try {

      const response = await fetch(`http://127.0.0.1:5000/tournamentschedule/${tournamentNumber}`, {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const fetchTournamentData = async () => {
    try {
    
      const response = await fetch(`http://127.0.0.1:5000/tournament/${tournamentNumber}`, {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const responseData = await response.json();
      setSchools(responseData.schools);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    // Ensure schedule is an array before mapping
    if (!Array.isArray(schedule)) {
      console.error('schedule is not an array:', schedule);
      return;
    }
  
    const parsedRoundsData = schedule.map((round, roundIndex) => {
      // Check if round is an array before mapping
      if (!Array.isArray(round)) {
        console.error('round is not an array:', round);
        return { id: roundIndex, matches: [] }; // Return an object with an empty matches array
      }
  
      return {
        id: roundIndex,
        matches: round.map((entry, matchIndex) => {
          const [affirmative, negative, judge] = entry.split('|');
          return { 
            id: `${roundIndex}-${matchIndex}`, // Generate a unique ID for each match
            affirmative: transformTeam(affirmative),
            negative: transformTeam(negative),
            judge: transformJudge(judge)
          };
        })
      };
    });
  
    setRoundsData(parsedRoundsData);
  }, [schedule]);


  //MODAL STUFF
  const [modal, setModal] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  
  const toggleModal = () => {
      if (!modal){
          setSuccess(false);
          setInvalidInput(false);
      }
      setModal(!modal);
      
      
  }

  function editButton(selectedSchoolID) {
    toggleModal();
    setSelectedSchool(selectedSchoolID);
  }

  const handleSubmit = async (e) => {
      // Prevent the browser from reloading the page
      e.preventDefault();
      // Read the form data
      const form = e.target;
      const formData = new FormData(form);

      const pairs = parseInt(formData.get('pairs')); // Parse input as integer
      const judges = parseInt(formData.get('judges')); // Parse input as integer
      
      // Check if inputs are numerical
      if (isNaN(pairs) || isNaN(judges)) {
          toggleModal();
          setInvalidInput(true)
          return;
      }
      // fetch(`http://localhost:5000/updateschool/${selectedSchool}`, { method: form.method, body: formData });
      // toggleModal();
      // setSuccess(true);

      try {
        const response = await fetch(`http://127.0.0.1:5000/updateschool/${selectedSchool}`, {
          method: "POST",
          credentials: "include",
          mode: "cors",
          body: formData
        })
        // await axios.post(`/updateschool/${selectedSchool}`, formData);
        toggleModal();
        fetchTournamentData();
        fetchTournamentSchedule();
      } catch (error) {
        console.error('Error updating school:', error);
      }

      // fetch(`http://localhost:5000/updateschool/${selectedSchool}`, { method: form.method, body: formData }).then(
      //   fetchTournamentData(),

      // );
      
  }

  if (modal){
      document.body.classList.add('active-modal')
  } else {
      document.body.classList.remove('active-modal')
      
  }

  


  const transformTeam = (team) => {
    const [first, second] = team.split('~');
    const alphabetizedFirst = String.fromCharCode(65 + parseInt(first));
    const incrementedSecond = parseInt(second) + 1;
    return `${alphabetizedFirst}${incrementedSecond}`;
  };

  const transformJudge = (judge) => {
    const letter = judge.charAt(0); // Get the first character (the letter 'J')
    const number = judge.substring(1).split('~')[0]; // Get the number after 'J' and before '~'
    const incrementedSecond = parseInt(judge.substring(3)) + 1; // Get the second number and increment it
    const alphabetizedNumber = String.fromCharCode(65 + parseInt(number));
    return `${alphabetizedNumber}${letter}${incrementedSecond}`;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<!DOCTYPE html><html><head><title>Print</title><style>body, html { margin: 0; padding: 0; height: 100%; }</style></head><body>');
    ReactDOM.render(
      <div style={{ height: '90vh' }}>
        <PDFViewer width="100%" height="100%">
          <TablePdf roundsData={roundsData} />
        </PDFViewer>
      </div>,
      printWindow.document.body
    );
    printWindow.document.write('</body></html>');
    printWindow.document.close();
  };

  const TablePdf = ({ roundsData }) => (
    <Document title={pdfTitle}>
      {roundsData.map((round, roundIndex) => (
        <Page key={roundIndex} size="A4" style={styles.page}>
          <Header roundNumber={roundIndex + 1} /> {}
          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Affirmative</Text>
                <Text style={styles.tableHeader}>Negative</Text>
                <Text style={styles.tableHeader}>Judge</Text>
                <Text style={styles.tableHeader}>Room</Text>
              </View>
              {round.matches.map((match, matchIndex) => (
                <View key={matchIndex} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{match.affirmative}</Text>
                  <Text style={styles.tableCell}>{match.negative}</Text>
                  <Text style={styles.tableCell}>{match.judge}</Text>
                  <Text style={styles.tableCell}>N/A</Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
  
  

  const Header = ({ roundNumber }) => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Round {roundNumber}</Text>
    </View>
  );
  
  
  const styles = {
    page: {
      padding: 30,
    },
    section: {
      marginBottom: 10,
    },
    title: {
      fontSize: 16,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    table: {
      display: 'table',
      width: 'auto',
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: 'row',
      backgroundColor: '#fff',
    },
    tableHeader: {
      width: '25%',
      backgroundColor: '#f2f2f2',
      padding: 5,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    tableCell: {
      width: '25%',
      padding: 5,
      textAlign: 'center',
    },
  };




  const handleDragStart = (e, cellData) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(cellData));
  };

  // Function to handle the drop event on a cell
  const handleDrop = async (e, targetCellData) => {
    e.preventDefault();
    const sourceCellData = await JSON.parse(e.dataTransfer.getData('text'));
  
    if (sourceCellData.id === targetCellData.id) return;
    const changeRoundsData = (prevRoundsData) => {
      const newRoundsData = JSON.parse(JSON.stringify(prevRoundsData));
      const sourceRound = newRoundsData.findIndex(round => round.id === sourceCellData.roundId);
      const targetRound = newRoundsData.findIndex(round => round.id === targetCellData.roundId);
      const sourceCell = newRoundsData[sourceRound].matches[sourceCellData.matchIndex][sourceCellData.cellType];
      const targetCell = newRoundsData[targetRound].matches[targetCellData.matchIndex][targetCellData.cellType];
      newRoundsData[sourceRound].matches[sourceCellData.matchIndex][sourceCellData.cellType] = targetCell;
      newRoundsData[targetRound].matches[targetCellData.matchIndex][targetCellData.cellType] = sourceCell;
      return newRoundsData;
    };

    const newRoundsData = await changeRoundsData(roundsData)
  
    const updatedSchedule = newRoundsData.map(round =>
      round.matches.map(match => ({
        affirmative: match.affirmative,
        negative: match.negative,
        judge: match.judge
      }))
    );
    console.log(updatedSchedule)
  
    try {
      const response = await axios({
        method: 'post',
        url: `http://127.0.0.1:5000/tournament/${tournamentNumber}/update_schedule`,
        data: JSON.stringify({ schedule: updatedSchedule }),
        withCredentials: true,
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        console.log('Schedule updated successfully');
        fetchTournamentSchedule(); // Re-fetch the updated schedule
      } else {
        console.error('Failed to update schedule:', response);
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };
  

  // Function to prevent the default handling of the dragover event to allow dropping
  const handleDragOver = (e) => {
    e.preventDefault();
  };













  return (
    <div>
      <header className="edittournamentheader">
        <h1>Edit Tournament {tournamentNumber}</h1>
        <button onClick={() => routeChange()}>Return to Dashboard</button>
      </header>

      {invalidInput && (
                  <p class="fail">Please enter in a valid integer!</p>
              )}

      {isSuccess && (
                        <p class="success">Successfully edited school!</p>
                    )}
        
      <section className="schools">
        {schools.map((school, index) => (
          <div className="school" key={index}>
            <h3>{String.fromCharCode(65 + index)} - {school.name}</h3>
            <p>Pairs: {school.num_debaters}</p>
            <p>Judges: {school.num_judges}</p>
            <button onClick={() => editButton(school.id)}>Edit</button>
          </div>
          
        ))}
     
      </section>

      <section className="schedule">
        {roundsData.map((round, roundIndex) => (
          <div key={round.id}>
            <h2>Round {roundIndex + 1}</h2>
            <table>
              <thead>
                <tr>
                  <th>Affirmative</th>
                  <th>Negative</th>
                  <th>Judge</th>
                  <th>Room</th> {/* Add other headers as needed */}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(round.matches) ? round.matches.map((match, matchIndex) => (
                  <tr key={match.id}>
                    {Object.keys(match).map((cellType) => {
                      if (cellType === 'id') return null; // Skip the id field
                      const cellData = { id: match.id, roundId: round.id, matchIndex, cellType };
                      return (
                        <td
                          key={`${match.id}-${cellType}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, cellData)}
                          onDrop={(e) => handleDrop(e, cellData)}
                          onDragOver={handleDragOver}
                        >
                          {match[cellType]}
                        </td>
                      );
                    })}
                    <td>N/A</td> {/* This is for the Room column */}
                  </tr>
                )) : <tr><td colSpan="4">No matches for this round.</td></tr>}
              </tbody>
            </table>
          </div>
        ))}
      </section>

    
    {modal && (
            <div className="modal">
            <div onClick={toggleModal} className="overlay"></div>
            <div className="modal-content">
                <h1>Edit School</h1>
                <form method="post" onSubmit={handleSubmit}>
            <label>
                Num Pairs: <input name="pairs" />
            </label>
            
            <p></p>
            <label>
                Num Judges: <input name="judges" />
            </label>
            
            <hr />
            <button type="submit">Save</button>
            </form>
            <button
                className='close-modal'
                onClick={toggleModal}>
                Close
            </button>
            </div>

        </div>
        )}


      <footer>
        <button onClick={handlePrint}>Download/Print Schedule</button>
      </footer>
    </div>
  );
};



export default Edit_Tournament;