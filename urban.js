const config = require('./config.json');
const axios = require('axios');
// get the word from urbandictionary using the word argment
// using Axios to make the request
// using Promise to handle the response
// and return the data as a json object
const search = (word) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://api.urbandictionary.com/v0/define?term=${word}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

module.exports = {
  search
};