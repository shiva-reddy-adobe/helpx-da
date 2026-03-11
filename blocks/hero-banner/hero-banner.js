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

  const form = document.createElement('form');
  form.className = 'hero-banner-search';
  form.setAttribute('role', 'search');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = form.querySelector('input').value.trim();
    if (q) window.location.href = `/search.html?q=${encodeURIComponent(q)}`;
  });

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

  form.append(searchIcon, input);
  content.append(form);
  container.append(content);
  el.append(container);
}
