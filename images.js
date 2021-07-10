const axios = require('axios');
const sharp = require('sharp');
// get an image from a url using axios with buffer responsetype
// flip the image vertically using the sharp module
// create a png file from the image
// return the png buffer
// use promise to handle the async
function flip(url) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => {
      const buffer = response.data;
      const img = sharp(buffer);
      img.flip().toBuffer('png', (err, data, info) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    })
    .catch(err => {
      reject(err);
    });
  });
}

module.exports = {
  flip
};