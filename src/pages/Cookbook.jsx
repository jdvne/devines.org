import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from "react-helmet";

import matter from 'gray-matter';
import styles from './Cookbook.module.css';

export function Cookbook() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || "All";

  useEffect(() => {
    const fetchRecipes = async () => {
      // Dynamically import all .md files from the src/recipes directory
      const modules = import.meta.glob('../content/recipes/*.md');
      const recipeData = [];
      const categorySet = new Set();
      categorySet.add("All");

      for (const path in modules) {
        const module = await modules[path]();
        const name = path.split('/').pop().replace('.md', '');

        const response = await fetch(module.default);
        const text = await response.text();
        const { data } = matter(text);

        const category = data?.category || "Uncategorized";
        categorySet.add(category);

        if (selectedCategory === "All" || category === selectedCategory) {
          recipeData.push({
            name: name,
            title: data?.title || name,
            module: module,
            category: category,
          });
        }
      }
      recipeData.sort((a, b) => a.title.localeCompare(b.title));
      setRecipes(recipeData);
      setCategories([...categorySet]);
    };

    fetchRecipes();
  }, [selectedCategory]);

  return (
    <div className={styles.recipePage}>
      <Helmet bodyAttributes={{ class: styles.body }} />
      <div className={styles.recipeContainer}>
        <h1 className={styles.recipeTitle}>Table of Contents</h1>
        <div className={styles.recipeHorizontalBar}></div>

        <div className={styles.recipeContent}>
          <div className={styles.recipeCategories}>
            <h2 className={styles.recipeCategoriesTitle}>Categories:</h2>
            <div className={styles.categoryChips}>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={category === "All" ? "/cookbook" : `/cookbook?category=${encodeURIComponent(category)}`}
                  className={`${styles.categoryChip} ${
                    selectedCategory === category ? styles.selected : ''
                  }`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.recipeGrid}>
          {recipes.map((recipe) => (
            <Link key={recipe.name} to={`/cookbook/${recipe.name}`} className={styles.recipeGridItem}>
              {recipe.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cookbook;
