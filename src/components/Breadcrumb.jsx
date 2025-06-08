import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Breadcrumb.module.css';

export function Breadcrumb({ path }) {
  return (
    <h1 className={styles.breadcrumb}>
      <Link to="/" className={styles.link}>
        <span className={styles.keyword}>return</span>
        <span className={styles.tag}>&lt;</span>
        home
        <span className={styles.tag}>/&gt;</span>
      </Link>
      {path && (
        <>
          <span className={styles.operator}>.</span>
          <Link to="/blog" className={styles.link}>
            thoughts
          </Link>
          <span className={styles.operator}>.</span>
          <span className={styles.method}>{path}</span>
          <span className={styles.parens}>()</span>
          <span className={styles.operator}>;</span>
        </>
      )}
    </h1>
  );
}

Breadcrumb.propTypes = {
  path: PropTypes.string
};
