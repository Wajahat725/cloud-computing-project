const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Simple in-memory store for visitor count
let visitorCount = 0;

// Helper to get container ID from /proc/self/cgroup (works inside container)
const getContainerId = () => {
    try {
        const data = fs.readFileSync('/proc/self/cgroup', 'utf8');
        // Find the docker container ID (last part of the line)
        const match = data.match(/\/docker\/([a-f0-9]{64})/);
        if (match && match[1]) return match[1].substring(0, 12); // Return short ID
    } catch (err) {
        console.log("Could not read container ID, maybe running outside container?");
    }
    return "local-dev";
};

app.get('/', (req, res) => {
    visitorCount++;
    const containerId = getContainerId();
    const timestamp = new Date().toISOString();
    
    res.send(`
        <h1>Cloud Computing Project</h1>
        <p><strong>Container ID:</strong> ${containerId}</p>
        <p><strong>Timestamp:</strong> ${timestamp}</p>
        <p><strong>Visitor Count:</strong> ${visitorCount}</p>
        <hr>
        <small>Deployed on Kubernetes via Minikube</small>
    `);
});

// Health check endpoint required by the project
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
