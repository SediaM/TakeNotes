const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('./helpers/fsUtils');

const app = express();
const dbData = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const fs = require('fs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // GET request for reviews
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json'));
  console.log(notes);
  return res.json(notes);
})

// POST request for reviews
app.post('/api/notes', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((note) => note.note_id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);