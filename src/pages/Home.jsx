import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import styles from './Home.module.css';

// TODO: "accountability" page to track my goals and progress in life
// TODO: move images to public assets for easier access

const lt = '<';
const gt = '>';
const space = '\u202F'; // non-breaking space

const Tag = ({ children, open }) => {
  return (
    <span className={styles.tag}>
      {lt}{children}{open ? "" : "/"}{gt}
    </span>
  );
};

Tag.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
};

const TagLink = ({ children, to }) => {
  return (
    <Link to={to} className={styles.tagLink}>
      <Tag>{children}</Tag>
    </Link>
  );
}
TagLink.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string.isRequired,
};

export function Home() {
  return (
    <main id={styles.main}>
      <Helmet bodyAttributes={{ class: styles.body }} >
        <title>Joshua Devine</title>
      </Helmet>
      <div className={styles.container}>
        <h1>
          {/* () => <>joshua<dev>ine</>; */}
          <a className={styles.name} href="./">
            <span className={styles.operator}>()={gt}{space}</span>
            <Tag open/>
            joshua
            <span className={styles.error}>
              <span className={styles.lt}>{lt}</span>
              de
              <span className={styles.gt}>{gt}</span>
            </span>
            ine
            <Tag />
            <span className={styles.tag}>;</span>
          </a>
        </h1>
        <div>
          <nav className={styles.nav}>
            <TagLink to="/thoughts">thoughts</TagLink>
            <TagLink to="/cookbook">cookbook</TagLink>
            <TagLink to="/coffee">coffee</TagLink>
          </nav>
        </div>
      </div>
    </main>
  );
}
