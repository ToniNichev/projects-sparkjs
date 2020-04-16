import React, { Component, useEffect, useState } from 'react';
import styles from './styles.scss';

const data = typeof window == 'undefined' ? 'no data on server side' : __API_DATA__.about;

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
  }

  let componentA = (<p>This is <input type="text" name="username" value={user} onChange={(obj) => { handleChange(obj) }} /></p>);
  let componentB = (<p>Another component</p>)
  return (
    <div className={styles.wrapper}>
      {!which ? componentA : componentB}
      <button onClick={ () => {switchComponents() } }>TEST</button>
    </div>
  );

}

export default AboutContainer;
