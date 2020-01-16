const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const IBMCloudEnv = require('ibm-cloud-env');
IBMCloudEnv.init();

const visualRecognition = new VisualRecognitionV3({
  iam_apikey: IBMCloudEnv.getString('watson_visual_recognition_apikey'),
  url: IBMCloudEnv.getString('watson_visual_recognition_url'),
  version: '2018-03-19',
});

module.exports = {
  getVisualRecognitionV3: () => visualRecognition,
}