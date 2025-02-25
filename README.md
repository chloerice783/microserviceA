# microserviceA
dbs class

How to request data from the microservice: 

-Whenever an object is added to the grid, make a call to a function that will make an asynchronous post request. IE:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function fetchObjectHierarchy(draggedObject) {
    let objectName = draggedObject.dataset.name; //gett name of object

    if (!objectName) return; //ensure valid object

    try {
        const response = await fetch('http://localhost:9665/fetch-objects', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ object: objectName }) //send single object
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Updated unique object list:', data);
        
    } catch (error) {
        console.error('Error updating objects:', error);
    }
}

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

How to programmatically RECEIVE data from the microservice 

-In your main server file (IE, app.js, server.js) create a post API to receive the post request. It will
then use two functions: readObjectList() to store the data from the .json list (This json list is used 
to store all the object types currently in the grid to eventually store them in the hierarchy) into a variable
(objectsList) given it is not already in the .json, and  writeObjectList(), which after pushing the object from 
the post request into objectsList, will write the entirety of objectsList back into the .json file. The .json
file will later be sent as a response back to the post request (I ran out of time to implement this part but 
will add it soon.) 

#Note that fs and path must be installed in order to use the rest API microservice like this. I believe
CORS may also be necessary to allow the communication between ports. 

-in your terminal, type: npm install cors fs path
-Then in your server file, include: 
// Import dependencies

const cors = require("cors");
const app = express();
const path = require('path');
const fs = require('fs')

app.use(cors()); // Allow all origins (for now)

//Path to the JSON file
const FILE_PATH = path.join(__dirname, 'hierarchy_objects.json');

-assuming you are using express 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
![MSA drawio](https://github.com/user-attachments/assets/d1275ed7-7939-4da3-b759-e87973105048)

