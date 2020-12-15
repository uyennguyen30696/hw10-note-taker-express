const express = require("express");
const path = require("path");
const fs = require("fs");

var data = fs.readFileSync(__dirname + "/db/db.json", "utf8");
var dataObj = JSON.parse(data);

var app = express();
var PORT = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// This links ccs file and js file (static)
app.use(express.static(path.join(__dirname, "/public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// Read the `db.json` file and return all saved notes as JSON
app.get("/api/notes", (req, res) => {
    res.json(dataObj);
});

// Receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client
app.post("/api/notes", (req, res) => {
    let newNotes = req.body;
    newNotes.id = dataObj.length;
    dataObj.push(newNotes);
    console.log("New note: ");
    console.log(dataObj);

    fs.writeFile("db/db.json", JSON.stringify(dataObj),
        (err) => err ? console.log(err) : console.log('New note added successfully!'));

    res.json(dataObj);
}); 

// Receive a query parameter containing the id of a note to delete
app.delete("/api/notes/:id", (req, res) => { 
    let chosenDelete = req.params.id;
    console.log("Deleted: ");
    console.log(chosenDelete);

    dataObj = dataObj.filter(currentNotes => {
        return currentNotes.id != chosenDelete;
    });

    var newId = 0;
    for (currentNotes of dataObj) {
        currentNotes.id = newId;
        newId++;
    };

    console.log("New dataObj in db.json file after chosen deleted: ");
    console.log(dataObj);
    
    fs.writeFile("db/db.json", JSON.stringify(dataObj),
        (err) => err ? console.log(err) : console.log('Deleted chosen note successfully!'));

    res.send(dataObj); 
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

