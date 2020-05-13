import fs from 'fs';
import React from 'react';
import express from 'express';
import https  from 'https';
import fetch from 'isomorphic-fetch';
import App from './src/components/App';
import Loadable from 'react-loadable';
import manifest from './dist/loadable-manifest.json';
import { getBundles } from 'react-loadable/webpack';
import ReactDOMServer from 'react-dom/server';
import templateList from './src/templates/TemplateList';
import cookieParser from 'cookie-parser';
import cookiesManagement from './expressMiddlewares/cookiesManagement';
import requestDataFromAPI from './expressMiddlewares/requestDataFromAPI';

const {APP_HOST, SERVER_PORT, ENVIRONMENT} = process.env;

const app = new express();


app.use(cookieParser());
app.use('/server-build', express.static('./server-build'));
app.use('/dist', express.static('dist')); // to serve frontent prod static files
app.use('/favicon.ico', express.static('./static-assets/favicon.ico'));

function response(req, res, apiData, templateName) {
  // make APP data available for SSR and browser.
  global.__API_DATA__ = apiData;
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


// adding cookie middleware
app.use(cookiesManagement);

app.get('/Robots.txt', (req, res) => {   
  res.send(`
  User-agent: * Disallow: /
  `)
});

app.get('/*', 
  requestDataFromAPI, 
  function (req, res, next) {
   response(req, res, req.apiData, req.templateName);
});

Loadable.preloadAll().then(() => {

  if(ENVIRONMENT == 'development') {
    // use plain http for development
    app.listen(SERVER_PORT, () => {
      console.log(`😎 Server is listening on port ${SERVER_PORT}`);
    });  
  }
  else {
    // we will pass the 'app' to 'https' server
    https.createServer({
      // replace with certificate location
      key: fs.readFileSync('/Users/toninichev/.getssl/toni-develops.com/toni-develops.com.key'),
      cert: fs.readFileSync('/Users/toninichev/.getssl/toni-develops.com/toni-develops.com.crt')
    }, app)
    .listen(SERVER_PORT);
  }



});