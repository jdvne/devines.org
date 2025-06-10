import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import styles from './Home.module.css';

export function NotFound() {
  return (
    <main id={styles.main}>
      <Helmet bodyAttributes={{ class: styles.body }} >
        <title>404 Not Found</title>
      </Helmet>
      <div className={styles.container}>
        <h1>404 Not Found</h1>
        <p>Sorry, the page you are looking for doesn't exist.</p>
        <div>
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>
              <span>{`<home>`}</span>
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
