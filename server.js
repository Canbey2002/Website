const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 49;

// Serve static files
app.use(express.static('public'));

// Simulated sensor data from JSON file
let sensorIndex = 0;
const testData = JSON.parse(fs.readFileSync('./test-data.json', 'utf8'));

// API endpoint to fetch simulated sensor data
app.get('/api/sensors', (req, res) => {
    const currentData = testData[sensorIndex];
    sensorIndex = (sensorIndex + 1) % testData.length; // Loop through data
    res.json(currentData);
});

// API endpoint for intruder detection logic (already included in your logic)
app.get('/api/intruder', (req, res) => {
    res.json({ intruderDetected: false }); // Stub response
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
