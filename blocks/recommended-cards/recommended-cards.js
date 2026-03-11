async function fetchRecommendations(apiUrl) {
  try {
    const resp = await fetch(apiUrl);
    if (!resp.ok) return [];
    const json = await resp.json();
    return json.data || json.results || [];
  } catch {
    return [];
  }
}

function renderCard(item) {
  const card = document.createElement('a');
  card.className = 'recommended-card';
  card.href = item.path || item.url || '#';

  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title || '';
    img.loading = 'lazy';
    const imageWrap = document.createElement('div');
    imageWrap.className = 'recommended-card-image';
    imageWrap.append(img);
    card.append(imageWrap);
  }

  const body = document.createElement('div');
  body.className = 'recommended-card-body';

  if (item.product) {
    const tag = document.createElement('span');
    tag.className = 'recommended-card-tag';
    tag.textContent = item.product;
    body.append(tag);
  }

  const title = document.createElement('h4');
  title.className = 'recommended-card-title';
  title.textContent = item.title;
  body.append(title);

  if (item.description) {
    const desc = document.createElement('p');
    desc.className = 'recommended-card-desc';
    desc.textContent = item.description.substring(0, 100);
    if (item.description.length > 100) desc.textContent += '...';
    body.append(desc);
  }

  card.append(body);
  return card;
}

export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const apiUrl = rows[0]?.querySelector('a')?.href || rows[0]?.textContent?.trim();
  if (!apiUrl) return;

  const limit = parseInt(el.classList[1], 10) || 4;
  const items = await fetchRecommendations(apiUrl);
  const display = items.slice(0, limit);

  if (!display.length) return;

  const grid = document.createElement('div');
  grid.className = 'recommended-cards-grid';
  display.forEach((item) => grid.append(renderCard(item)));

  el.textContent = '';
  el.append(grid);
}
