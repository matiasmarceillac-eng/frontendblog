(() => {
  'use strict';
  const posts = window.BLOG_POSTS;
  const main = document.getElementById('content');
  const params = new URLSearchParams(location.search);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const postURL = p => `index.html?post=${encodeURIComponent(p.slug)}`;
  const plain = html => { const template = document.createElement('template'); template.innerHTML = html; return template.content.textContent.replace(/\s+/g,' ').trim(); };
  const minutes = p => Math.max(1, Math.ceil(plain(p.body).split(/\s+/).length / 200));
  const date = value => new Intl.DateTimeFormat('en',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
  const setMeta = (title, description) => { document.title = title; document.querySelector('meta[name="description"]').content = description; };
  if (!Array.isArray(posts) || !posts.length) { main.innerHTML = '<section class="empty"><h1>No posts available</h1><p>The article data could not be loaded. Please refresh.</p></section>'; return; }
  const slug = params.get('post');
  if (slug !== null) {
    const index = posts.findIndex(p => p.slug === slug);
    if (index < 0) { setMeta('Article not found — Frontend Notes','This article is unavailable.'); main.innerHTML = '<section class="empty"><p class="eyebrow">404 / ARTICLE</p><h1>This page is a loose end.</h1><p>The article link may be incorrect.</p><a href="index.html">← Browse all posts</a></section>'; return; }
    const post = posts[index];
    setMeta(post.title+' — Frontend Notes',post.excerpt);
    main.innerHTML = `<div class="article-layout"><aside class="article-side"><a href="index.html">← All posts</a><p>CHAPTER ${String(index+1).padStart(2,'0')} / ${String(posts.length).padStart(2,'0')}<br>${escape(post.category)}<br><br>${date(post.date)}<br>${minutes(post)} min read</p></aside><article class="article"><header><p class="eyebrow">${escape(post.category)} / HOW THIS BLOG WORKS</p><h1>${escape(post.title)}</h1><p class="lede">${escape(post.excerpt)}</p><p class="meta">MATÍAS MARCEILLAC · ${date(post.date)} · ${minutes(post)} MIN READ</p></header><div class="article-body">${post.body}</div><nav class="article-bottom" aria-label="Article navigation">${index>0?`<a href="${postURL(posts[index-1])}">← ${escape(posts[index-1].title)}</a>`:'<a href="index.html">← All posts</a>'}${index<posts.length-1?`<a href="${postURL(posts[index+1])}">Next: ${escape(posts[index+1].title)} →</a>`:'<a href="index.html">Back to all posts →</a>'}</nav></article></div>`;
    return;
  }
  let category = params.get('category') || 'All';
  let query = params.get('q') || '';
  const categories = ['All',...new Set(posts.map(p => p.category))];
  if (!categories.includes(category)) category = 'All';
  const searchIndex = new Map(posts.map(p => [p.slug,`${p.title} ${p.excerpt} ${p.category} ${plain(p.body)}`.toLowerCase()]));
  main.innerHTML = `<section class="intro"><p class="eyebrow">FIVE POSTS. ONE OPEN NOTEBOOK.</p><h1>A little code.<br>A lot to <span>write about.</span></h1><p>A blog about the blog you’re reading. Explore the structure, the styling, and the JavaScript that brings it together.</p></section><section aria-label="Browse posts"><div class="toolbar"><div class="filters" role="group" aria-label="Filter by category">${categories.map(c=>`<button type="button" class="filter" data-category="${escape(c)}" aria-pressed="${c===category}">${escape(c)}</button>`).join('')}</div><label class="search">Search<input id="search" type="search" placeholder="Find a note…" value="${escape(query)}" autocomplete="off"></label></div><p class="count" id="result-count" role="status" aria-live="polite" aria-atomic="true"></p><div class="post-list" id="post-list"></div></section>`;
  const list = document.getElementById('post-list');
  const search = document.getElementById('search');
  const update = () => {
    const term = query.trim().toLowerCase();
    const filtered = posts.filter(p => (category==='All'||p.category===category)&&searchIndex.get(p.slug).includes(term));
    document.getElementById('result-count').textContent = `${String(filtered.length).padStart(2,'0')} ${filtered.length===1?'POST':'POSTS'} / ${category==='All'?'ALL NOTES':category.toUpperCase()}`;
    list.innerHTML = filtered.length ? filtered.map(p=>`<article class="post-card ${p===posts[0]?'feature':''}"><span class="number">${String(posts.indexOf(p)+1).padStart(2,'0')}</span><div><span class="tag">${escape(p.category)}${p===posts[0]?' / START HERE':''}</span><h2><a href="${postURL(p)}">${escape(p.title)}</a></h2><p>${escape(p.excerpt)}</p></div><div class="card-end"><span class="reading-time">${date(p.date)}<br>${minutes(p)} min read</span><a class="read-link" href="${postURL(p)}" aria-label="Read ${escape(p.title)}">↗</a></div></article>`).join('') : '<section class="empty"><h2>No notes found.</h2><p>Try another term or reset the filters.</p><button id="reset" type="button">Show all posts</button></section>';
    document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
    const url = new URL(location.href); url.search = ''; if (category!=='All') url.searchParams.set('category',category); if(query)url.searchParams.set('q',query); history.replaceState(null,'',url);
  };
  document.querySelector('.filters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){category=b.dataset.category;update();}});
  search.addEventListener('input',()=>{query=search.value;update();});
  list.addEventListener('click',e=>{if(e.target.closest('#reset')){category='All';query='';search.value='';update();search.focus();}});
  update();
})();
