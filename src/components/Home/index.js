import React from 'react';
import styles from './styles.scss';
import MockAPI from './__mocks__/api-data.json';


const Renderer = ({title}) => {
  const namesArray = typeof global.__API_DATA__ !== 'undefined' ? global.__API_DATA__.home : MockAPI.home;
  const names = namesArray.map( (data) => { return data.first_name }).join(',');
  return (
    <div className={styles.wrapper}>
        <div className={styles.leftRail}>
          <div className={styles.title}>{title}</div>
            <p>{names}</p>
        </div>
        <div className={styles.rightRail}>
          <p>right rail</p>
        </div>

    </div>
  );
}

export default Renderer;