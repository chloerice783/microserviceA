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

