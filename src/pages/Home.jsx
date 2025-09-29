import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import styles from './Home.module.css';
import AnimatedAscii from '../components/AnimatedAscii.jsx';

// Constants
const LESS_THAN = '<';
const GREATER_THAN = '>';
const NON_BREAKING_SPACE = '\u202F';

// Navigation items
const NAV_ITEMS = [
  { label: 'thoughts', path: '/thoughts' },
  { label: 'cookbook', path: '/cookbook' },
  { label: 'coffee', path: '/coffee' },
  { label: 'slots', path: '/slots' }
];

/**
 * Tag component that renders HTML-like tags with opening/closing brackets
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display inside the tag
 * @param {boolean} [props.open=true] - Whether this is an opening tag (true) or closing tag (false)
 */
const Tag = ({ children, open = true }) => {
  return (
    <span className={styles.tag}>
      {LESS_THAN}{children}{open ? "" : "/"}{GREATER_THAN}
    </span>
  );
};

Tag.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
};

/**
 * TagLink component that renders a Link with Tag styling
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display inside the tag
 * @param {string} props.to - Route path for the link
 */
const TagLink = ({ children, to }) => {
  return (
    <Link to={to} className={styles.tagLink}>
      <Tag>{children}</Tag>
    </Link>
  );
};

TagLink.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string.isRequired,
};

/**
 * NameDisplay component that renders the stylized "joshua<dev>ine" name
 */
const NameDisplay = () => {
  return (
    <a className={styles.name} href="./">
      <span className={styles.operator}>()={GREATER_THAN}{NON_BREAKING_SPACE}</span>
      <Tag open />
      joshua
      <span className={styles.error}>
        <span className={styles.lt}>{LESS_THAN}</span>
        de
        <span className={styles.gt}>{GREATER_THAN}</span>
      </span>
      ine
      <Tag />
      <span className={styles.tag}>;</span>
    </a>
  );
};

/**
 * Navigation component that renders the site navigation links
 */
const Navigation = () => {
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ label, path }) => (
        <TagLink key={path} to={path}>
          {label}
        </TagLink>
      ))}
    </nav>
  );
};

/**
 * Home page component - the main landing page
 * Features a stylized name display, navigation, and animated ASCII background
 */
export function Home() {
  return (
    <main id={styles.main}>
      <Helmet bodyAttributes={{ class: styles.body }}>
        <title>Joshua Devine</title>
      </Helmet>
      
      <div className={styles.container}>
        <h1>
          <NameDisplay />
        </h1>
        
        <div>
          <Navigation />
        </div>

        {/* Animated ASCII video background */}
        <AnimatedAscii videoName="the_great_wave" loopReverse />
      </div>
    </main>
  );
}
