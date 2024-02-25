import { Helmet } from "react-helmet";

import styles from './Home.module.css';

function Home() {
  return (
    <main>
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
          <h2 className={styles.comment}>
            &#47;* TODO: let the world know what I&apos;m up to 😳 *&#47;
          </h2>
        </div>
      </div>
    </main>
  );
}

export default Home;