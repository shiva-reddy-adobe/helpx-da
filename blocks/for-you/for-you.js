function isLoggedIn() {
  return !!window.adobeIMS?.isSignedInUser?.();
}

async function fetchRecommendations() {
  try {
    const token = await window.adobeIMS?.getAccessToken?.();
    if (!token) return [];
    const resp = await fetch('https://p13n.adobe.io/fg/api/v1/web/recommendations', { headers: { Authorization: `Bearer ${token.token}` } });
    if (!resp.ok) return [];
    const json = await resp.json();
    return json.recommendations || json.data || [];
  } catch {
    return [];
  }
}

function renderCard(item) {
  const card = document.createElement('a');
  card.className = 'for-you-card';
  card.href = item.path || item.url || '#';

  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title || '';
    img.loading = 'lazy';
    const imageWrap = document.createElement('div');
    imageWrap.className = 'for-you-card-image';
    imageWrap.append(img);
    card.append(imageWrap);
  }

  const body = document.createElement('div');
  body.className = 'for-you-card-body';

  const title = document.createElement('h4');
  title.textContent = item.title;
  body.append(title);

  if (item.description) {
    const desc = document.createElement('p');
    desc.textContent = item.description.substring(0, 100);
    body.append(desc);
  }

  card.append(body);
  return card;
}

function renderFallback(el) {
  const container = document.createElement('div');
  container.className = 'for-you-fallback';
  const rows = [...el.querySelectorAll(':scope > div')];
  rows.forEach((row) => container.append(...row.childNodes));
  el.textContent = '';
  el.append(container);
}

export default async function init(el) {
  if (!isLoggedIn()) {
    renderFallback(el);
    return;
  }

  const recs = await fetchRecommendations();
  if (!recs.length) {
    renderFallback(el);
    return;
  }

  const heading = document.createElement('h3');
  heading.className = 'for-you-heading';
  heading.textContent = 'For You';

  const grid = document.createElement('div');
  grid.className = 'for-you-grid';
  recs.slice(0, 4).forEach((item) => grid.append(renderCard(item)));

  el.textContent = '';
  el.append(heading, grid);
}
