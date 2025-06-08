import matter from 'gray-matter';

// Get all blog posts
export async function getAllPosts() {
  try {
    console.log('Getting all posts...');
    // Import all markdown files directly as text
    const modules = import.meta.glob('/src/blog/posts/*.md', { as: 'raw', eager: true });
    
    // Process each markdown file
    const posts = Object.entries(modules).map(([filepath, content]) => {
      try {
        // Parse front matter
        const { data: frontMatter, content: markdownContent } = matter(content);
        
        // Extract slug from filepath
        const slug = filepath.split('/').pop().replace('.md', '');
        
        return {
          slug,
          frontMatter,
          content: markdownContent
        };
      } catch (err) {
        console.error('Error processing file:', filepath, err);
        return null;
      }
    });
    
    // Filter out any failed imports and sort by date
    const validPosts = posts.filter(post => post !== null);
    const sortedPosts = validPosts.sort((a, b) => {
      const dateA = new Date(a.frontMatter.date);
      const dateB = new Date(b.frontMatter.date);
      return dateB - dateA;
    });

    console.log('Processed posts:', sortedPosts);
    return sortedPosts;
  } catch (err) {
    console.error('Error in getAllPosts:', err);
    throw err;
  }
}

// Get a single blog post by slug
export function getPostBySlug(slug) {
  try {
    console.log('Getting post by slug:', slug);
    // Import all markdown files directly as text
    const modules = import.meta.glob('/src/blog/posts/*.md', { as: 'raw', eager: true });
    
    const matchingEntry = Object.entries(modules).find(([filepath]) => 
      filepath.split('/').pop().replace('.md', '') === slug
    );
    
    if (!matchingEntry) {
      console.error(`Post with slug ${slug} not found`);
      return null;
    }
    
    const [, content] = matchingEntry;
    
    // Parse front matter
    const { data: frontMatter, content: markdownContent } = matter(content);
    
    return {
      slug,
      frontMatter,
      content: markdownContent
    };
  } catch (err) {
    console.error('Error in getPostBySlug:', err);
    throw err;
  }
}
