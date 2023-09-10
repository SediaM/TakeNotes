const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');

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
  const notes = JSON.parse(fs.readFileSync('./db/db.json'));
  console.log(req.body);

  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuid,
  };
  notes.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  res.json(notes);
});


app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const notes = JSON.parse(fs.readFileSync('./db/db.json'));
  // Make a new array of all tips except the one with the ID provided in the URL
  const result = notes.filter((note) => { return note.id !== noteId });

  // Save that array to the filesystem
  fs.writeFileSync('./db/db.json', JSON.stringify(result));

  // Respond to the DELETE request
  res.json(result, `Note has been deleted 🗑️`);

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