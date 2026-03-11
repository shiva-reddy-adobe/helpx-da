const ICON_FALLBACKS = {
  acrobat: 'https://helpx.adobe.com/content/dam/help/mnemonics/acrobat_dc_app_RGB.svg',
  stock: 'https://helpx.adobe.com/content/dam/help/mnemonics/st_app_RGB.svg',
  firefly: 'https://helpx.adobe.com/content/dam/help/mnemonics/firefly_appicon_64_1.svg',
  'adobe express': 'https://helpx.adobe.com/content/dam/help/mnemonics/cc_express.svg',
  illustrator: 'https://helpx.adobe.com/content/dam/help/mnemonics/ai_cc_app_RGB.svg',
  photoshop: 'https://helpx.adobe.com/content/dam/help/mnemonics/ps_cc_app_RGB.svg',
  'premiere pro': 'https://helpx.adobe.com/content/dam/help/mnemonics/pr_cc_app_RGB.svg',
  'after effects': 'https://helpx.adobe.com/content/dam/help/mnemonics/ae_cc_app_RGB.svg',
  lightroom: 'https://helpx.adobe.com/content/dam/help/mnemonics/Lr_cc_app_noshadow_RGB.svg',
  indesign: 'https://helpx.adobe.com/content/dam/help/mnemonics/id_cc_app_RGB.svg',
  xd: 'https://helpx.adobe.com/content/dam/help/mnemonics/xd_app_RGB_2017.svg',
  animate: 'https://helpx.adobe.com/content/dam/help/mnemonics/an_app_RGB.svg',
  dreamweaver: 'https://helpx.adobe.com/content/dam/help/mnemonics/dw_cc_app_RGB.svg',
  fresco: 'https://helpx.adobe.com/content/dam/help/mnemonics/fr_cc_app_RGB.svg',
  dimension: 'https://helpx.adobe.com/content/dam/help/mnemonics/dn_appicon_256.svg',
  audition: 'https://helpx.adobe.com/content/dam/help/mnemonics/au_cc_app_RGB.svg',
};

function createAllAppsIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '48');
  svg.setAttribute('height', '48');
  svg.setAttribute('viewBox', '0 0 48 48');
  svg.setAttribute('fill', 'none');

  const positions = [
    { x: 8, y: 8 }, { x: 20, y: 8 }, { x: 32, y: 8 },
    { x: 8, y: 20 }, { x: 20, y: 20 }, { x: 32, y: 20 },
    { x: 8, y: 32 }, { x: 20, y: 32 }, { x: 32, y: 32 },
  ];

  positions.forEach((pos) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', pos.x);
    rect.setAttribute('y', pos.y);
    rect.setAttribute('width', '8');
    rect.setAttribute('height', '8');
    rect.setAttribute('rx', '2');
    rect.setAttribute('fill', '#6e6e6e');
    svg.append(rect);
  });

  return svg;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'popular-apps-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const link = row.querySelector('a');
    const img = row.querySelector('img, picture');
    const links = row.querySelectorAll('a');
    // First link might be an image URL, second link is the actual navigation link
    const imgLink = links.length > 0 && /\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(links[0].href) ? links[0] : null;
    const navLink = imgLink && links.length > 1 ? links[1] : (link || null);
    if (!navLink && !img && !imgLink) return;

    const item = document.createElement('a');
    item.className = 'popular-apps-item';
    item.href = navLink ? navLink.href : '#';

    if (img) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'popular-apps-icon';
      iconWrap.append(img);
      item.append(iconWrap);
    } else if (imgLink) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'popular-apps-icon';
      const imgEl = document.createElement('img');
      imgEl.src = imgLink.href;
      imgEl.alt = imgLink.textContent.trim();
      const appName = (navLink?.textContent || imgLink.textContent).trim().toLowerCase();
      imgEl.onerror = () => {
        const fallback = ICON_FALLBACKS[appName];
        if (fallback && imgEl.src !== fallback) {
          imgEl.src = fallback;
        }
      };
      iconWrap.append(imgEl);
      item.append(iconWrap);
    }

    const label = document.createElement('span');
    label.className = 'popular-apps-label';
    label.textContent = navLink ? navLink.textContent.trim() : cells[cells.length - 1]?.textContent?.trim() || '';
    item.append(label);

    grid.append(item);
  });

  // Add "All apps" item at the end
  const allAppsItem = document.createElement('a');
  allAppsItem.className = 'popular-apps-item';
  allAppsItem.href = 'https://www.adobe.com/creativecloud/all-apps.html';

  const allAppsIconWrap = document.createElement('div');
  allAppsIconWrap.className = 'popular-apps-icon popular-apps-icon-grid';
  allAppsIconWrap.append(createAllAppsIcon());
  allAppsItem.append(allAppsIconWrap);

  const allAppsLabel = document.createElement('span');
  allAppsLabel.className = 'popular-apps-label';
  allAppsLabel.textContent = 'All apps';
  allAppsItem.append(allAppsLabel);

  grid.append(allAppsItem);

  el.textContent = '';
  el.append(grid);
}
