import { Helmet } from "react-helmet";

import styles from './Coffee.module.css';
import coffeeData from './coffee.yml';

const ROAST_STYLES = {
  Light: `${styles.roastChip} ${styles.lightRoast}`,
  Medium: `${styles.roastChip} ${styles.mediumRoast}`,
  'Medium Dark': `${styles.roastChip} ${styles.mediumRoast}`,
  Dark: `${styles.roastChip} ${styles.darkRoast}`,
};

const PURPOSE_EMOJIS = {
  Espresso: '☕️',
  Drip: '💧',
  FrenchPress: '🇫🇷',
  'Cold Brew': '🧊',
};

export function Coffee() {
  const getChipStyle = (type, value) => {
    if (type === 'roast') {
      return ROAST_STYLES[value] || styles.roastChip;
    } else if (type === 'purpose') {
      return PURPOSE_EMOJIS[value] || '';
    }
    return '';
  };

  return (
    <div className={styles.coffeePage}>
      <Helmet bodyAttributes={{ class: styles.body }} />
      <div className={styles.coffeeContainer}>
        <h1 className={styles.coffeeTitle}>Coffee</h1>
        <div className={styles.coffeeHorizontalBar}></div>
        {coffeeData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Roast</th>
                <th>Purpose</th>
                <th>Grind Notch</th>
                <th>Grams</th>
                <th>Thoughts</th>
              </tr>
            </thead>
            <tbody>
              {coffeeData.map((coffee, index) => (
                <tr key={index}>
                  <td>{coffee.name}</td>
                  <td>{coffee.brand}</td>
                  <td>
                    <span className={`${styles.chip} ${getChipStyle('roast', coffee.roast)}`}>{coffee.roast}</span>
                  </td>
                  <td>
                    <span className={`${styles.chip} ${styles.purposeChip}`} data-emoji={getChipStyle('purpose', coffee.purpose)}>{coffee.purpose}</span>
                  </td>
                  <td>{coffee.grind_notch}</td>
                  <td>{coffee.grams}</td>
                  <td>{coffee.thoughts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No coffee data found.</p>
        )}
      </div>
    </div>
  );
}
