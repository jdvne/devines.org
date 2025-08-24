# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## for adding new recipes
1. Navigate the project files to [src/pages/cookbook/posts](https://github.com/jdvne/devines.org/tree/main/src/pages/cookbook/posts).
2. Use any existing recipe as a reference.a
3. Click `Add file` > `Create new file`
4. Name the file as you would the recipe, but in all lowercase and dash-separated (`-`), with the Markdown (`.md`) filetype ending. Ex:
```
pepita-crusted-salmon.md
```
5. Type some basic frontmatter (title and details) for the recipe. Ex:
```md
---
title: Apple Pie
category: Dessert
---
```
6. Type the rest of the recipe generally using this general template.
```md
## Ingredients

- [ ] 7 large Granny Smith Apples
- [ ] ...

## Instructions

1. Prepare 1 pie crust as directed, set aside.
2. ...
```
Feel free to insert comments, asides, or whatever you wish.

7. Click `Commit` > `Commit changes`, and see your new recipe live on the site in a few minutes!
