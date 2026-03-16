# devines.org

Personal site built with [Astro](https://astro.build). Deploys automatically to GitHub Pages on every push to `main`.

---

## Adding a Recipe

1. Go to [`src/content/cookbook/`](https://github.com/jdvne/devines.org/tree/main/src/content/cookbook) on GitHub.

2. Click **Add file** → **Create new file**.

3. Name the file after the recipe in all lowercase with dashes and a `.md` extension:
   ```
   pepita-crusted-salmon.md
   ```

4. At the top of the file, add the recipe details between the `---` lines. Only `title` and `category` are required — the rest are optional:
   ```
   ---
   title: Apple Pie
   category: Dessert
   preparationTime: 1 hour
   cookTime: 1 hour
   cookTemperature: 400 F
   totalTime: 2 hours
   ---
   ```

   Available categories: `Entree`, `Dessert`, `Side`, `Snack`, `Breakfast`, `Drink`

5. Below the `---`, write the recipe using this format:
   ```
   ## Ingredients

   - [ ] 2 cups flour
   - [ ] 1 tsp salt
   - [ ] ...

   ## Instructions

   1. Preheat oven to 350 F.
   2. Mix the dry ingredients together.
   3. ...
   ```

   The `- [ ]` checkboxes are optional but nice — they become interactive checkboxes on the site that remember your progress.

6. Click **Commit changes** and the recipe will be live on the site within a few minutes.

---

## Adding a Thought

1. Go to [`src/content/thoughts/`](https://github.com/jdvne/devines.org/tree/main/src/content/thoughts) on GitHub.

2. Click **Add file** → **Create new file**.

3. Name the file after the post in all lowercase with dashes and a `.md` extension:
   ```
   my-first-post.md
   ```
   This becomes the URL: `devines.org/thoughts/my-first-post`

4. At the top of the file, add the post details between the `---` lines:
   ```
   ---
   title: My First Post
   date: 2026-03-15
   description: A short sentence summarizing what this is about.
   ---
   ```

5. Below the `---`, write the post in plain text using Markdown:
   ```
   Some opening thoughts here.

   ## A Section Heading

   More content here. You can use **bold**, _italic_, or write
   code like `this`.

   ## Another Section

   - bullet points work too
   - and so do numbered lists
   ```

6. Click **Commit changes** and the post will appear on the site within a few minutes.

---

## Adding a Trail to the Travel Map

Trails are plotted as dashed lines on the travel map. The workflow uses GPX files exported from AllTrails.

### Step 1 — Export from AllTrails

On AllTrails, open the trail you recorded and tap **Export** → **GPX**.

### Step 2 — Convert to GeoJSON

Drop the `.gpx` file into the **root of the repo**, then run:

```bash
npm run convert-trails
```

This generates a `.geojson` file in `src/data/trails/` and prints the filename. The original `.gpx` file is gitignored and will not be committed.

### Step 3 — Add metadata in `trails.yml`

Open `src/data/trails.yml` and add an entry:

```yaml
- file: "your-trail-name.geojson"   # filename printed by the convert script
  name: "Your Trail Name"           # shown when clicking the trail
  type: parks                       # pin color (visited/lived/want/family/work/parks)
  date: "March 10, 2024"            # optional
  caption: "great views"            # optional
```

### Step 4 — Commit

Commit the `.geojson` file and the updated `trails.yml`. The trail will appear on the map at `devines.org/travel`.

---

## Running Locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # build for production
npm run preview  # preview the production build
```
