import React from 'react';
import { useEffect, useState} from 'react';
import './Edit_Tournament.css';
import axios from 'axios';
import { PDFViewer, Document, Page, View, Text } from '@react-pdf/renderer';
import ReactDOM from 'react-dom'; 
function Edit_Tournament() {

  const [schedule, setSchedule] = useState([]);
  const [roundsData, setRoundsData] = useState([]);
  const [pdfTitle, setTitle] = useState("Schedule");
  const [schools, setSchools] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  

  useEffect(() => {
    axios.get('http://localhost:5000/tournamentschedule/1')
      .then((response) => {
        const tournamentData = response.data;
        setSchedule(response.data);
        console.log(response.data);
        setSchools(tournamentData.schools);
      })
      .catch((error) => {
        // Handle error
        console.error('Error fetching schedule:', error);
      });
  }, []);


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
          <View style={styles.section}>
            <Text style={styles.title}>{`Round ${roundIndex + 1}`}</Text>
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

//Dynamic addition
  return (
    
    <div>
    <header>
        <h1>EDIT - Tournament</h1>
        <a href="dashboard" class="active">Dashboard</a>
      </header>
      <section className="schools">
  {schools.map((school, index) => (
    <div className="school" key={index}>
      <h3>{school.name}</h3>
      <p>Debaters: {school.num_debaters}</p>
      <p>Judges: {school.num_judges}</p>
      <p>Coach: {renderCoachName(school.coach)}</p>
      <button onClick={() => handleEditClick(school)}>Edit</button>
    </div>
  ))}
</section>




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
        <button>Generate New Schedule</button>
        <button>Manually Edit Schedule</button>
        <button onClick={handlePrint}>Download/Print Schedule</button>
      </footer>
    </div>
  );


  //Everything here onwards is to work on the form for edit...
  const handleEditClick = (school) => {
    setSelectedSchool(school);
    setIsModalOpen(true);
  };
  const handleSave = (schoolId, updatedSchoolData) => {
    axios.put(`http://localhost:5000/school/${schoolId}`, updatedSchoolData)
      .then(response => {
        setIsModalOpen(false);
        setSchools(schools.map(school => school.id === schoolId ? {...school, ...updatedSchoolData} : school));
      })
      .catch(error => {
        console.error('Error updating school:', error);
      });
  };
  
  
  
  
};

function renderCoachName(coach) {
  if (coach && coach.name) {
    return coach.name;
  }
  return 'No coach';
}



export default Edit_Tournament;