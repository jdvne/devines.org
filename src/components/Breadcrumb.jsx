import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Breadcrumb.module.css';

export function Breadcrumb({ items }) {
  return (
    <h1 className={styles.breadcrumb}>
      <span className={styles.returnWrapper}>
        <span className={styles.keyword}>return </span>
        <span className={styles.tag}>&lt;</span>
      </span>
      <span className={styles.homeWrapper}>
        <Link to="/" className={styles.link}>home</Link>
        <span className={styles.tag}>/&gt;</span>
      </span>
      {items?.map((item, index) => (
        <span key={item.path}>
          <span className={styles.operator}>.</span>
          {index === items.length - 1 ? (
            <>
              <span className={styles.method}>{item.label}</span>
              <span className={styles.parens}>()</span>
              <span className={styles.operator}>;</span>
            </>
          ) : (
            <Link to={item.path} className={styles.link}>
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </h1>
  );
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  )
};
