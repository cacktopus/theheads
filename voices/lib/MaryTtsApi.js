const axios = require('axios');

// CONSTANTS
const ENDPOINT_MARYTTS = `http://127.0.0.1:59125`;

function processAxiosError(url, error) {
    console.log(`MaryTtsApi->processError: Error processing: ${url}`);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('The request was made and the server responded with a status code that falls out of the range of 2xx. ');

    //   console.log(error.response.data);
      console.log(error.response.status);
    //   console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
    //   console.log(error.request);
        console.log('Error: The request was made but no response was received');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    // console.log(error.config);
    return undefined;
}

module.exports = {

    // Gets voices and returns a promise with the data
    getVoices: () => {
        const url = `${ENDPOINT_MARYTTS}/voices`;

        return axios.get(url)
            .then(function (response) {
                if (response && response.data && response.data.length > 0) {
                    return response.data.split('\n').filter(voice => voice.trim().length > 0);

                } else {
                    return undefined;
                }
            })
            .catch(function (error) {
                return processAxiosError(url, error);
              });
    },

    // Gets voices and returns a promise with the data
    getLocales: () => {
        const url = `${ENDPOINT_MARYTTS}/voices`;

        return axios.get(url)
            .then(function (response) {
                if (response && response.data && response.data.length > 0) {
                    return response.data.split('\n').filter(voice => voice.trim().length > 0);

                } else {
                    return undefined;
                }
            })
            .catch(function (error) {
                return processAxiosError(url, error);
              });
    },

    
}