import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
import styles from './BlogPost.module.css';
import { Breadcrumb } from '../components/Breadcrumb';

// Provide Buffer globally for gray-matter
window.Buffer = Buffer;

export function BlogPost() {
    const [content, setContent] = useState('');
    const [metadata, setMetadata] = useState(null);
    const { slug } = useParams();

    const components = useMemo(() => ({
        img: ({ src, alt }) => {
            try {
                const imgSrc = new URL(src, import.meta.url).href;
                return <img src={imgSrc} alt={alt} />;
            } catch {
                return <img src={src} alt={alt} />;
            }
        }
    }), []);

    useEffect(() => {
        import(`../blog/posts/${slug}.md`)
            .then(res => fetch(res.default))
            .then(response => response.text())
            .then(text => {
                const { data, content } = matter(text);
                setMetadata(data);
                setContent(content);
            })
            .catch(err => console.error('Error fetching post:', err));
    }, [slug]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <main id={styles.main}>
            <Helmet bodyAttributes={{ class: styles.body }}>
                <title>{metadata?.title || 'Blog Post'}</title>
            </Helmet>
            <div className={styles.container}>
                <div className={styles.title}>
                    <Breadcrumb items={[
                        { path: '/blog', label: 'thoughts' },
                        { path: `/blog/${slug}`, label: slug }
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
                    <Markdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={components}
                    >
                        {content}
                    </Markdown>
                </div>
            </div>
        </main>
    );
}

export default BlogPost;
