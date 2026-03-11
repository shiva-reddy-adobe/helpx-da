export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const container = document.createElement('div');
  container.className = 'product-variation-container';

  const label = document.createElement('label');
  label.className = 'product-variation-label';
  label.textContent = 'Version:';
  label.setAttribute('for', 'product-variation-select');

  const select = document.createElement('select');
  select.id = 'product-variation-select';
  select.className = 'product-variation-select';

  rows.forEach((row) => {
    const cells = [...row.children];
    const option = document.createElement('option');
    const link = row.querySelector('a');

    option.textContent = cells[0]?.textContent?.trim() || '';
    option.value = link?.href || '';

    // Mark current page as selected
    if (link && new URL(link.href, window.location.origin).pathname === window.location.pathname) {
      option.selected = true;
    }

    select.append(option);
  });

  select.addEventListener('change', () => {
    const url = select.value;
    if (url) window.location.href = url;
  });

  container.append(label, select);
  el.textContent = '';
  el.append(container);
}
