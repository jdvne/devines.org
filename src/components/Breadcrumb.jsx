import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Breadcrumb.module.css';

export function Breadcrumb({ items }) {
  return (
    <h1 className={styles.breadcrumb}>
      <span className={styles.homeWrapper}>
        <Link to="/" className={styles.link}>devines<span className={styles.operator}>.</span>org</Link>
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
