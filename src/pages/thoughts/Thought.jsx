import matter from 'gray-matter';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

import styles from './Thought.module.css';
import { Breadcrumb } from '../../components/Breadcrumb';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';

export function Thought() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const fetchThought = async () => {
      try {
        const res = await import(`./posts/${slug}.md`);
        const response = await fetch(res.default);
        const text = await response.text();
        const { data, content } = matter(text);

        setMetadata(data);
        setContent(content);
      } catch (err) {
        console.error('Error fetching thought:', err);
      }
    };

    fetchThought();
  }, [slug]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return 'Invalid Date';
    }
  };

  const title = metadata?.title || 'Thought';
  const description = metadata?.description || '';
  const image = metadata?.image || "/assets/images/nyc.jpg";

  return (
    <main id={styles.main}>
      <Helmet bodyAttributes={{ class: styles.body }}>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.title}>
          <Breadcrumb items={[
            { path: '/thoughts', label: 'thoughts' },
            { path: `/thoughts/${slug}`, label: slug }
          ]} />
        </div>
        {metadata && (
          <div className={styles.metadata}>
            <h1>{metadata.title}</h1>
            {metadata.date && (
              <time className={styles.date}>
                {formatDate(metadata.date)}
              </time>
            )}
            {metadata.description && (
              <p className={styles.description}>
                {metadata.description}
              </p>
            )}
          </div>
        )}
        <div className={styles["blog-post"]}>
          <MarkdownRenderer content={content} /> {/* Use the new component */}
        </div>
      </div>
    </main>
  );
}
