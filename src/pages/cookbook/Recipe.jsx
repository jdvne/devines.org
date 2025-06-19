import matter from 'gray-matter';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';

import styles from './Cookbook.module.css';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';

export function Recipe() {
  const { recipeName } = useParams();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await import(`./posts/${recipeName}.md`);
        const response = await fetch(res.default);
        const text = await response.text();
        const { data, content } = matter(text);

        setMetadata(data);
        setContent(content);
      } catch (err) {
        console.error('Error fetching recipe:', err);
      }
    };

    fetchRecipe();
  }, [recipeName]);

  return (
    <div className={styles.recipePage}>
      <div className={styles.recipeContainer}>
        <Helmet bodyAttributes={{ class: styles.body }}>
          <title>{metadata?.title || 'Recipe'}</title>
          <meta property="og:title" content={metadata?.title || 'Recipe'} />
          <meta property="og:description" content={metadata?.description || ''} />
          <meta property="og:image" content={metadata?.image || "/assets/images/nyc.jpg"} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
        <div className={styles.recipeTitleContainer}>
          <h1 className={styles.recipeTitle}>
            {metadata?.title || 'Recipe'}
          </h1>
          <Link to="/cookbook" className={styles.recipeBackLink}>Back to Cookbook</Link>
        </div>
        <div className={styles.recipeHorizontalBar}></div>
        {metadata && (
          <div className={styles.recipeContent}>
            <h2 className={styles.recipeMetadataTitle}>Recipe Details</h2>
            {metadata.preparationTime && (
              <p className={styles.recipeCategoriesTitle}>
                <span className={styles.recipeMetadataLabel}>Preparation Time:</span> {metadata.preparationTime}
              </p>
            )}
            {metadata.cookTime && (
              <p className={styles.recipeCategoriesTitle}>
                <span className={styles.recipeMetadataLabel}>Cook Time:</span> {metadata.cookTime}
              </p>
            )}
            {metadata.cookTemperature && (
              <p className={styles.recipeCategoriesTitle}>
                <span className={styles.recipeMetadataLabel}>Cook Temperature:</span> {metadata.cookTemperature}
              </p>
            )}
            {metadata.totalTime && (
              <p className={styles.recipeCategoriesTitle}>
                <span className={styles.recipeMetadataLabel}>Total Time:</span> {metadata.totalTime}
              </p>
            )}
          </div>
        )}
        <ul className={styles.recipeList}>
          <li key={recipeName} className={styles.recipeListItem}>
            <MarkdownRenderer
              content={content}
              recipeName={recipeName}
              useLocalStorage={true}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
