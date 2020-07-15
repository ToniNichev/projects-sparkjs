import PageData from '../src/containers/PageLayout/PageData'; 

function requestDataFromAPI(req, res, next) {
// example of getting backend data from API
  fetch('http://www.toni-develops.com/external-files/examples/sample-apis/sparkjs.json')
  .then(function(response) {
      if (response.status >= 400) {
          throw new Error("Bad response from server");
      }
      return response.json();
  })
  .then(function(apiData) {
    apiData = {
      featureFlags: apiData.featureFlags,
      home: apiData.users,
      about: {
        userName : "Test",
        whichComponent : false
      }
    }
    // find the template for this page
    req.templateName = PageData[req.url].template;    
    req.apiData = apiData;
    next(); // continue once the data is available.
  }); 
}

export default requestDataFromAPI;