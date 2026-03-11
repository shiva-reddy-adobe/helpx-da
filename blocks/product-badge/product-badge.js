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

const OPEN_APP_URLS = {
  photoshop: 'https://www.adobe.com/download/photoshop',
  illustrator: 'https://www.adobe.com/download/illustrator',
  'after-effects': 'https://www.adobe.com/download/aftereffects',
  'premiere-pro': 'https://www.adobe.com/download/premiere',
  lightroom: 'https://www.adobe.com/download/lightroom',
  indesign: 'https://www.adobe.com/download/indesign',
  xd: 'https://www.adobe.com/download/xd',
  animate: 'https://www.adobe.com/download/animate',
  dreamweaver: 'https://www.adobe.com/download/dreamweaver',
};

const DEVICE_ICONS = {
  desktop: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M14 2H2C1.448 2 1 2.448 1 3v8c0 .552.448 1 1 1h5v1H5.5a.5.5 0 000 1h5a.5.5 0 000-1H9v-1h5c.552 0 1-.448 1-1V3c0-.552-.448-1-1-1zm0 9H2V3h12v8z"/></svg>',
  mobile: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11 1H5c-.552 0-1 .448-1 1v12c0 .552.448 1 1 1h6c.552 0 1-.448 1-1V2c0-.552-.448-1-1-1zm0 12H5V3h6v10zm-3 1.5a.75.75 0 110-1.5.75.75 0 010 1.5z"/></svg>',
  web: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm5.74 4.5h-2.356c-.188-1.007-.502-1.95-.925-2.771A5.996 5.996 0 0113.74 5.5zM8.25 2.109c.618.841 1.117 1.865 1.428 3.021H6.322c.311-1.156.81-2.18 1.428-3.021v.001zM2.26 9A4.48 4.48 0 012 7.93c0-.385.094-.75.261-1.07h2.489A8.3 8.3 0 004.675 8c0 .364.025.721.075 1.07H2.261zm.52 1h2.356c.188 1.007.502 1.95.925 2.771A5.996 5.996 0 012.78 10zm2.356-5.5H2.78A5.996 5.996 0 016.06 1.729c-.423.821-.737 1.764-.925 2.771zM8.25 13.89c-.618-.84-1.117-1.864-1.428-3.02h2.856c-.311 1.156-.81 2.18-1.428 3.02zM9.916 9.93H6.584A7.29 7.29 0 016.5 8.96c0-.333.03-.658.084-.97h3.332c.054.312.084.637.084.97s-.03.658-.084.97zm.545 3.841c.423-.821.737-1.764.925-2.771h2.356a5.996 5.996 0 01-3.281 3.271v-.5zm1.175-3.771c.05-.349.075-.706.075-1.07s-.025-.721-.075-1.07h2.489c.167.32.261.685.261 1.07s-.094.75-.261 1.07h-2.489z"/></svg>',
};

function buildDeviceDropdown(navListEl) {
  const links = [...navListEl.querySelectorAll('a')];
  if (!links.length) return null;

  const currentPath = window.location.pathname;
  const dropdown = document.createElement('div');
  dropdown.className = 'product-badge-device-dropdown';

  const activeLink = links.find((a) => new URL(a.href, window.location.origin).pathname === currentPath);
  const activeText = activeLink?.textContent?.trim() || links[0].textContent.trim();
  const activeDevice = activeText.toLowerCase();

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'product-badge-device-button';
  button.innerHTML = `
    ${DEVICE_ICONS[activeDevice] || ''}
    <span class="product-badge-device-text">${activeText}</span>
    <svg class="product-badge-chevron" width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M1.5 3.5L5 7l3.5-3.5"/></svg>
  `;

  const list = document.createElement('div');
  list.className = 'product-badge-device-list';
  list.hidden = true;

  links.forEach((link) => {
    const text = link.textContent.trim();
    const device = text.toLowerCase();
    const isActive = new URL(link.href, window.location.origin).pathname === currentPath;

    const item = document.createElement('a');
    item.href = link.href;
    item.className = `product-badge-device-item${isActive ? ' is-active' : ''}`;
    item.innerHTML = `
      <span class="product-badge-device-check ${isActive ? '' : 'hidden'}">&#10003;</span>
      ${DEVICE_ICONS[device] || ''}
      <span>${text}</span>
    `;
    list.append(item);
  });

  button.addEventListener('click', () => {
    const isOpen = !list.hidden;
    list.hidden = isOpen;
    dropdown.classList.toggle('is-open', !isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      list.hidden = true;
      dropdown.classList.remove('is-open');
    }
  });

  dropdown.append(button, list);
  return dropdown;
}

function buildSearch() {
  const search = document.createElement('div');
  search.className = 'product-badge-search';

  const form = document.createElement('form');
  form.action = '/search';
  form.method = 'get';

  const inputWrap = document.createElement('div');
  inputWrap.className = 'product-badge-search-wrap';

  const searchIcon = document.createElement('span');
  searchIcon.className = 'product-badge-search-icon';
  searchIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10 10l4 4"/></svg>';

  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.className = 'product-badge-search-input';
  input.placeholder = 'Search Adobe Help';
  input.setAttribute('aria-label', 'Search Adobe Help');

  inputWrap.append(searchIcon, input);
  form.append(inputWrap);
  search.append(form);
  return search;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const cells = [...rows[0].children];
  const pic = cells[0]?.querySelector('picture, img');
  const nameCell = cells[1] || cells[0];
  const productName = nameCell?.textContent?.trim() || '';
  const productKey = productName.toLowerCase().replace(/\s+/g, '-');

  const topNav = document.createElement('div');
  topNav.className = 'product-badge-topnav';

  // Left: product details
  const details = document.createElement('div');
  details.className = 'product-badge-details';

  const productLink = OPEN_APP_URLS[productKey] || '#';

  // Icon
  const iconWrap = document.createElement('a');
  iconWrap.href = productLink;
  iconWrap.className = 'product-badge-icon-link';
  if (pic) {
    const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
    if (img) {
      img.className = 'product-badge-icon';
      img.alt = productName;
      iconWrap.append(img);
    }
  } else {
    const iconUrl = PRODUCT_ICONS[productKey];
    if (iconUrl) {
      const img = document.createElement('img');
      img.src = iconUrl;
      img.alt = productName;
      img.className = 'product-badge-icon';
      img.loading = 'lazy';
      iconWrap.append(img);
    }
  }
  details.append(iconWrap);

  // Product name + Open app
  const nameWrap = document.createElement('div');
  nameWrap.className = 'product-badge-name-wrap';

  const name = document.createElement('a');
  name.href = productLink;
  name.className = 'product-badge-name';
  name.textContent = productName;
  nameWrap.append(name);

  const openApp = document.createElement('a');
  openApp.href = productLink;
  openApp.className = 'product-badge-open-app';
  openApp.innerHTML = '<span>Open app</span><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3.5 1.5h7v7M10 2L2 10" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>';
  nameWrap.append(openApp);

  details.append(nameWrap);
  topNav.append(details);

  // Center: device dropdown (absorbed from navigation-list)
  const navListSection = el.closest('.section')?.nextElementSibling;
  const navListBlock = navListSection?.querySelector('.navigation-list');
  if (navListBlock) {
    const dropdown = buildDeviceDropdown(navListBlock);
    if (dropdown) topNav.append(dropdown);
    navListSection.style.display = 'none';
  }

  // Right: search
  topNav.append(buildSearch());

  el.textContent = '';
  el.append(topNav);
}
