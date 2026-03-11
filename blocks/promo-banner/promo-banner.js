export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row, index) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    if (cells.length >= 3) {
      const iconCell = cells[0];
      const textCell = cells[1];
      const ctaCell = cells[2];

      // Create banner card
      const banner = document.createElement('div');
      banner.className = index === 1 ? 'promo-banner-card promo-banner-dark' : 'promo-banner-card';

      // Create icon
      const iconLink = iconCell.querySelector('a');
      if (iconLink) {
        const icon = document.createElement('img');
        icon.src = iconLink.href;
        icon.alt = '';
        icon.className = 'promo-banner-icon';
        banner.appendChild(icon);
      }

      // Create text wrapper
      const textWrapper = document.createElement('div');
      textWrapper.className = 'promo-banner-text';

      // Parse text content - first strong/bold as heading, rest as description
      const textContent = textCell.innerHTML;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = textContent;

      const heading = document.createElement('h3');
      const strongElem = tempDiv.querySelector('strong');
      if (strongElem) {
        heading.textContent = strongElem.textContent;
        strongElem.remove();
      }

      const description = document.createElement('p');
      description.innerHTML = tempDiv.innerHTML.trim();

      textWrapper.appendChild(heading);
      textWrapper.appendChild(description);
      banner.appendChild(textWrapper);

      // Create CTA button
      const ctaLink = ctaCell.querySelector('a');
      if (ctaLink) {
        ctaLink.className = 'promo-banner-cta';
        banner.appendChild(ctaLink);
      }

      row.replaceWith(banner);
    }
  });
}
