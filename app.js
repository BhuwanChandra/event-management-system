const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
})

app.listen(5000,() => {
  console.log(`Server is running on the port 5000`);  
});

