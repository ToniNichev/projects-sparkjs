import React, { Component } from 'react';
import ComponentList from './ComponentList';
import PageData from './PageData';
const styles = require('./styles.scss');
class PageLayout extends Component {
    constructor(props) {
      super(props);      
    } 
  
    render() {
      const url = this.props.location.pathname;
      const page = PageData[url];

      const allLayout = page.layout.map((layoutList) => {
        const layout = layoutList.components.map((component, id , components) => {
          const componentName = component.name;    
          const props = component.props;    
          const ChildComponent = ComponentList[componentName];
          if(typeof ChildComponent === 'undefined') {
            return(
              <div key='{id}' className={styles.error}>Can't find {componentName} component!</div>
            );
          }
          return (
              <ChildComponent key={componentName} props={props} />
          );
        });
        return layout;
      });
      return(
        <div className={styles.app}>
          {allLayout}
        </div>
      );
    }
}
export default PageLayout;
