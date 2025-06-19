import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, useCallback } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { Buffer } from 'buffer';

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Provide Buffer globally for gray-matter
window.Buffer = Buffer;

export function MarkdownRenderer({ content, useLocalStorage = true }) {
  const [checklistState, setChecklistState] = useState({});

  const contentHash = hashCode(content);

  const loadChecklistState = useCallback(() => {
    const savedState = localStorage.getItem(`checklistState_${contentHash}`);
    return savedState ? JSON.parse(savedState) : {};
  }, [contentHash]);

  const saveChecklistState = useCallback((checklistState) => {
    localStorage.setItem(`checklistState_${contentHash}`, JSON.stringify(checklistState));
  }, [contentHash]);

  const handleCheckboxChange = useCallback((index, checked) => {
    const updatedState = { ...checklistState, [index]: checked };
    setChecklistState(updatedState);
    if (useLocalStorage) {
      saveChecklistState(updatedState);
    }
  }, [checklistState, saveChecklistState, setChecklistState, useLocalStorage]);

  useEffect(() => {
    if (!useLocalStorage) {
      return;
    }

    const initialState = loadChecklistState();
    setChecklistState(initialState);

  }, [useLocalStorage, loadChecklistState]);

  useEffect(() => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox, index) => {
      checkbox.disabled = false;
      checkbox.checked = checklistState[index] || false;

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
  }, [content, checklistState, handleCheckboxChange]);

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
  content: PropTypes.string.isRequired,
  useLocalStorage: PropTypes.bool
};
