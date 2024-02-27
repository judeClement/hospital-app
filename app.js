///////////////////////////

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const dataFilePath = path.join(__dirname, 'data', 'hospitals.json');

app.use(express.json());

// Read hospitals data
function readData() {
  const rawData = fs.readFileSync(dataFilePath);
  return JSON.parse(rawData);
}

// Write hospitals data
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// GET all hospitals
app.get('/hospitals', (req, res) => {
  const hospitals = readData();
  res.json(hospitals);
});

// GET a single hospital
app.get('/hospitals/:id', (req, res) => {
  const hospitals = readData();
  const hospital = hospitals[req.params.id];
  if (hospital) {
    res.json(hospital);
  } else {
    res.status(404).send('Hospital not found');
  }
});

// POST a new hospital
app.post('/hospitals', (req, res) => {
  const hospitals = readData();
  const newHospital = req.body;
  hospitals.push(newHospital);
  writeData(hospitals);
  res.status(201).send('Hospital added successfully');
});

// PUT update a hospital
app.put('/hospitals/:id', (req, res) => {
  const hospitals = readData();
  const index = req.params.id;
  if (index >= 0 && index < hospitals.length) {
    hospitals[index] = req.body;
    writeData(hospitals);
    res.send('Hospital updated successfully');
  } else {
    res.status(404).send('Hospital not found');
  }
});

// DELETE a hospital
app.delete('/hospitals/:id', (req, res) => {
  const hospitals = readData();
  const index = req.params.id;
  if (index >= 0 && index < hospitals.length) {
    hospitals.splice(index, 1);
    writeData(hospitals);
    res.send('Hospital deleted successfully');
  } else {
    res.status(404).send('Hospital not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//////////////////////
