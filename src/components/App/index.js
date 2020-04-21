import React from 'react';
import { BrowserRouter as Router, StaticRouter, Route, Switch } from 'react-router-dom';
import PageLayout from '../../containers/PageLayout';
import styles from './styles.scss';


const client = (props) => ( 
  <Router>
    <Switch>
      <Route exact path="*" render={(props) => <PageLayout {...props} />} />
    </Switch>
  </Router>
);

const context = {};

const server = (props) => {
 return (
  <StaticRouter location={ props.url } context={context}>
    <Switch>
      <Route exact path="*" render={(props) => <PageLayout {...props} />} />  
    </Switch>            
  </StaticRouter>
);
}

export default ( {req} ) => (
  <div className={styles.appWrapper}>
    {typeof window == 'undefined' ? server(req) :client(req)}
  </div>   
)
