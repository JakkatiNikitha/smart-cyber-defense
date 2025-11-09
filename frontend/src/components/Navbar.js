import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>Smart Cyber Defense</h1>
      <ul style={styles.navLinks}>
        <li>
          <Link to="/" style={styles.link}>Upload</Link>
        </li>
        <li>
          <Link to="/results" style={styles.link}>Results</Link>
        </li>
      </ul>
    </nav>
  );
};

// Inline styles for the Navbar
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#007BFF",
    color: "white",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "18px",
  },
};

export default Navbar;
