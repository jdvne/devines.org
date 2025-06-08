import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

export function Blog() {
    const [articleContent, setArticleContent] = useState('');

    useEffect(() => {
        import('../blog/posts/hello-world.md')
            .then(res => fetch(res.default))
            .then(response => response.text())
            .then(text => setArticleContent(text))
            .catch(err => console.error('Error fetching article:', err));
    }, []);

    return (
        <div>
            <h1>Welcome to the Blog</h1>
            <p>Stay tuned for updates and articles!</p>
            <Markdown>{articleContent}</Markdown>
        </div>
    );
}

export default Blog;