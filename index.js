'use strict';

const express = require('express');
const cors = require('cors');
const app = express();

let categories = ['funnyJoke', 'lameJoke'];

let funnyJoke = [

  {

    'joke': 'Dlaczego komputer poszedł do lekarza?',

    'response': 'Bo złapał wirusa!'

  },

  {

    'joke': 'Dlaczego komputer nie może być głodny?',

    'response': 'Bo ma pełen dysk!'

  },

  {

    'joke': 'Co mówi jeden bit do drugiego?',

    'response': '„Trzymaj się, zaraz się przestawiamy!”'

  }

];

let lameJoke = [

  {

    'joke': 'Dlaczego programiści preferują noc?',

    'response': 'Bo w nocy jest mniej bugów do łapania!'

  },

  {

    'joke': 'Jak nazywa się bardzo szybki programista?',

    'response': 'Błyskawiczny kompilator!'

  }

];
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.post('/jokebook/joke/new', (req, res) => {
  const { category, joke, response } = req.body;
  
  if (!category || !joke || !response) {
    return res.status(400).json({ error: 'Missing required fields: category, joke, response' });
  }
  
  if (!categories.includes(category)) {
    return res.status(400).json({ error: `Category '${category}' does not exist` });
  }
  
  const newJoke = { joke, response };
  
  switch(category) {
    case 'funnyJoke':
      funnyJoke.push(newJoke);
      break;
    case 'lameJoke':
      lameJoke.push(newJoke);
      break;
    default:
      return res.status(400).json({ error: `Category '${category}' not supported` });
  }
  
  res.json({ 
    message: 'Joke added successfully',
    joke: newJoke,
    category: category
  });
});

// ZAD 2
app.get('/jokebook/categories', (req, res) => {
  res.json(categories);
});

app.get('/jokebook/joke/:category', (req, res) => {
  const category = req.params.category;
  
  if (!categories.includes(category)) {
    return res.status(400).json({ error: `no jokes for category ${category}` });
  }
  
  let jokes;
  switch(category) {
    case 'funnyJoke':
      jokes = funnyJoke;
      break;
    case 'lameJoke':
      jokes = lameJoke;
      break;
    default:
      jokes = [];
  }
  
  if (jokes.length === 0) {
    return res.status(400).json({ error: `no jokes for category ${category}` });
  }
  
  const randomIndex = Math.floor(Math.random() * jokes.length);
  const randomJoke = jokes[randomIndex];
  
  res.json(randomJoke);
});

// define endpoint for exercise 1 here
app.get('/math/circle/:r', (req, res) => {
  //TODO1  
  const r = parseFloat(req.params.r);
  
  if (isNaN(r) || r <= 0) {
    return res.status(400).json({error: 'Promień musi być dodatnią liczbą'});
  }
  
  const area = (Math.PI * r * r).toFixed(2);
  const circumference = (2 * Math.PI * r).toFixed(2);
  
  const result = {
    area: area,
    circumference: circumference
  };
  
  res.json(result);
});

//TODO2
app.get('/math/rectangle/:width/:height', (req, res) => {
  const width = parseFloat(req.params.width);
  const height = parseFloat(req.params.height);
  
  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    return res.status(400).json({error: 'Szerokość i wysokość muszą być dodatnimi liczbami'});
  }
  
  const area = width * height;
  const perimeter = 2 * (width + height);
  
  const result = {
    area: area,
    perimeter: perimeter
  };
  
  res.json(result);
});

//TODO3
app.get('/math/power/:base/:exponent', (req, res) => {
  const base = parseFloat(req.params.base);
  const exponent = parseFloat(req.params.exponent);
  const root = req.query.root === 'true';
  
  if (isNaN(base) || isNaN(exponent)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  
  const result = Math.pow(base, exponent);
  
  const response = {
    result: result
  };
  
  if (root) {
    if (base < 0) {
      return res.status(400).json({ error: 'Cannot calculate square root of negative number' });
    }
    response.root = Math.sqrt(base);
  }
  
  res.json(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});