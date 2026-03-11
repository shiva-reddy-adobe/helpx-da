const ASDE_API = 'https://adobesearch.adobe.io/autocomplete/v2';

let debounceTimer;

async function fetchSuggestions(query, apiKey) {
  if (!query || query.length < 2) return [];
  try {
    const params = new URLSearchParams({ q: query, limit: '5', locale: document.documentElement.lang || 'en' });
    const resp = await fetch(`${ASDE_API}?${params}`, { headers: apiKey ? { 'x-api-key': apiKey } : {} });
    if (!resp.ok) return [];
    const json = await resp.json();
    return json.suggestions || [];
  } catch {
    return [];
  }
}

function renderSuggestions(list, suggestions, input) {
  list.textContent = '';
  if (!suggestions.length) {
    list.setAttribute('hidden', '');
    return;
  }

  suggestions.forEach((s) => {
    const li = document.createElement('li');
    li.className = 'search-bar-suggestion';
    li.setAttribute('role', 'option');
    li.textContent = s.text || s;
    li.addEventListener('click', () => {
      input.value = li.textContent;
      list.setAttribute('hidden', '');
      input.form?.submit();
    });
    list.append(li);
  });

  list.removeAttribute('hidden');
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const apiKey = rows[0]?.textContent?.trim() || '';
  const searchAction = rows[1]?.querySelector('a')?.href || '/search';

  const form = document.createElement('form');
  form.className = 'search-bar-form';
  form.action = searchAction;
  form.method = 'get';

  const inputWrap = document.createElement('div');
  inputWrap.className = 'search-bar-input-wrap';

  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.className = 'search-bar-input';
  input.placeholder = 'Search Adobe Help...';
  input.setAttribute('aria-label', 'Search');
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('aria-autocomplete', 'list');

  const suggestions = document.createElement('ul');
  suggestions.className = 'search-bar-suggestions';
  suggestions.setAttribute('role', 'listbox');
  suggestions.setAttribute('hidden', '');

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const results = await fetchSuggestions(input.value.trim(), apiKey);
      renderSuggestions(suggestions, results, input);
    }, 200);
  });

  input.addEventListener('blur', () => {
    setTimeout(() => suggestions.setAttribute('hidden', ''), 150);
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'search-bar-submit';
  submitBtn.setAttribute('aria-label', 'Search');
  submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="6" stroke="currentColor" stroke-width="2" fill="none"/><path d="M13 13L18 18" stroke="currentColor" stroke-width="2"/></svg>';

  inputWrap.append(input, suggestions, submitBtn);
  form.append(inputWrap);

  el.textContent = '';
  el.append(form);
}
