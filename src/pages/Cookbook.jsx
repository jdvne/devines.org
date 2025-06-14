import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Cookbook.module.css';

export function Cookbook() {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
      const fetchRecipes = async () => {
        // Dynamically import all .md files from the src/recipes directory
        const modules = import.meta.glob('../recipes/*.md');
        const recipeData = [];

        for (const path in modules) {
          const module = await modules[path]();
          const name = path.split('/').pop().replace('.md', '');
          const category = module.metadata?.category || "Uncategorized"; // Assuming frontmatter with category

          if (selectedCategory === "All" || category === selectedCategory) {
            recipeData.push({
              name: name,
              module: module,
              category: category,
            });
          }
        }
        setRecipes(recipeData);
      };

    fetchRecipes();
  }, [selectedCategory]);

  const categories = ["All", "Appetizers / Sides", "Dinner", "Dessert"];

  return (
    <div className={styles.recipePage}>
      <div className={styles.recipeContainer}>
        <h1 className={styles.recipeTitle}>Table of Contents</h1>
        <div className={styles.recipeHorizontalBar}></div>

        <div className={styles.recipeContent}>
          <div className={styles.recipeCategories}>
            <h2 className={styles.recipeCategoriesTitle}>Categories:</h2>
            <ul className={styles.recipeList}>
              {categories.map((category) => (
                <li key={category} className={styles.recipeListItem}>
                  <a
                    href={`#${category.toLowerCase().replace(/ /g, "-")}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategory(category);
                    }}
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className={styles.recipeList}>
          {recipes.map((recipe) => (
            <li key={recipe.name} className={styles.recipeListItem}>
              <Link to={`/cookbook/${recipe.name}`}>{recipe.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Cookbook;
