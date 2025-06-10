import { Helmet } from "react-helmet";
import { Breadcrumb } from "../components/Breadcrumb";

import styles from './Home.module.css';

export function NotFound() {
  return (
    <main id={styles.main}>
      <Helmet bodyAttributes={{ class: styles.body }} >
        <title>404 Not Found</title>
      </Helmet>
      <div className={styles.container}>
        <h1>404 Not Found</h1>
        <p>Sorry, the page you are looking for doesn&#39;t exist.</p>
        <Breadcrumb />
      </div>
    </main>
  );
}
