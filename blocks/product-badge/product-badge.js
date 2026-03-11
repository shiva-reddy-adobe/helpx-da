const PRODUCT_ICONS = {
  photoshop: 'https://helpx.adobe.com/content/dam/help/mnemonics/ps_cc_app_RGB.svg',
  illustrator: 'https://helpx.adobe.com/content/dam/help/mnemonics/ai_cc_app_RGB.svg',
  'after-effects': 'https://helpx.adobe.com/content/dam/help/mnemonics/ae_cc_app_RGB.svg',
  'premiere-pro': 'https://helpx.adobe.com/content/dam/help/mnemonics/pr_cc_app_RGB.svg',
  lightroom: 'https://helpx.adobe.com/content/dam/help/mnemonics/lr_cc_app_RGB.svg',
  indesign: 'https://helpx.adobe.com/content/dam/help/mnemonics/id_cc_app_RGB.svg',
  'acrobat-pro': 'https://helpx.adobe.com/content/dam/help/mnemonics/dc_appicon_256.svg',
  xd: 'https://helpx.adobe.com/content/dam/help/mnemonics/xd_app_RGB.svg',
  animate: 'https://helpx.adobe.com/content/dam/help/mnemonics/an_cc_app_RGB.svg',
  dreamweaver: 'https://helpx.adobe.com/content/dam/help/mnemonics/dw_cc_app_RGB.svg',
};

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const badge = document.createElement('div');
  badge.className = 'product-badge-container';

  const cells = [...rows[0].children];

  // Icon — check for authored image first, then fall back to known product icons
  const pic = cells[0]?.querySelector('picture, img');
  if (pic) {
    const icon = document.createElement('div');
    icon.className = 'product-badge-icon';
    icon.append(pic);
    badge.append(icon);
  }

  // Product name
  const nameCell = cells[1] || cells[0];
  const productName = nameCell?.textContent?.trim() || '';

  // If no authored icon, try to resolve from known product icons
  if (!pic && productName) {
    const key = productName.toLowerCase().replace(/\s+/g, '-');
    const iconUrl = PRODUCT_ICONS[key];
    if (iconUrl) {
      const icon = document.createElement('div');
      icon.className = 'product-badge-icon';
      const img = document.createElement('img');
      img.src = iconUrl;
      img.alt = `${productName} icon`;
      img.loading = 'lazy';
      icon.append(img);
      badge.append(icon);
    }
  }

  if (productName) {
    const name = document.createElement('span');
    name.className = 'product-badge-name';
    name.textContent = productName;
    badge.append(name);
  }

  el.textContent = '';
  el.append(badge);
}
