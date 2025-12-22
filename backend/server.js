// server.js
const express = require('express');

// Inicializuojame Express programą
const app = express();

// Uostas, kuriuo veiks serveris (galite pasirinkti bet kurį, pvz., 5000)
const PORT = process.env.PORT || 5000; 

// Pradinis maršrutas
app.get('/', (req, res) => {
  res.send('Flashcard App Backend veikia!');
});

// Paleidžiame serverį
app.listen(PORT, () => {
  console.log(`Serveris veikia ant porto ${PORT}`);
});