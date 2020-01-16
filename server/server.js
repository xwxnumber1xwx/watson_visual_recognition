const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());
require('./routers')(app);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log(`The app is listening on http://localhost:${port}`);
});
