async function fetchErrorCodes(indexUrl) {
  try {
    const resp = await fetch(indexUrl);
    if (!resp.ok) return [];
    const json = await resp.json();
    return json.data || [];
  } catch {
    return [];
  }
}

function renderResults(container, items, query) {
  container.textContent = '';
  const filtered = query
    ? items.filter((item) => {
      const search = query.toLowerCase();
      return (item.errorCode?.toLowerCase().includes(search))
          || (item.title?.toLowerCase().includes(search))
          || (item.description?.toLowerCase().includes(search));
    })
    : items;

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'error-code-empty';
    empty.textContent = query ? `No results for "${query}"` : 'No error codes found.';
    container.append(empty);
    return;
  }

  const table = document.createElement('table');
  table.className = 'error-code-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Error Code', 'Description', 'Solution'].forEach((text) => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.append(th);
  });
  thead.append(headerRow);
  table.append(thead);

  const tbody = document.createElement('tbody');
  filtered.forEach((item) => {
    const tr = document.createElement('tr');
    const code = document.createElement('td');
    code.className = 'error-code-cell';
    if (item.path) {
      const a = document.createElement('a');
      a.href = item.path;
      a.textContent = item.errorCode || item.title;
      code.append(a);
    } else {
      code.textContent = item.errorCode || item.title;
    }

    const desc = document.createElement('td');
    desc.textContent = item.description || '';

    const solution = document.createElement('td');
    solution.textContent = item.content || '';

    tr.append(code, desc, solution);
    tbody.append(tr);
  });

  table.append(tbody);
  container.append(table);
}

export default async function init(el) {
  const link = el.querySelector('a');
  const indexUrl = link?.href || '/error-codes/query-index.json';

  const items = await fetchErrorCodes(indexUrl);

  const searchWrap = document.createElement('div');
  searchWrap.className = 'error-code-search';

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'error-code-input';
  input.placeholder = 'Search error codes...';
  input.setAttribute('aria-label', 'Search error codes');

  searchWrap.append(input);

  const results = document.createElement('div');
  results.className = 'error-code-results';

  el.textContent = '';
  el.append(searchWrap, results);

  renderResults(results, items, '');

  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => renderResults(results, items, input.value.trim()), 250);
  });
}
