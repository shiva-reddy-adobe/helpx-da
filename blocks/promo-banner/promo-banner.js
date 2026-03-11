function isImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(url);
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Single row with multiple cells — each non-empty cell is a promo banner
  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    let bannerIndex = 0;

    cells.forEach((cell) => {
      if (!cell.textContent.trim()) return; // skip empty cells

      const banner = document.createElement('div');
      banner.className = bannerIndex === 1
        ? 'promo-banner-card promo-banner-dark'
        : 'promo-banner-card';

      // Parse cell: optional icon-link, text lines (BR separated), CTA link
      const links = [...cell.querySelectorAll('a')];
      const iconLink = links.find((l) => isImageUrl(l.href));
      const ctaLink = links.find((l) => !isImageUrl(l.href));

      // Icon
      if (iconLink) {
        const icon = document.createElement('img');
        icon.src = iconLink.href;
        icon.alt = '';
        icon.className = 'promo-banner-icon';
        banner.appendChild(icon);
      }

      // Text content
      const textWrapper = document.createElement('div');
      textWrapper.className = 'promo-banner-text';

      // Clone cell, remove links, get text segments
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cell.innerHTML;
      tempDiv.querySelectorAll('a').forEach((a) => a.remove());
      const segments = tempDiv.textContent.split(/\n/).map((s) => s.trim()).filter(Boolean);

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

      banner.appendChild(textWrapper);

      // CTA button
      if (ctaLink) {
        const cta = ctaLink.cloneNode(true);
        cta.className = 'promo-banner-cta';
        banner.appendChild(cta);
      }

      row.appendChild(banner);
      bannerIndex += 1;
    });

    // Remove original cells
    cells.forEach((c) => c.remove());
  });
}
