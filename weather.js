const config = require('./config.json');
const axios = require('axios');
// get the weather data from openweathermap.org using the location argument
// using Axios to make the request
// using Promise to handle the response
// and return the data as a json object
const getWeather = (location) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${config.weatherApiKey}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      }); 
  });
};

module.exports = {
  getWeather
};