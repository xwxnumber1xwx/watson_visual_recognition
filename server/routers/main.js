const fs = require('fs');
const extend = require('extend');
const path = require('path');
const async = require('async');
const uuid = require('uuid');
const os = require('os');
const service = require('../service');

const visualRecognition = service.getVisualRecognitionV3();
const TEN_SECONDS = 10000;

/**
 * Delete the uploaded file once it's recognized
 * @param {Object} readStream Image file
 */
const deleteUploadedFile = readStream =>
  fs.unlink(readStream.path, (e) => {
    if (e) {
      console.log('Error deleting %s: %s', readStream.path, e);
    }
  });

/**
 * Parse a base 64 image and return the extension and buffer
 * @param  {String} imageString The image data as base65 string
 * @return {Object}             { type: String, data: Buffer }
 */
const parseBase64Image = (imageString) => {
  console.log('image_string:', imageString);
  const matches = imageString.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
  const resource = {};

  if (matches.length !== 3) {
    return null;
  }

  resource.type = matches[1] === 'jpeg' ? 'jpg' : matches[1];
  resource.data = new Buffer(matches[2], 'base64');
  return resource;
};

module.exports = (app) => {
  /**
   * Classifies an image
   * @param req.body.url The URL for an image either.
   *                     images/test.jpg or https://example.com/test.jpg
   * @param req.file The image file.
   */
  app.post('/api/classify', app.upload.single('images_file'), (req, res) => {
    console.log('POST /api/classify', req.body);
    const params = {
      url: null,
      images_file: null,
      threshold: 0.5,
      classifier_ids: ['default', 'food'],
    };

    if (req.file) { // file image
      params.images_file = fs.createReadStream(req.file.path);
    } else if (req.body.url && req.body.url.indexOf('/images/samples') === 0) { // local image

      var CLIENT_FOLDER = 'public';
      var isDev = (app.get('env') === 'development');
      if (isDev) {
        // CLIENT_FOLDER = 'views';
      }
      params.images_file = fs.createReadStream(path.join(CLIENT_FOLDER, req.body.url));
    } else if (req.body.image_data) {
      // write the base64 image to a temp file
      const resource = parseBase64Image(req.body.image_data);
      const temp = path.join(os.tmpdir(), `${uuid.v4()}.${resource.type}`);
      fs.writeFileSync(temp, resource.data);
      params.images_file = fs.createReadStream(temp);
    } else if (req.body.url) { // url
      params.url = req.body.url;
    } else { // malformed url
      return res.status(400).json({ error: 'Malformed URL', code: 400 });
    }

    if (params.images_file) {
      delete params.url;
    } else {
      delete params.images_file;
    }
    const methods = ['classify'];
    // run the 3 classifiers asynchronously and combine the results
    async.parallel(methods.map((method) => {
      const fn = visualRecognition[method].bind(visualRecognition, params);
      return async.reflect(async.timeout(fn, TEN_SECONDS));
    }), (err, results) => {
      // delete the recognized file
      if (params.images_file && !req.body.url) {
        deleteUploadedFile(params.images_file);
      }

      if (err) {
        console.log(err);
        return res.status(err.code || 500).json(err);
      }
      // combine the results
      const combine = results.map((result) => {
        if (result.value && result.value.length) {
          // value is an array of arguments passed to the callback (excluding the error).
          // In this case, it's the result and then the request object.
          // We only want the result.
          result.value = result.value[0];
        }
        return result;
      }).reduce((prev, cur) => extend(true, prev, cur));

      res.json(combine.value);
    });
  });
};
