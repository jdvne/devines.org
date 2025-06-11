import styles from './Contact.module.css';
import { Breadcrumb } from '../components/Breadcrumb';

const lt = '<';
const gt = '>';

function Contact() {
  return (
    <div className={styles.thought}>
      <Breadcrumb crumbs={[{ label: 'Home', path: '/' }, { label: 'Contact' }]} />
      <h1>Contact</h1>
      <p>
        GitHub: <a href="https://github.com/jdvne"><span className={styles.tag}>{lt}</span>github.com/joshua-devine<span className={styles.tag}>{gt}</span></a>
      </p>
      <p>
        LinkedIn: <a href="https://www.linkedin.com/in/jdvne"><span className={styles.tag}>{lt}</span>linkedin.com/in/joshua-devine<span className={styles.tag}>{gt}</span></a>
      </p>
    </div>
  );
}

export default Contact;
