export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const badge = document.createElement('div');
  badge.className = 'product-badge-container';

  const cells = [...rows[0].children];

  // Icon
  const pic = cells[0]?.querySelector('picture, img');
  if (pic) {
    const icon = document.createElement('div');
    icon.className = 'product-badge-icon';
    icon.append(pic);
    badge.append(icon);
  }

  // Product name
  const nameCell = cells[1] || cells[0];
  if (nameCell) {
    const name = document.createElement('span');
    name.className = 'product-badge-name';
    name.textContent = nameCell.textContent.trim();
    badge.append(name);
  }

  el.textContent = '';
  el.append(badge);
}
