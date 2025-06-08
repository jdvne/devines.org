import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import styles from './Home.module.css';

// TODO: "accountability" page to track my goals and progress in life
// TODO: rename "blog" to "thoughts"
// TODO: migrate from "github-pages" to GitHub Actions for deployment

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
            <span className={styles.operator}>()=&gt;&#8201;</span>
            <span className={styles.tag}>&lt;&gt;</span>
            joshua
            <span className={styles.error}>
              <span className={styles.lt}>&lt;</span>
              de
              <span className={styles.gt}>&gt;</span>
            </span>
            ine
            <span className={styles.tag}>&lt;/&gt;;</span>
          </a>
        </h1>
        <div>
          <nav className={styles.nav}>
            <Link to="/blog" className={styles.navLink}>
              <span className={styles.tag}>&lt;</span>
              thoughts
              <span className={styles.tag}>/&gt;</span>
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
