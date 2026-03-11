async function fetchArticles(indexUrl) {
  try {
    const resp = await fetch(indexUrl);
    if (!resp.ok) return [];
    const json = await resp.json();
    return json.data || [];
  } catch {
    return [];
  }
}

function renderCard(article) {
  const card = document.createElement('a');
  card.className = 'popular-article-card';
  card.href = article.path;

  if (article.image) {
    const img = document.createElement('img');
    img.src = article.image;
    img.alt = article.title || '';
    img.loading = 'lazy';
    const imageWrap = document.createElement('div');
    imageWrap.className = 'popular-article-image';
    imageWrap.append(img);
    card.append(imageWrap);
  }

  const body = document.createElement('div');
  body.className = 'popular-article-body';

  const title = document.createElement('h4');
  title.className = 'popular-article-title';
  title.textContent = article.title;
  body.append(title);

  if (article.description) {
    const desc = document.createElement('p');
    desc.className = 'popular-article-desc';
    desc.textContent = article.description.substring(0, 120);
    if (article.description.length > 120) desc.textContent += '...';
    body.append(desc);
  }

  card.append(body);
  return card;
}

export default async function init(el) {
  const link = el.querySelector('a');
  const indexUrl = link?.href || '/articles/query-index.json';
  const limit = parseInt(el.classList[1], 10) || 6;

  const articles = await fetchArticles(indexUrl);
  const sorted = articles
    .sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0))
    .slice(0, limit);

  if (!sorted.length) return;

  const grid = document.createElement('div');
  grid.className = 'popular-articles-grid';
  sorted.forEach((article) => grid.append(renderCard(article)));

  el.textContent = '';
  el.append(grid);
}
