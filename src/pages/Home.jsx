import styles from './Home.module.css';

function Home() {
  return (
    <div>
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
  );
}

export default Home;