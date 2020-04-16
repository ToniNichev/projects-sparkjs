import React from 'react';
import express from 'express';
import fetch from 'isomorphic-fetch';
import App from './src/components/App';
import Loadable from 'react-loadable';
import manifest from './dist/loadable-manifest.json';
import { getBundles } from 'react-loadable/webpack';
import ReactDOMServer from 'react-dom/server';
import PageData from './src/containers/PageLayout/PageData'; 
import templateList from './src/templates/TemplateList';

const {APP_HOST, SERVER_PORT} = process.env;

const app = express();

app.use('/server-build', express.static('./server-build'));
app.use('/dist', express.static('dist')); // to serve frontent prod static files
app.use('/favicon.ico', express.static('./static-assets/favicon.ico'));

function response(req, res, apiData, templateName) {
  const Html = templateList[templateName];
  // Prepare to get list of all modules that have to be loaded for this route
  let modules = [];
  ReactDOMServer.renderToString(
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      <App req={req} />
    </Loadable.Capture>
  );

  const HTML_content = ReactDOMServer.renderToString(<App req={req} />);
  // Extract CSS and JS bundles
  const bundles = getBundles(manifest, modules); 
  const cssBundles = bundles.filter(bundle => bundle && bundle.file.split('.').pop() === 'css');
  const jsBundles = bundles.filter(bundle => bundle && bundle.file.split('.').pop() === 'js');

  // console.log(">>>manifest>>>", manifest);
  // console.log(">>cssBundles>>", cssBundles);

  const html = <Html content={HTML_content} cssBundles={cssBundles} jsBundles={jsBundles} apiData={apiData}/>;

  res.status(200);
  res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`);
  res.end();
}


app.get('/*', (req, res) => {   
  fetch('https://learnappmaking.com/ex/users.json')
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
    response(req, res, apiData, templateName);
  });  
});

Loadable.preloadAll().then(() => {
  app.listen(SERVER_PORT, () => {
    console.log(`😎 Server is listening on port ${SERVER_PORT}`);
  });
});