import React from 'react';
import { useEffect, useState} from 'react';
import './Edit_Tournament.css';
import axios from 'axios';
import { PDFViewer, Document, Page, View, Text } from '@react-pdf/renderer';
import ReactDOM from 'react-dom'; 
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function ViewTournamentSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [roundsData, setRoundsData] = useState([]);
  const [pdfTitle, setTitle] = useState("Schedule");
  const [schools, setSchools] = useState([]);
  const { tournamentNumber } = useParams();
  const [hostSchool, setHostSchool] = useState("")
  const [error, setError] = useState(false)
  let navigate = useNavigate();

  const routeChange = () => {
    navigate(`/viewtournaments`);
  }

  useEffect(() => {
    fetchTournamentSchedule();
    fetchTournamentData();
  }, [tournamentNumber]);

  const fetchTournamentSchedule = async () => {

    try {
      const response = await fetch(`http://localhost:5000/tournamentschedule/${tournamentNumber}`, {
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
      const response = await fetch(`http://localhost:5000/tournament/${tournamentNumber}`, {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json();
      setSchools(data.schools);
      setHostSchool(data.host_school.name);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const viewMap = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/schoolmap/${hostSchool}`, {
        responseType: 'blob', // Specify response type as blob (for binary data)
      });
  
      const contentType = response.headers['content-type'];
      const file = new Blob([response.data], { type: contentType });
      const fileUrl = URL.createObjectURL(file);
  
      // Open the map in a new window
      window.open(fileUrl);
    } catch (error) {
      console.error('Error fetching map:', error);
      // Optionally provide user feedback (e.g., show an error message)
      alert('Failed to load map. Please try again later.');
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


  return (
    <div>
      <header className="edittournamentheader">
        <h1>View Tournament {tournamentNumber}</h1>
        <button onClick={() => routeChange()}>Return to All Tournaments</button>
      </header>

      <section className="schedule">

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
              {round.map((match, matchIndex) => (
                <tr key={matchIndex}>
                  <td>{match.affirmative}</td>
                  <td>{match.negative}</td>
                  <td>{match.judge}</td>
                  <td>N/A</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

    </section>
    
      <footer>
        <button onClick={handlePrint}>Download/Print Schedule</button>
        <button onClick={viewMap}>View School Map</button>
      </footer>
    </div>
  );
};



export default ViewTournamentSchedule;