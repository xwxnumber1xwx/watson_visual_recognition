const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});


require('./routers')(app);

const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log(`The app is listening on http://localhost:${port}`);
});
