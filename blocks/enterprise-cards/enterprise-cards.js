export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    if (cells.length >= 4) {
      const iconCell = cells[0];
      const headingCell = cells[1];
      const descriptionCell = cells[2];
      const linkCell = cells[3];

      // Create card
      const card = document.createElement('a');
      card.className = 'enterprise-card';

      const destinationLink = linkCell.querySelector('a');
      if (destinationLink) {
        card.href = destinationLink.href;
      }

      // Create icon
      const iconLink = iconCell.querySelector('a');
      if (iconLink) {
        const icon = document.createElement('img');
        icon.src = iconLink.href;
        icon.alt = '';
        icon.className = 'enterprise-card-icon';
        card.appendChild(icon);
      }

      // Create text wrapper
      const textWrapper = document.createElement('div');
      textWrapper.className = 'enterprise-card-text';

      const heading = document.createElement('h3');
      heading.textContent = headingCell.textContent.trim();
      textWrapper.appendChild(heading);

      const description = document.createElement('p');
      description.textContent = descriptionCell.textContent.trim();
      textWrapper.appendChild(description);

      card.appendChild(textWrapper);

      // Create arrow SVG
      const arrow = document.createElement('span');
      arrow.className = 'enterprise-card-arrow';
      arrow.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      card.appendChild(arrow);

      row.replaceWith(card);
    }
  });
}
