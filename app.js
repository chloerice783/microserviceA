// Import dependencies
const express = require('express');
require('dotenv').config(); //Load environment variables from .env
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 9665; // Use PORT from env or default to 9748
const path = require('path');
const fs = require('fs')

app.use(express.json()); //To parse JSON request body
app.use(cors()); // Allow all origins (for now)

//Path to the JSON file
const FILE_PATH = path.join(__dirname, 'hierarchy_objects.json');

//Function to read JSON file
function readJsonFile() {
    try {
        if (!fs.existsSync(FILE_PATH)) {
            fs.writeFileSync(FILE_PATH, JSON.stringify([])); // Create file if it doesn't exist
        }
        const data = fs.readFileSync(FILE_PATH);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return [];
    }
}

//Function to write to JSON file
function writeJsonFile(data) {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 4)); 
    } catch (error) {
        console.error("Error writing JSON file:", error);
    }
}

//API to update the object list
app.post('/fetch-objects', async (req, res) => {
    const { object } = req.body;
    
    if (!object) {
        return res.status(400).json({ error: "Missing object in request body." });
    }

    console.log(`Fetching object: ${object}`);

    let objectsList = readJsonFile();

    //Check if the object already exists
    if (!objectsList.includes(object)) {
        objectsList.push(object);
        writeJsonFile(objectsList);
        return res.json({ message: "Object added.", updatedList: objectsList });
    } else {
        return res.json({ message: "Object already exists.", updatedList: objectsList });
    }
});

//Start the server
app.listen(PORT, () => {
    console.log(`Object service running on port ${PORT}`);
});
