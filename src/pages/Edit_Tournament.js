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
  const [roomInputs, setRoomInputs] = useState('');
  const [roomAssignments, setRoomAssignments] = useState({});
  const [isRoomAssignmentLoading, setIsRoomAssignmentLoading] = useState(true);

  let navigate = useNavigate();

  const routeChange = () => {
    navigate(`/dashboard`);
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchTournamentSchedule();
      await fetchTournamentData();
      await fetchRoomAssignments();
    };
    fetchData();
  }, [tournamentNumber]);
  



  const fetchRoomAssignments = async () => {
    try {
      setIsRoomAssignmentLoading(true);
      const response = await axios.get(`/tournament/${tournamentNumber}/rooms`);
      const fetchedRoomAssignments = {};
      response.data.forEach(ra => {
        fetchedRoomAssignments[ra.match_index] = ra.room_number;
      });
      setRoomAssignments(fetchedRoomAssignments);
    } catch (error) {
      console.error('Error fetching room assignments:', error);
    } finally {
      setIsRoomAssignmentLoading(false);
    }
};

  
  
const saveRoomAssignments = async () => {
  try {
    const roomAssignmentsArray = Object.entries(roomAssignments).map(([index, room]) => {
      return { match_index: index, room_number: room };
    });
    const response = await axios.post(`/tournament/${tournamentNumber}/rooms`, roomAssignmentsArray);
    console.log(response.data.message); 

  } catch (error) {
    console.error('Error saving room assignments:', error);
  }
};

  

  const fetchTournamentSchedule = async () => {
    try {
      const response = await axios.get(`/tournamentschedule/${tournamentNumber}`);
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const fetchTournamentData = async () => {
    try {
      const response = await axios.get(`/tournament/${tournamentNumber}`);
      setSchools(response.data.schools);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    const parsedRoundsData = schedule.map(round => {
      return round.map(entry => {
        const [affirmative, negative, judge] = entry.split('|');
        return { 
          affirmative: transformTeam(affirmative),
          negative: transformTeam(negative),
          judge: transformJudge(judge) // Apply transformation to judge
        };
      });
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
      
      if (isNaN(pairs) || isNaN(judges)) {
          toggleModal();
          setInvalidInput(true)
          return;
      }
      // fetch(`http://localhost:5000/updateschool/${selectedSchool}`, { method: form.method, body: formData });
      // toggleModal();
      // setSuccess(true);

      try {
        await axios.post(`/updateschool/${selectedSchool}`, formData);
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
          <Header roundNumber={roundIndex + 1} /> {/* Pass round number to the header */}
          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Affirmative</Text>
                <Text style={styles.tableHeader}>Negative</Text>
                <Text style={styles.tableHeader}>Judge</Text>
                <Text style={styles.tableHeader}>Room</Text>
              </View>
              {round.map((match, matchIndex) => (
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


  const assignRooms = () => {
    const roomsArray = roomInputs.split('\n').filter(Boolean); 
    const newRoomAssignments = {};
    const allMatches = roundsData.flat(); 
    
    allMatches.forEach((match, matchIndex) => {
      const matchKey = `match${matchIndex}`;
      newRoomAssignments[matchKey] = roomsArray[matchIndex] || 'N/A';
    });
  
    setRoomAssignments(newRoomAssignments);
  };
  useEffect(() => {
    const saveChanges = async () => {
      const roomAssignmentsNotEmpty = Object.values(roomAssignments).some(room => room !== '');
  
      if (roomAssignmentsNotEmpty) {
        await saveRoomAssignments();
      }
    };

    saveChanges();
  }, [roomAssignments]);


  
  
  const updateRoomAssignment = (matchKey, newRoom) => {
    setRoomAssignments(prevAssignments => ({
      ...prevAssignments,
      [matchKey]: newRoom
    }));
  };
  
  
  
  
  

  const handleRoomInputChange = (event) => {
    setRoomInputs(event.target.value);
  };
  

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    await saveRoomAssignments();
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


      <textarea
    value={roomInputs}
    onChange={handleRoomInputChange}
    placeholder="Enter room numbers, one number per line"
  ></textarea>
  <button onClick={assignRooms}>Assign Rooms</button>

  <section className="schedule">
      <form onSubmit={handleRoomSubmit}>
        {roundsData.map((round, roundIndex) => (
          <div key={roundIndex}>
            <h2>Round {roundIndex + 1}</h2>
            <table>
              <thead>
                <tr>
                  <th>Affirmative</th>
                  <th>Negative</th>
                  <th>Judge</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                {round.map((match, matchIndex) => {
                  const globalMatchIndex = roundIndex * roundsData[0].length + matchIndex;
                  const matchKey = `match${globalMatchIndex}`;
                  return (
                    <tr key={matchIndex}>
                      <td>{match.affirmative}</td>
                      <td>{match.negative}</td>
                      <td>{match.judge}</td>
                      <td>
                        <input
                          type="text"
                          value={roomAssignments[matchKey] || ''}
                          onChange={(e) => updateRoomAssignment(matchKey, e.target.value)}
                          onBlur={() => saveRoomAssignments()} 
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
        <button type="submit" style={{ display: "none" }}>Save Rooms</button>
      </form>
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
        <button>Generate New Schedule</button>
        <button>Manually Edit Schedule</button>
        <button onClick={handlePrint}>Download/Print Schedule</button>
      </footer>
    </div>
  );
};



export default Edit_Tournament;