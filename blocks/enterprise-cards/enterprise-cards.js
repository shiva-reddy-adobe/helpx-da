function isImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(url);
}

function getTextSegments(cell) {
  // Split cell content by <br> tags to get text segments
  const html = cell.innerHTML;
  const parts = html.split(/<br\s*\/?>/i);
  return parts.map((p) => {
    const temp = document.createElement('div');
    temp.innerHTML = p.trim();
    // Remove link elements to get pure text
    temp.querySelectorAll('a').forEach((a) => a.remove());
    return temp.textContent.trim();
  }).filter(Boolean);
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const cards = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    cells.forEach((cell) => {
      if (!cell.textContent.trim()) return;

      const card = document.createElement('a');
      card.className = 'enterprise-card';

      const links = [...cell.querySelectorAll('a')];
      const iconLink = links.find((l) => isImageUrl(l.href));
      const ctaLink = links.find((l) => !isImageUrl(l.href));

      if (ctaLink) card.href = ctaLink.href;

      if (iconLink) {
        const icon = document.createElement('img');
        icon.src = iconLink.href;
        icon.alt = '';
        icon.className = 'enterprise-card-icon';
        card.appendChild(icon);
      }

      const segments = getTextSegments(cell);
      const textWrapper = document.createElement('div');
      textWrapper.className = 'enterprise-card-text';

      if (segments[0]) {
        const heading = document.createElement('h3');
        heading.textContent = segments[0];
        textWrapper.appendChild(heading);
      }
      if (segments[1]) {
        const desc = document.createElement('p');
        desc.textContent = segments[1];
        textWrapper.appendChild(desc);
      }

      card.appendChild(textWrapper);

      const arrow = document.createElement('span');
      arrow.className = 'enterprise-card-arrow';
      arrow.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      card.appendChild(arrow);

      cards.push(card);
    });
  });

  block.textContent = '';
  cards.forEach((c) => block.appendChild(c));
}
