const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const os = require('os');

module.exports = (app) => {

  var CLIENT_FOLDER = '../../public';
  var isDev = (app.get('env') === 'development');
  console.log('app.get(env)', app.get('env'));
  if (isDev) {
    // CLIENT_FOLDER = '../../views';
  }
  // prevent page not found Error

  app.get('/public/', function (req, res) {
    res.sendFile(path.join(__dirname, CLIENT_FOLDER, req.params[0]), function (err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })

  app.get('/js/', function (req, res) {
    res.sendFile(path.join(__dirname, CLIENT_FOLDER, req.params[0]), function (err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })
  app.get('/icon/', function (req, res) {
    res.sendFile(path.join(__dirname, CLIENT_FOLDER, req.params[0]), function (err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })

  app.get('/images/', function (req, res) {
    res.sendFile(path.join(__dirname, CLIENT_FOLDER, req.params[0]), function (err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })

  // serves all the static files
  app.get(/^(.+)$/, function (req, res, next) {
    // Localhost
    res.sendfile(path.join(__dirname, CLIENT_FOLDER, req.params[0]));
  });

  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, CLIENT_FOLDER + '/index.html'), function (err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })


  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10mb',
  }));
  app.use(bodyParser.json({
    limit: '10mb',
  }));
  // Setup static public directory
  app.use(express.static(path.join(__dirname, CLIENT_FOLDER)));

  // Setup the upload mechanism
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, os.tmpdir()),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });

  const upload = multer({ storage });
  app.upload = upload;
};