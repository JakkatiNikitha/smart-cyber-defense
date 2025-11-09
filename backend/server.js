const express = require("express");
const { exec } = require("child_process");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Endpoint to handle CSV file upload and attack detection
app.post("/predict", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = path.resolve(req.file.path);

    // Log the command being executed
    console.log(`Executing command: python ${__dirname}/process.py ${filePath}`);

    exec(`python ${__dirname}/process.py ${filePath}`, (error, stdout) => {
        if (error) {
            console.error("Execution Error:", error);
            console.error("Stderr:", stderr); // Log standard error
            return res.status(500).json({ error: stderr.trim() || error.message });
        }

        console.log("Stdout:", stdout); // Log standard output

        try {
            const result = JSON.parse(stdout.trim());
            res.json(result);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw Output:", stdout); // Log raw output for debugging
            res.status(500).json({ error: "Invalid JSON response from Python script" });
        }
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
