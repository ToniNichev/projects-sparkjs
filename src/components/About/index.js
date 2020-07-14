import React, { Component, useEffect, useState } from 'react';
import styles from './styles.scss';

const data = typeof window == 'undefined' ? 'no data on server side' : __API_DATA__.about;

const options = {
  title: {
    text: 'My chart'
  },
  series: [{
    data: [1, 2, 3]
  }]
}

const AboutContainer = () => {
  const [which, setWhich] = useState(data.whichComponent);
  const [user, userNameChanged] = useState(data.userName);

  function handleChange(obj) {
    document.title = obj.target.value;
    __API_DATA__.about.userName = obj.target.value;
    userNameChanged(obj.target.value);
  }

  function switchComponents() {
    data.whichComponent = !which;
    setWhich(data.whichComponent);
    console.log("This is console log test 1");
  }


  let componentA = (<p>This is <input type="text" name="username" value={user} onChange={(obj) => { handleChange(obj) }} /></p>);
  let componentB = (<p>Another component</p>)  

  return (
    <div className={styles.wrapper}>    
      <div 
        one="1" two="2" three="3" four="4" 
        five="4">!!</div>
      {!which ? componentA : componentB}
      <button onClick={ () => {switchComponents() } }>TEST</button>
    </div>
  );

}

export default AboutContainer;
