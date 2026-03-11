function isImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(url);
}

function getTextSegments(cell) {
  const html = cell.innerHTML;
  const parts = html.split(/<br\s*\/?>/i);
  return parts.map((p) => {
    const temp = document.createElement('div');
    temp.innerHTML = p.trim();
    temp.querySelectorAll('a').forEach((a) => a.remove());
    return temp.textContent.trim();
  }).filter(Boolean);
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const banners = [];
  const isDark = block.classList.contains('dark');

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    cells.forEach((cell) => {
      if (!cell.textContent.trim()) return;

      const banner = document.createElement('div');
      banner.className = 'promo-banner-card';

      const links = [...cell.querySelectorAll('a')];
      const iconLink = links.find((l) => isImageUrl(l.href));
      const ctaLink = links.find((l) => !isImageUrl(l.href));

      if (iconLink) {
        const icon = document.createElement('img');
        icon.src = iconLink.href;
        icon.alt = '';
        icon.className = 'promo-banner-icon';
        banner.appendChild(icon);
      }

      const textWrapper = document.createElement('div');
      textWrapper.className = 'promo-banner-text';

      const segments = getTextSegments(cell);
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

      if (ctaLink) {
        const cta = ctaLink.cloneNode(true);
        cta.className = 'promo-banner-cta';
        banner.appendChild(cta);
      }

      // Apply dark variant per-card if authored with "dark" in the cell class
      // or if the block-level variant is dark
      if (isDark || cell.classList.contains('dark')) {
        banner.classList.add('promo-banner-dark');
      }

      banners.push(banner);
    });
  });

  block.textContent = '';
  banners.forEach((b) => block.appendChild(b));
}
