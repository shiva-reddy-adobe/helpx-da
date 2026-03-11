export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'product-chiclet-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const chiclet = document.createElement('a');
    chiclet.className = 'product-chiclet-item';

    // Icon/image
    const pic = cells[0]?.querySelector('picture, img');
    if (pic) {
      const icon = document.createElement('div');
      icon.className = 'product-chiclet-icon';
      icon.append(pic);
      chiclet.append(icon);
    }

    // Name + link
    const link = row.querySelector('a');
    if (link) {
      chiclet.href = link.href;
    }

    const nameCell = cells[1] || cells[0];
    const name = document.createElement('span');
    name.className = 'product-chiclet-name';
    name.textContent = link?.textContent || nameCell?.textContent?.trim() || '';
    chiclet.append(name);

    container.append(chiclet);
  });

  el.textContent = '';
  el.append(container);
}
