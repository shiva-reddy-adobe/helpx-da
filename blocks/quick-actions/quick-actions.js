export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const row = rows[0];
  const cells = [...row.children];

  const banner = document.createElement('div');
  banner.className = 'quick-actions-banner';

  // Icon from first cell — picture, img, or link to image
  const pic = cells[0]?.querySelector('picture, img');
  const imgLink = !pic ? cells[0]?.querySelector('a') : null;
  const hasIcon = pic || (imgLink && /\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(imgLink.href));

  if (hasIcon) {
    const iconWrap = document.createElement('div');
    iconWrap.className = 'quick-actions-icon';
    if (pic) {
      iconWrap.append(pic);
    } else if (imgLink) {
      const img = document.createElement('img');
      img.src = imgLink.href;
      img.alt = imgLink.textContent.trim();
      iconWrap.append(img);
    }
    banner.append(iconWrap);
  }

  // Text content from second cell
  const textCell = cells[1] || cells[0];
  if (textCell) {
    const textWrap = document.createElement('div');
    textWrap.className = 'quick-actions-text';

    // Split on <br> — first part is title, rest is description
    const html = textCell.innerHTML;
    const parts = html.split(/<br\s*\/?>/i);
    if (parts.length > 0) {
      const title = document.createElement('p');
      title.className = 'quick-actions-title';
      title.textContent = parts[0].replace(/<[^>]+>/g, '').trim();
      textWrap.append(title);
    }
    if (parts.length > 1) {
      const desc = document.createElement('p');
      desc.className = 'quick-actions-desc';
      desc.textContent = parts[1].replace(/<[^>]+>/g, '').trim();
      textWrap.append(desc);
    }

    banner.append(textWrap);
  }

  // CTA button
  const ctaBtn = document.createElement('a');
  ctaBtn.className = 'quick-actions-cta';
  ctaBtn.href = '#';
  ctaBtn.textContent = 'Open desktop app';
  banner.append(ctaBtn);

  el.textContent = '';
  el.append(banner);
}
