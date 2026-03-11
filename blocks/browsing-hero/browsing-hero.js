/*
 * Browsing Hero Block
 * Port of helpx productHubV2 hero banner.
 *
 * Authored as a table in DA:
 *   Row 1: Background image (picture element or image URL)
 *   Row 2: col1 = device label (e.g. "Desktop"), col2 = product title (e.g. "Photoshop Help")
 *
 * The product icon is automatically pulled from the product-badge block on the page.
 * If no background image is authored, a default gradient is used.
 */
export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // Row 0: background image
  const bgRow = rows[0];
  const pic = bgRow?.querySelector('picture');
  const bgImg = bgRow?.querySelector('img');
  const bgLink = !pic && !bgImg ? bgRow?.querySelector('a') : null;

  // Row 1: device label + product title
  const labelRow = rows[1];
  const cells = labelRow ? [...labelRow.children] : [];
  const deviceLabel = cells[0]?.textContent?.trim() || '';
  const productTitle = cells[1]?.textContent?.trim() || '';

  // Product icon from product-badge on the page
  const badgeIcon = document.querySelector('.product-badge-icon');
  const iconSrc = badgeIcon?.src || '';
  const iconAlt = badgeIcon?.alt || productTitle;

  // Build hero DOM
  const hero = document.createElement('div');
  hero.className = 'browsing-hero-container';

  const bg = document.createElement('div');
  bg.className = 'browsing-hero-bg';

  if (pic) {
    bg.append(pic);
  } else if (bgImg) {
    bg.append(bgImg);
  } else if (bgLink) {
    const img = document.createElement('img');
    img.src = bgLink.href;
    img.alt = '';
    img.loading = 'eager';
    bg.append(img);
  }

  const content = document.createElement('div');
  content.className = 'browsing-hero-content';

  if (deviceLabel) {
    const device = document.createElement('span');
    device.className = 'browsing-hero-device';
    device.textContent = deviceLabel;
    content.append(device);
  }

  const title = document.createElement('div');
  title.className = 'browsing-hero-title';

  if (iconSrc) {
    const icon = document.createElement('img');
    icon.className = 'browsing-hero-icon';
    icon.src = iconSrc;
    icon.alt = iconAlt;
    title.append(icon);
  }

  const titleText = document.createElement('span');
  titleText.textContent = productTitle;
  title.append(titleText);
  content.append(title);

  hero.append(bg, content);

  el.textContent = '';
  el.append(hero);
}
