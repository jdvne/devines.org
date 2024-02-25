/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

import styles from "./Wedding.module.css";

import expand_more from "../assets/icons/expand_more.svg";
import nyc from "../assets/images/nyc.jpg";
import proposal from "../assets/images/proposal.jpg";
import savannah from "../assets/images/savannah.jpg";

export function Wedding() {
  return (
    <main id={styles.main}>
      <Helmet bodyAttributes={{ class: styles.body }} >
        <title>A Devine Wedding</title>
      </Helmet>

      <ScrollToAnchor />
      <div className={styles.container}>
        <h1>Stephanie & Joshua</h1>
        <WeddingNav />
        {/* TODO: make this more dynamic */}
        <div className={styles.photos}>
          <img src={nyc} alt="Stephanie & Joshua in NYC" />
          <img src={proposal} alt="Stephanie & Joshua's Proposal" />
          <img src={savannah} alt="Stephanie & Joshua in Savannah" />
        </div>
        <h2>
          June 1st, 2024 -{" "}
          <span className={styles.no_wrap}>Silver Hearth Lodge</span>
        </h2>
        <p>
          10231 Sugar Camp Creek Rd
          <br />
          Bent Mountain, VA 24059
        </p>
        <p>Please arrive by 4:00pm to be seated for the ceremony.</p>

        <CollapsibleSection title="Lodging" id="lodging" />

        <CollapsibleSection title="FAQ" id="faq">
          <h4>What should I wear?</h4>
          <div className={styles.card}>
            <p>&gt; Cocktail Attire</p>

            <blockquote>
              A small step above semi-formal, cocktail attire is a balance
              between elegant and comfortable and fancy and pared-back. Instead
              of a floor-length dress, women may opt for a tea-length,
              knee-length, or midi look. Men should wear a suit and tie.
            </blockquote>
          </div>

          <h4>Where do I go/park?</h4>
          <div className={styles.card}>
            <p>&gt; Follow the signs</p>

            <blockquote>
              The venue is located in the mountains, so there is a bit of a
              drive to get there. We will have signs posted along the way to
              help guide you. There is a parking lot at the venue, so you
              won&apos;t have to worry about parking.
            </blockquote>

            <iframe
              className={styles.map}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5328.388867918014!2d-80.09943762283783!3d37.16114844726785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x884d758af048ac67%3A0x4709c36b55e56fbd!2sSilver%20Hearth%20Lodge!5e1!3m2!1sen!2sus!4v1705777048739!5m2!1sen!2sus"
              width="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <h4>Who can I bring?</h4>
          <div className={styles.card}>
            <p>&gt; Only those written on your invite</p>

            <blockquote>
              To maximize the presence of our loved ones, we kindly ask that
              only those listed on the invitation attend.
            </blockquote>

            <p>&gt; No children</p>
            <blockquote>
              Due to limitations set by the venue, we are unable to accommodate
              children at our wedding. Please enjoy an adults-only ceremony and
              reception.
            </blockquote>

            <p>&gt; No pets</p>
            <blockquote>
              Although we love all of our furry friends, animals are not allowed
              at the venue.
            </blockquote>
          </div>

          <h4>What food options will there be?</h4>
          <div className={styles.card}>
            <p>&gt; BBQ, buffet style!</p>

            <blockquote>
              <ul>
                <li></li>
              </ul>
            </blockquote>

            <p>
              Please let us know when you RSVP if you have any strict dietary
              restrictions the caterer should be made aware of. We&apos;re happy
              to accommodate!
            </p>
          </div>

          <h4>What are the plans for bad weather?</h4>
          <div className={styles.card}>
            <p>&gt; The venue has an indoor option</p>

            <blockquote>
              We will be able to have the ceremony and reception there
              regardless of the weather.
            </blockquote>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Meet the Bridal Party" id="party">
          <Partier
            name={
              <>
                Stephanie Valencic<span className={styles.pencil}>‸Devine</span>
              </>
            }
            role="Bride"
            bio="TODO"
            image="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
          />
          <Partier
            name="Anouk Rudd"
            role="Maid of Honor"
            bio="Anouk is from Floyd, Virginia. Stephanie and Anouk met in 2018 at Governor’s School in Pulaski, Virginia. Since then, they have been inseparable and always make time to grab a latte and a not-so-quick shopping trip."
            image="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
            quote="insert quote here"
          />
          <Partier
            name="Kaity McCullough"
            role="Bridesmaid"
            bio="Kaity is from Powhatan, Virginia, but currently lives in Colorado Springs, Colorado. Stephanie and Kaity met in 2020 in the Virginia Tech Corps of Cadets. While they only lived together for a year, they were in each other’s rooms enough that you would never know."
            image="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
            quote="insert quote here"
          />
          <Partier
            name="Julia Moschella"
            role="Bridesmaid"
            bio="Julia is from Christiansburg, Virginia, but currently lives in Charlottesville, Virginia, completing her Master’s degree at UVA. Stephanie and Julia met in middle school through band, soccer, basketball, and probably everything else."
            image="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
            quote="insert quote here"
          />
          <Partier
            name="Lindsey Devine"
            role="Bridesmaid"
            bio="Lindsey is from Morganton, North Carolina. She is the second youngest of the Devine siblings and the only girl."
            image="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
            quote="insert quote here"
          />
          <Partier
            name="Joshua Devine"
            role="Groom"
            bio="TODO"
            image="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
            right
          />
          <Partier
            name="Ian Switzer"
            role="Best Man"
            bio="TODO"
            image="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
            quote="insert quote here"
            right
          />
          <Partier
            name="Jared Arnold"
            role="Groomsman"
            bio="Jarold is ... TODO"
            image="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
            quote="insert quote here"
            right
          />
          <Partier
            name="Joseph Banks"
            role="Groomsman"
            bio="TODO"
            image="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
            quote="insert quote here"
            right
          />
          <Partier
            name="Noah Devine"
            role="Groomsman"
            bio="TODO"
            image="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
            quote="insert quote here"
            right
          />
        </CollapsibleSection>

        <CollapsibleSection title="Vendor Information" id="vendors">
          <div className={styles.card}>
            <Vendor
              role="Band"
              name="Midnight Blue"
              url="https://midnightblue.band/"
            />

            <Vendor
              role="Photographer"
              name="Rebecca Lynn Photography"
              url="https://rebeccalynnphotog.mypixieset.com/"
            />

            <Vendor role="Catering" name="Christian Catering" url="" />

            <Vendor
              role="Coordinator"
              name="Married by Merriman"
              url="https://marriedbymerriman.wixsite.com/mysite"
            />

            <Vendor
              role="Officiant"
              name={
                <>
                  Gary McCoy,{" "}
                  <span className={styles.church}>
                    Blacksburg Christian Church
                  </span>
                </>
              }
              url="https://www.blacksburgchristian.org/"
            />

            <Vendor
              role="Venue"
              name="Silver Hearth Lodge"
              url="https://www.silverhearthlodge.com/"
            />
          </div>
        </CollapsibleSection>
      </div>
    </main>
  );
}

export function RSVP() {
  return (
    <main id={styles.main}>
      <Helmet bodyAttributes={{ class: styles.body }} >
        <title>A Devine Wedding</title>
      </Helmet>

      <div className={styles.container}>
        <h1>Stephanie & Joshua</h1>
        <WeddingNav />

        <div>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfclalK_QuxLKod2JKHc86idcQ7pxF7iLqoVkFOoZIJRuFyfA/viewform?embedded=true"
            height="1000"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className={styles.rsvp}
          >
            RSVP Form is Loading…
          </iframe>
        </div>
      </div>
    </main>
  );
}

function WeddingNav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/wedding#lodging">Lodging</Link>
        </li>
        <li>
          <Link to="/wedding#faq">FAQ</Link>
        </li>
        <li>
          <Link to="/wedding#party">Bridal Party</Link>
        </li>
        <li>Pictures</li>
        <li>Registry</li>
        <li>
          <Link to="/rsvp">RSVP</Link>
        </li>
      </ul>
    </nav>
  );
}

function CollapsibleSection({ title, id, children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <hr />
      <h3
        className={styles.collapse_title}
        id={id}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <img
          className={
            styles.collapse_icon +
            (isCollapsed ? " " + styles.collapse_icon_collapsed : "")
          }
          src={expand_more}
          alt=""
        />
        {title}
      </h3>
      <div className={isCollapsed ? styles.collapsed : ""}>{children}</div>
    </>
  );
}

function Partier({ name, role, bio, image, right, quote }) {
  return (
    <div className={styles.partier + (right ? " " + styles.partier_right : "")}>
      <div className={styles.profile}>
        <img src={image} alt={name} />
        <h4>{name}</h4>
        <h5>{role}</h5>
      </div>
      <div className={styles.bio}>
        <p>{bio}</p>
        {quote && <blockquote>&quot;{quote}&quot;</blockquote>}
      </div>
    </div>
  );
}

function Vendor({ role, name, url }) {
  return (
    <div className={styles.vendor}>
      <h4 className={styles.left}>{role}</h4>
      <div className={styles.dotted_line} />
      <Link to={url}>{name}</Link>
    </div>
  );
}

function ScrollToAnchor() {
  const location = useLocation();
  const lastHash = useRef("");

  // listen to location change using useEffect with location as dependency
  // https://jasonwatmore.com/react-router-v6-listen-to-location-route-change-without-history-listen
  useEffect(() => {
    if (location.hash) {
      lastHash.current = location.hash.slice(1); // safe hash for further use after navigation
    }

    if (lastHash.current && document.getElementById(lastHash.current)) {
      setTimeout(() => {
        document
          .getElementById(lastHash.current)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        lastHash.current = "";
      }, 100);
    }
  }, [location]);

  return null;
}

export default Wedding;
