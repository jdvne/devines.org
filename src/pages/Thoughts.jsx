import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Thoughts.module.css';
import { Breadcrumb } from '../components/Breadcrumb';

export function Thoughts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Get all thoughts markdown files
        const blogModules = import.meta.glob('../thoughts/*.md');
        
        Promise.all(
            Object.entries(blogModules).map(async ([path, loader]) => {
                const content = await loader();
                const response = await fetch(content.default);
                const text = await response.text();
                
                // Extract metadata from frontmatter
                const [, frontmatter = '', markdown = ''] = text.split('---\n');
                const metadata = Object.fromEntries(
                    frontmatter.split('\n')
                        .filter(line => line.includes(': '))
                        .map(line => {
                            const [key, ...valueParts] = line.split(': ');
                            return [key, valueParts.join(': ')];
                        })
                );
                
                // Get filename without extension for slug
                const slug = path.split('/').pop().replace('.md', '');
                
                return {
                    ...metadata,
                    slug,
                    content: markdown.trim()
                };
            })
        ).then(posts => {
            // Sort posts by date, newest first
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            setPosts(posts);
        });
    }, []);

    return (
        <div id={styles.main}>
            <div className={styles.blogContainer}>
                <Breadcrumb items={[
                    { path: '/thoughts', label: 'thoughts' }
                ]} />
                <div className={styles.postsList}>
                {posts.map(post => (
                    <article key={post.slug} className={styles.postSummary}>
                        <h2>
                            <Link to={`/thoughts/${post.slug}`}>
                                {post.title}
                            </Link>
                        </h2>
                        <div className={styles.postMeta}>
                            {new Date(post.date).toLocaleDateString()}
                        </div>
                        <p style={{ color: '#d4d4d4' }}>{post.description}</p>
                        <Link to={`/thoughts/${post.slug}`} className={styles.readMore}>
                            Read more →
                        </Link>
                    </article>
                ))}
                </div>
            </div>
        </div>
    );
}

export default Thoughts;
