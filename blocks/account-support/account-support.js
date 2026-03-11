export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    if (cells.length >= 4) {
      const headerCell = cells[0];
      const linksCell = cells[1];
      const viewMoreCell = cells[2];
      const manageCell = cells[3];

      // Create card
      const card = document.createElement('div');
      card.className = 'account-support-card';

      // Create header with icon and heading
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
      heading.textContent = headerCell.textContent.trim();
      // Remove icon link text from heading
      if (iconLink) {
        heading.textContent = heading.textContent.replace(iconLink.textContent, '').trim();
      }
      header.appendChild(heading);

      card.appendChild(header);

      // Create article list
      const articleList = linksCell.querySelector('ul');
      if (articleList) {
        articleList.className = 'account-support-list';
        const listItems = articleList.querySelectorAll('li');
        listItems.forEach((item) => {
          item.className = 'account-support-list-item';
        });
        card.appendChild(articleList);
      }

      // Add view more link
      const viewMoreLink = viewMoreCell.querySelector('a');
      if (viewMoreLink) {
        viewMoreLink.className = 'account-support-view-more';
        const arrow = document.createTextNode(' ›');
        viewMoreLink.appendChild(arrow);
        card.appendChild(viewMoreLink);
      }

      // Add horizontal divider
      const hr = document.createElement('hr');
      hr.className = 'account-support-divider';
      card.appendChild(hr);

      // Add manage link
      const manageLink = manageCell.querySelector('a');
      if (manageLink) {
        manageLink.className = 'account-support-manage';
        const arrow = document.createTextNode(' ›');
        manageLink.appendChild(arrow);
        card.appendChild(manageLink);
      }

      row.replaceWith(card);
    }
  });
}
