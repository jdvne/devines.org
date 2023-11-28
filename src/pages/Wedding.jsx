import styles from './Wedding.module.css';

import nyc from '../assets/images/nyc.jpg';
import proposal from '../assets/images/proposal.jpg';
import savannah from '../assets/images/savannah.jpg';

function Wedding() {
  return (
    <main id={styles.main}>
      <div className={styles.container}>
        <h1>Stephanie & Joshua</h1>
        <nav>
          <ul>
            <li>Event Info</li>
            <li>Bridal Party</li>
            <li>Hotels/Housing</li>
            <li>Pictures</li>
            <li>RSVP</li>
            <li>Registry</li>
            <li>FAQ</li>
          </ul>
        </nav>
        <div className={styles.photos}>
          <img src={nyc} alt="Stephanie & Joshua in NYC" />
          <img src={proposal} alt="Stephanie & Joshua's Proposal" />
          <img src={savannah} alt="Stephanie & Joshua in Savannah" />
        </div>
        <h2>June 1st, 2024 - Silver Hearth Lodge</h2>
        <p>
          10231 Sugar Camp Creek Rd<br />
          Bent Mountain, VA 24059
        </p>
        <p>
          Please arrive by 4:00pm to be seated for the ceremony.
        </p>

        <hr />
        <h3 id="details">Meet the Bridal Party</h3>

        <hr />
        <h3 id="details">Hotels / Housing</h3>

        <hr />
        <h3 id="details">FAQ</h3>
        <h4>What should I wear?</h4>
        <div className={styles.answer}>
          <p>&gt; Cocktail Attire</p>

          <blockquote>
            A small step above semi-formal, cocktail attire is a balance 
            between elegant and comfortable and fancy and pared-back. 
            Instead of a floor-length dress, women should opt for a tea-length, 
            knee-length, or midi look. Men should wear a suit and tie.
          </blockquote>
        </div>

        <h4>Where do I go/park?</h4>
        <div className={styles.answer}>
          <p>&gt; Follow the signs</p>

          <blockquote>
            The venue is located in the mountains, so there is a bit of a drive to get there. 
            We will have signs posted along the way to help guide you. 
            There is a parking lot at the venue, so you won't have to worry about parking.
          </blockquote>
        </div>

        <h4>What food options will there be?</h4>
        <div className={styles.answer}>
          <p>&gt; The below menu will be available buffet style.</p>

          <blockquote>
            <ul>
              <li></li>
            </ul>
          </blockquote>

          <p>
            Please let us know when you RSVP if you have any dietary restrictions
            the caterer should be made aware of.  We're happy to accommodate!
          </p>
        </div>

        <h4>What are the plans for bad weather?</h4>
        <div className={styles.answer}>
          <p>&gt; The venue has an indoor option</p>

          <blockquote>
            We will be able to have the ceremony and reception 
            there regardless of the weather.
          </blockquote>
        </div>

        <hr />
        <h3 id="details">Vendor Information</h3>
      </div>
    </main>
  )
}

export default Wedding;