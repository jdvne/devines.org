import { useMemo } from 'react';
import Markdown from 'react-markdown';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Buffer } from 'buffer';

// Provide Buffer globally for gray-matter
window.Buffer = Buffer;

export function MarkdownRenderer({ content }) {
    const components = useMemo(() => ({
        img: ({ src, alt }) => {
            try {
                const imgSrc = new URL(src, import.meta.url).href;
                return <img src={imgSrc} alt={alt} />;
            } catch {
                return <img src={src} alt={alt} />;
            }
        },
        code: ({ inline, className, children, ...props }) => {
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

    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={components}
        >
            {content}
        </Markdown>
    );
}

MarkdownRenderer.propTypes = {
    content: PropTypes.string.isRequired
};
