async function fetchReleaseNotes(indexUrl) {
  try {
    const resp = await fetch(indexUrl);
    if (!resp.ok) return [];
    const json = await resp.json();
    return json.data || [];
  } catch {
    return [];
  }
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(Number(timestamp) * 1000 || timestamp);
  return date.toLocaleDateString(document.documentElement.lang || 'en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderEntry(item) {
  const entry = document.createElement('div');
  entry.className = 'whats-new-entry';

  const date = document.createElement('time');
  date.className = 'whats-new-date';
  date.textContent = formatDate(item.releaseDate || item.lastModified);
  entry.append(date);

  const body = document.createElement('div');
  body.className = 'whats-new-body';

  const link = document.createElement('a');
  link.href = item.path;
  link.className = 'whats-new-title';
  link.textContent = item.title;
  body.append(link);

  if (item.product) {
    const tag = document.createElement('span');
    tag.className = 'whats-new-product';
    tag.textContent = item.product;
    body.append(tag);
  }

  if (item.description) {
    const desc = document.createElement('p');
    desc.className = 'whats-new-desc';
    desc.textContent = item.description;
    body.append(desc);
  }

  entry.append(body);
  return entry;
}

export default async function init(el) {
  const link = el.querySelector('a');
  const indexUrl = link?.href || '/whats-new/query-index.json';

  const items = await fetchReleaseNotes(indexUrl);
  const sorted = items.sort((a, b) => {
    const da = a.releaseDate || a.lastModified || 0;
    const db = b.releaseDate || b.lastModified || 0;
    return db - da;
  });

  if (!sorted.length) return;

  const container = document.createElement('div');
  container.className = 'whats-new-container';
  sorted.forEach((item) => container.append(renderEntry(item)));

  el.textContent = '';
  el.append(container);
}
