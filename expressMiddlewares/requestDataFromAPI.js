import PageData from '../src/containers/PageLayout/PageData'; 

function requestDataFromAPI(req, res, next) {
// example of getting backend data from API
  fetch('http://www.toni-develops.com/external-files/examples/sample-apis/users.json')
  .then(function(response) {
      if (response.status >= 400) {
          throw new Error("Bad response from server");
      }
      return response.json();
  })
  .then(function(apiData) {
    apiData = {
      home: apiData,
      about: {
        userName : "Test",
        whichComponent : false
      }
    }
    const templateName = PageData[req.url].template;    
    req.templateName = templateName;
    req.apiData = apiData;
    next(); // continue once the data is available.
  }); 
}

export default requestDataFromAPI;