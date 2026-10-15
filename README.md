# Frontend Notes

A standalone blog built with HTML, CSS and vanilla JavaScript. Five complete posts explain the implementation, content format, URL-based rendering, search and deployment.

## Run

```sh
python -m http.server 8000
```

Open http://localhost:8000. No build step, package installation or backend is required.

## Files

- `index.html`: accessible page shell and script loading
- `styles.css`: responsive dark/green design using system fonts
- `posts.js`: five trusted, repository-owned articles
- `app.js`: homepage, article views, search and category filters

Articles use `index.html?post=article-slug`. Search and category state can be shared through URL parameters. Relative links support repository subpaths on static hosts.

To add content, insert an article object into `BLOG_POSTS` with a unique slug, title, category, ISO date, excerpt and trusted HTML body. Array order determines display order.

## Hosting

Serve these four files from any static host. For GitHub Pages, select the branch and root folder in repository Pages settings; pushing this code does not itself configure Pages.

## Limits

Rendering requires JavaScript. There is no CMS, database, login, private content, comments or uploads. Article bodies are inserted as trusted HTML; never accept untrusted visitor input through this path. Client-updated metadata may not be read by link-preview services. Use pre-rendered article HTML if crawlability without JavaScript is required.
