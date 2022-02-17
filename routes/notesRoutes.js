const notes = require("express").Router();
const { readFromFile, readAndAppend, writeToFile } = require("../helpers/fsUtils")
const { v4: uuidv4 } = require("uuid");

notes.get("/", (req, res) => {
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
});

notes.post("/", (req, res) => {
    console.log(req.body)
    const { title, text } = req.body;

    if(req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, "./db/db.json");
        res.json("New note added successfully!");
    } else {
        res.error("Error in adding new note")
    }
});

notes.delete("/:id", (req, res) => {
    let noteID = req.params.id;
    readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
        const result = json.filter((note) => note.id !== noteID);

        writeToFile("./db/db.json", result);

        res.json(`Note ${noteID} has been deleted`);
    });
});

module.exports = notes;