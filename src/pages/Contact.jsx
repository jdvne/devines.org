import styles from './Contact.module.css';
import { Breadcrumb } from '../components/Breadcrumb';

const lt = '<';
const gt = '>';

const github = 'const GitHub = () => '
const linkedin = 'const LinkedIn = () => ';

function Contact() {
  return (
    <div className={styles.contactForm}>
      <Breadcrumb crumbs={[{ label: 'Home', path: '/' }, { label: 'Contact' }]} />
      <h1>Contact</h1>
      <p>
        {github}<a href="https://github.com/jdvne"><span className={styles.contactForm__linkTag}>{lt}a href=</span>github.com/joshua-devine<span className={styles.tag}>/{gt}</span></a>
      </p>
      <p>
        {linkedin}<a href="https://www.linkedin.com/in/jdvne"><span className={styles.contactForm__linkTag}>{lt}a href=</span>linkedin.com/in/joshua-devine<span className={styles.tag}>/{gt}</span></a>
      </p>
    </div>
  );
}

export default Contact;
