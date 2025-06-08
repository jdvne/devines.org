import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Blog.module.css';

export function Blog() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Get all blog posts
        const blogModules = import.meta.glob('../blog/posts/*.md');
        
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
                <h1 style={{ color: 'white' }}>Blog Posts</h1>
                <div className={styles.postsList}>
                {posts.map(post => (
                    <article key={post.slug} className={styles.postSummary}>
                        <h2>
                            <Link to={`/blog/${post.slug}`}>
                                {post.title}
                            </Link>
                        </h2>
                        <div className={styles.postMeta}>
                            {new Date(post.date).toLocaleDateString()}
                        </div>
                        <p style={{ color: '#d4d4d4' }}>{post.description}</p>
                        <Link to={`/blog/${post.slug}`} className={styles.readMore}>
                            Read more →
                        </Link>
                    </article>
                ))}
                </div>
            </div>
        </div>
    );
}

export default Blog;
