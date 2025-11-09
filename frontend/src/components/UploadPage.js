import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type !== "text/csv") {
      alert("Please upload a valid CSV file!");
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  // Handle file upload
  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a CSV file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server Error: ${response.status}`);
      }

      const data = await response.json();
      navigate("/results", { state: { results: data } });
    } catch (error) {
      console.error("Error:", error);
      alert(`Error processing the file: ${error.message}`);
    }finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload Dataset for Attack Detection</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".csv" onChange={handleFileChange} required />
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload & Detect"}
        </button>
      </form>
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
};

export default UploadPage;
