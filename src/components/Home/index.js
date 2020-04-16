import React from 'react';
import styles from './styles.scss';

const Renderer = ({title}) => {
  const names = typeof window == 'undefined' ? 'no data on server side' : __API_DATA__.home.map( (data) => { return data.first_name }).join(',');
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