export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // Determine number of columns from first row
  const firstRow = rows[0];
  const colCount = firstRow.querySelectorAll(':scope > div').length;

  // Transpose: build one card per column
  const cards = [];
  for (let col = 0; col < colCount; col++) {
    const card = document.createElement('div');
    card.className = 'account-support-card';

    // Row 0: icon + heading
    const headerCell = rows[0]?.querySelectorAll(':scope > div')[col];
    if (headerCell) {
      const header = document.createElement('div');
      header.className = 'account-support-header';

      const iconLink = headerCell.querySelector('a');
      if (iconLink) {
        const icon = document.createElement('img');
        icon.src = iconLink.href;
        icon.alt = '';
        icon.className = 'account-support-icon';
        header.appendChild(icon);
      }

      const heading = document.createElement('h3');
      // Get text after the icon link (the heading text)
      const allText = headerCell.textContent.trim();
      const linkText = iconLink ? iconLink.textContent.trim() : '';
      heading.textContent = allText.replace(linkText, '').trim() || linkText;
      header.appendChild(heading);
      card.appendChild(header);
    }

    // Rows 1–3: article links
    const list = document.createElement('ul');
    list.className = 'account-support-list';
    for (let r = 1; r <= 3 && r < rows.length; r++) {
      const cell = rows[r]?.querySelectorAll(':scope > div')[col];
      const link = cell?.querySelector('a');
      if (link) {
        const li = document.createElement('li');
        li.className = 'account-support-list-item';
        li.appendChild(link.cloneNode(true));
        list.appendChild(li);
      }
    }
    if (list.children.length) card.appendChild(list);

    // Row 4: "View more articles" link
    if (rows[4]) {
      const viewMoreCell = rows[4].querySelectorAll(':scope > div')[col];
      const viewMoreLink = viewMoreCell?.querySelector('a');
      if (viewMoreLink) {
        const vmLink = viewMoreLink.cloneNode(true);
        vmLink.className = 'account-support-view-more';
        vmLink.textContent = viewMoreLink.textContent.trim();
        card.appendChild(vmLink);
      }
    }

    // Divider
    const hr = document.createElement('hr');
    hr.className = 'account-support-divider';
    card.appendChild(hr);

    // Row 5: "Manage" link
    if (rows[5]) {
      const manageCell = rows[5].querySelectorAll(':scope > div')[col];
      const manageLink = manageCell?.querySelector('a');
      if (manageLink) {
        const mLink = manageLink.cloneNode(true);
        mLink.className = 'account-support-manage';
        mLink.textContent = manageLink.textContent.trim();
        card.appendChild(mLink);
      }
    }

    cards.push(card);
  }

  // Replace block content
  block.textContent = '';
  cards.forEach((c) => block.appendChild(c));
}
