const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

app.use('/', (req, res) => {
  return res.json('Welcome to dojolog')
});

app.listen(PORT, () => {
  console.info(`Server up and running on port ${PORT}`);
});