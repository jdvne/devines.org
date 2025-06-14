import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
import styles from './Recipe.module.css';


// Provide Buffer globally for gray-matter
window.Buffer = Buffer;

export function Recipe() {
    const [content, setContent] = useState('');
    const [metadata, setMetadata] = useState(null);
    const { recipeName } = useParams();

    const components = useMemo(() => ({
        img: ({ src, alt }) => {
            try {
                const imgSrc = new URL(src, import.meta.url).href;
                return <img src={imgSrc} alt={alt} />;
            } catch {
                return <img src={src} alt={alt} />;
            }
        },
        code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        }
    }), []);

    useEffect(() => {
        import(`../recipes/${recipeName}.md`)
            .then(res => fetch(res.default))
            .then(response => response.text())
            .then(text => {
                const { data, content } = matter(text);
                setMetadata(data);
                setContent(content);
            })
            .catch(err => console.error('Error fetching post:', err));
    }, [recipeName]);

    return (
        <div className={styles.recipePage}>
            <div className={styles.recipeContainer}>
                <Helmet>
                    <title>{metadata?.title || 'Recipe'}</title>
                    <meta property="og:title" content={metadata?.title || 'Recipe'} />
                    <meta property="og:description" content={metadata?.description || ''} />
                    <meta property="og:image" content={metadata?.image || "/assets/images/nyc.jpg"} />
                    <meta property="og:type" content="article" />
                    <meta name="twitter:card" content="summary_large_image" />
                </Helmet>
                <a href="/cookbook" className={styles.recipeBackLink}>Back to Cookbook</a>
                <h1 className={styles.recipeTitle}>
                    {metadata?.title || 'Recipe'}
                </h1>
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
                        <Markdown 
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={components}
                        >
                            {content}
                        </Markdown>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Recipe;
