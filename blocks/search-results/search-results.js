const ASDE_SEARCH_API = 'https://adobesearch.adobe.io/search/v2';

async function searchASDE(query, page, apiKey) {
  if (!query) return { results: [], total: 0 };
  try {
    const params = new URLSearchParams({
      q: query,
      offset: String((page - 1) * 10),
      limit: '10',
      locale: document.documentElement.lang || 'en',
    });
    const resp = await fetch(`${ASDE_SEARCH_API}?${params}`, { headers: apiKey ? { 'x-api-key': apiKey } : {} });
    if (!resp.ok) return { results: [], total: 0 };
    const json = await resp.json();
    return {
      results: json.results || json.hits || [],
      total: json.total || json.totalHits || 0,
    };
  } catch {
    return { results: [], total: 0 };
  }
}

function renderResult(item) {
  const result = document.createElement('div');
  result.className = 'search-result-item';

  const link = document.createElement('a');
  link.href = item.url || item.path || '#';
  link.className = 'search-result-title';
  link.textContent = item.title || 'Untitled';
  result.append(link);

  if (item.url || item.path) {
    const url = document.createElement('span');
    url.className = 'search-result-url';
    url.textContent = item.url || item.path;
    result.append(url);
  }

  if (item.description || item.snippet) {
    const desc = document.createElement('p');
    desc.className = 'search-result-desc';
    desc.textContent = item.description || item.snippet;
    result.append(desc);
  }

  return result;
}

function renderPagination(container, total, currentPage, onPageChange) {
  const totalPages = Math.ceil(total / 10);
  if (totalPages <= 1) return;

  const nav = document.createElement('nav');
  nav.className = 'search-pagination';
  nav.setAttribute('aria-label', 'Search results pages');

  for (let i = 1; i <= Math.min(totalPages, 10); i += 1) {
    const btn = document.createElement('button');
    btn.className = 'search-page-btn';
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('is-active');
    btn.addEventListener('click', () => onPageChange(i));
    nav.append(btn);
  }

  container.append(nav);
}

export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const apiKey = rows[0]?.textContent?.trim() || '';

  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';
  let currentPage = parseInt(params.get('page'), 10) || 1;

  const container = document.createElement('div');
  container.className = 'search-results-container';

  async function loadResults(page) {
    currentPage = page;
    container.textContent = '';

    if (!query) {
      const empty = document.createElement('p');
      empty.className = 'search-results-empty';
      empty.textContent = 'Enter a search query to see results.';
      container.append(empty);
      return;
    }

    const loading = document.createElement('p');
    loading.className = 'search-results-loading';
    loading.textContent = 'Searching...';
    container.append(loading);

    const { results, total } = await searchASDE(query, page, apiKey);
    container.textContent = '';

    const summary = document.createElement('p');
    summary.className = 'search-results-summary';
    summary.textContent = `${total} results for "${query}"`;
    container.append(summary);

    if (!results.length) {
      const noResults = document.createElement('p');
      noResults.className = 'search-results-empty';
      noResults.textContent = 'No results found. Try a different search term.';
      container.append(noResults);
      return;
    }

    const list = document.createElement('div');
    list.className = 'search-results-list';
    results.forEach((item) => list.append(renderResult(item)));
    container.append(list);

    renderPagination(container, total, currentPage, loadResults);
  }

  el.textContent = '';
  el.append(container);
  await loadResults(currentPage);
}
