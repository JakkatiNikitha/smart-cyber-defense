import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get results from navigation state
  const results = location.state?.results || {};

  return (
    <div style={styles.container}>
      <h2>Attack Detection Results</h2>

      {Object.keys(results).length === 0 ? (
        <p>No results available.</p>
      ) : (
        <ul style={styles.list}>
          {Object.entries(results).map(([attackType, count]) => (
            <li key={attackType}>
              <strong>{attackType}:</strong> {count}
            </li>
          ))}
        </ul>
      )}

      <button style={styles.button} onClick={() => navigate("/")}>
        Upload Another File
      </button>
    </div>
  );
};

// Inline styles for simple UI
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    margin: "50px auto",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    width: "50%",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default ResultsPage;
