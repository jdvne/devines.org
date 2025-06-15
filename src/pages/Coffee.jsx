import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import styles from './Coffee.module.css';
import yaml from 'js-yaml';

export function Coffee() {
  const [coffeeData, setCoffeeData] = useState([]);

  useEffect(() => {
    const fetchCoffeeData = async () => {
      try {
        const response = await fetch('/coffee.yml');
        const text = await response.text();
        const data = yaml.load(text);
        setCoffeeData(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchCoffeeData();
  }, []);

  const getChipStyle = (type, value) => {
    let emoji = '';
    switch (type) {
      case 'roast':
        if (value === 'Light') {
          return `${styles.roastChip} ${styles.lightRoast}`;
        } else if (value === 'Medium') {
          return `${styles.roastChip} ${styles.mediumRoast}`;
        } else if (value === 'Dark') {
          return `${styles.roastChip} ${styles.darkRoast}`;
        } else if (value === 'Medium Dark') {
          return `${styles.roastChip} ${styles.mediumRoast}`;
        }
        return styles.roastChip;
      case 'purpose':
        if (value === 'Espresso') {
          emoji = '☕️';
        } else if (value === 'Drip') {
          emoji = '💧';
        } else if (value === 'FrenchPress') {
          emoji = '🇫🇷';
        } else if (value === 'Cold Brew') {
          emoji = '🧊';
        }
        return `${styles.purposeChip}` + (emoji ? ` style={{ '--emoji': '"' + emoji + '"' }}` : '');
      default:
        return '';
    }
  };

  return (
    <div className={styles.coffeePage}>
      <Helmet bodyAttributes={{ class: styles.body }} />
      <div className={styles.coffeeContainer}>
        <h1 className={styles.coffeeTitle}>Coffee Preferences</h1>
        <div className={styles.coffeeHorizontalBar}></div>
        {coffeeData && coffeeData.length > 0 ? (
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
                    <span className={`${styles.chip} ${getChipStyle('purpose', coffee.purpose)}`}>{coffee.purpose}</span>
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

export default Coffee;
