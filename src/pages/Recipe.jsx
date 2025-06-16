import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import matter from 'gray-matter';
import styles from './Cookbook.module.css';
import { MarkdownRenderer } from '../components/MarkdownRenderer'; // Import the new component

export function Recipe() {
    const { recipeName } = useParams();
    const [content, setContent] = useState('');
    const [metadata, setMetadata] = useState(null);

    const loadChecklistState = useCallback(() => {
        const savedState = localStorage.getItem(`checklistState_${recipeName}`);
        return savedState ? JSON.parse(savedState) : {};
    }, [recipeName]);

    const saveChecklistState = useCallback((checklistState) => {
        localStorage.setItem(`checklistState_${recipeName}`, JSON.stringify(checklistState));
    }, [recipeName]);

    const handleCheckboxChange = useCallback((index, checked) => {
        const updatedState = { ...loadChecklistState(), [index]: checked };
        saveChecklistState(updatedState);
    }, [loadChecklistState, saveChecklistState]);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await import(`../content/recipes/${recipeName}.md`);
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

    useEffect(() => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const initialState = loadChecklistState();

        checkboxes.forEach((checkbox, index) => {
            checkbox.disabled = false;
            checkbox.checked = initialState[index] || false;

            const listItem = checkbox.closest("li.task-list-item");
            if (listItem) {
                listItem.style.textDecoration = checkbox.checked ? "line-through" : "none";
            }

            checkbox.addEventListener("change", function () {
                const isChecked = this.checked;
                const listItem = this.closest("li.task-list-item");
                if (listItem) {
                    listItem.style.textDecoration = isChecked ? "line-through" : "none";
                }
                handleCheckboxChange(index, isChecked);
            });
        });

        // Cleanup function to remove event listeners
        return () => {
            checkboxes.forEach(checkbox => {
                checkbox.removeEventListener("change", () => { });
            });
        };
    }, [content, loadChecklistState, handleCheckboxChange]);

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
                        <MarkdownRenderer content={content} /> {/* Use the new component */}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Recipe;
