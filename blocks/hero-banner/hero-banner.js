const ASDE_ENDPOINT = 'https://adobesearch.adobe.io/autocomplete/completions';
const ASDE_API_KEY = 'helpxcomprod';
const SEARCH_REDIRECT = '/search.html';
const MAX_SUGGESTIONS = 5;

let debounceTimer;

async function fetchSuggestions(query) {
  if (!query || query.length < 2) return [];
  const locale = (document.documentElement.lang || 'en').split('-')[0];
  const url = `${ASDE_ENDPOINT}?q[text]=${encodeURIComponent(query)}&q[locale]=${locale}&scope=adobe_com`;
  try {
    const resp = await fetch(url, {
      headers: { 'x-api-key': ASDE_API_KEY, 'Content-Type': 'application/json' },
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.suggested_completions || []).slice(0, MAX_SUGGESTIONS);
  } catch {
    return [];
  }
}

function navigateToSearch(query) {
  const q = query.trim();
  if (!q) return;
  window.location.href = `${SEARCH_REDIRECT}?q=${encodeURIComponent(q)}`;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  el.textContent = '';

  const headingText = rows[0]?.textContent?.trim() || 'Hi, how can we help?';
  const searchPlaceholder = rows[1]?.textContent?.trim() || 'Search Help & Support';

  const container = document.createElement('div');
  container.className = 'hero-banner-container';

  const bg = document.createElement('div');
  bg.className = 'hero-banner-bg';
  container.append(bg);

  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  const h1 = document.createElement('h1');
  h1.className = 'hero-banner-heading';
  h1.textContent = headingText;
  content.append(h1);

  // ASDE Search form with autocomplete
  const form = document.createElement('form');
  form.className = 'hero-banner-search';
  form.setAttribute('role', 'search');

  const searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchIcon.setAttribute('width', '20');
  searchIcon.setAttribute('height', '20');
  searchIcon.setAttribute('viewBox', '0 0 24 24');
  searchIcon.setAttribute('fill', 'none');
  searchIcon.setAttribute('aria-hidden', 'true');
  searchIcon.innerHTML = '<path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>';

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'hero-banner-search-input';
  input.placeholder = searchPlaceholder;
  input.setAttribute('aria-label', searchPlaceholder);
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('aria-autocomplete', 'list');

  const suggestions = document.createElement('ul');
  suggestions.className = 'hero-banner-suggestions';
  suggestions.setAttribute('role', 'listbox');
  suggestions.setAttribute('hidden', '');

  // Autocomplete input handler
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const results = await fetchSuggestions(input.value.trim());
      suggestions.textContent = '';
      if (!results.length) {
        suggestions.setAttribute('hidden', '');
        return;
      }
      results.forEach((s) => {
        const li = document.createElement('li');
        li.className = 'hero-banner-suggestion';
        li.setAttribute('role', 'option');
        li.textContent = s.name || s;
        li.addEventListener('click', () => {
          input.value = li.textContent;
          suggestions.setAttribute('hidden', '');
          navigateToSearch(input.value);
        });
        suggestions.append(li);
      });
      suggestions.removeAttribute('hidden');
    }, 300);
  });

  // Keyboard navigation for suggestions
  input.addEventListener('keydown', (e) => {
    const items = [...suggestions.querySelectorAll('.hero-banner-suggestion')];
    const active = suggestions.querySelector('.is-active');
    const idx = items.indexOf(active);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      active?.classList.remove('is-active');
      const next = items[idx + 1] || items[0];
      next?.classList.add('is-active');
      input.value = next?.textContent || input.value;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      active?.classList.remove('is-active');
      const prev = items[idx - 1] || items[items.length - 1];
      prev?.classList.add('is-active');
      input.value = prev?.textContent || input.value;
    }
  });

  // Hide suggestions on click outside
  document.addEventListener('click', (e) => {
    if (!form.contains(e.target)) suggestions.setAttribute('hidden', '');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    suggestions.setAttribute('hidden', '');
    navigateToSearch(input.value);
  });

  form.append(searchIcon, input, suggestions);
  content.append(form);
  container.append(content);
  el.append(container);
}
