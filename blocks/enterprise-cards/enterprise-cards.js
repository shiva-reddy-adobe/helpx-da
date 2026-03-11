function isImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(url);
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    // Each cell in the row is one enterprise card
    cells.forEach((cell, index) => {
      const card = document.createElement('a');
      card.className = 'enterprise-card';

      // Parse cell content: icon-link, BR, heading text, BR, description, BR, CTA link
      const links = [...cell.querySelectorAll('a')];
      const iconLink = links.find((l) => isImageUrl(l.href));
      const ctaLink = links.find((l) => !isImageUrl(l.href));

      if (ctaLink) card.href = ctaLink.href;

      // Icon
      if (iconLink) {
        const icon = document.createElement('img');
        icon.src = iconLink.href;
        icon.alt = '';
        icon.className = 'enterprise-card-icon';
        card.appendChild(icon);
      }

      // Extract text nodes between BRs
      const textParts = [];
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cell.innerHTML;
      // Remove links and get remaining text segments
      tempDiv.querySelectorAll('a').forEach((a) => a.remove());
      const rawText = tempDiv.textContent.trim();
      const segments = rawText.split(/\n/).map((s) => s.trim()).filter(Boolean);

      const textWrapper = document.createElement('div');
      textWrapper.className = 'enterprise-card-text';

      const heading = document.createElement('h3');
      heading.textContent = segments[0] || '';
      textWrapper.appendChild(heading);

      if (segments[1]) {
        const desc = document.createElement('p');
        desc.textContent = segments[1];
        textWrapper.appendChild(desc);
      }

      card.appendChild(textWrapper);

      // Arrow
      const arrow = document.createElement('span');
      arrow.className = 'enterprise-card-arrow';
      arrow.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      card.appendChild(arrow);

      row.appendChild(card);
    });

    // Remove original cells, keep new cards
    cells.forEach((c) => c.remove());
  });
}
