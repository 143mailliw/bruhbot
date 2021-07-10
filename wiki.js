const axios = require('axios');
// get the wiki page using the argument "name" from wikipedia
// using Axios to make the request
// using Promise to handle the response
// and return the data as a json object
function search(name) {
  return new Promise((resolve, reject) => {
    axios.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=&explaintext=&titles=${name}`)
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