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
  desktop: 'https://helpx.adobe.com/content/dam/help/devicedropdown/desktop-icon.svg',
  mobile: 'https://helpx.adobe.com/content/dam/help/devicedropdown/mobile-icon.svg',
  web: 'https://helpx.adobe.com/content/dam/help/devicedropdown/web-icon.svg',
};

function buildDeviceSelector(navListEl) {
  const links = [...navListEl.querySelectorAll('a')];
  if (!links.length) return null;

  const currentPath = window.location.pathname;
  const wrapper = document.createElement('div');
  wrapper.className = 'product-badge-devices';

  // Desktop: horizontal tabs
  const tabs = document.createElement('div');
  tabs.className = 'product-badge-device-tabs';

  // Mobile: dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'product-badge-device-dropdown';

  let activeText = '';
  let activeDevice = '';

  links.forEach((link) => {
    const text = link.textContent.trim();
    const device = text.toLowerCase();
    const isActive = new URL(link.href, window.location.origin).pathname === currentPath;

    if (isActive) {
      activeText = text;
      activeDevice = device;
    }

    // Tab item (desktop)
    const tab = document.createElement('a');
    tab.href = link.href;
    tab.className = `product-badge-device-tab${isActive ? ' is-active' : ''}`;
    if (isActive) tab.setAttribute('data-im', 'true');
    const tabIcon = document.createElement('img');
    tabIcon.src = DEVICE_ICONS[device] || '';
    tabIcon.alt = '';
    tabIcon.className = 'product-badge-device-icon';
    tab.append(tabIcon);
    const tabText = document.createElement('span');
    tabText.className = 'product-badge-device-text';
    tabText.textContent = text;
    tab.append(tabText);
    tabs.append(tab);
  });

  // Dropdown button (mobile)
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'product-badge-dropdown-btn';
  if (DEVICE_ICONS[activeDevice]) {
    const btnIcon = document.createElement('img');
    btnIcon.src = DEVICE_ICONS[activeDevice];
    btnIcon.alt = '';
    btnIcon.className = 'product-badge-device-icon';
    button.append(btnIcon);
  }
  const btnText = document.createElement('span');
  btnText.className = 'product-badge-device-text';
  btnText.textContent = activeText || links[0].textContent.trim();
  button.append(btnText);
  const chevron = document.createElement('span');
  chevron.className = 'product-badge-chevron';
  button.append(chevron);

  const list = document.createElement('div');
  list.className = 'product-badge-dropdown-list';

  links.forEach((link) => {
    const text = link.textContent.trim();
    const device = text.toLowerCase();
    const isActive = new URL(link.href, window.location.origin).pathname === currentPath;

    const item = document.createElement('a');
    item.href = link.href;
    item.className = `product-badge-dropdown-item${isActive ? ' is-active' : ''}`;

    const check = document.createElement('span');
    check.className = `product-badge-dropdown-check${isActive ? '' : ' hidden'}`;
    item.append(check);

    if (DEVICE_ICONS[device]) {
      const icon = document.createElement('img');
      icon.src = DEVICE_ICONS[device];
      icon.alt = '';
      icon.className = 'product-badge-device-icon';
      item.append(icon);
    }

    const span = document.createElement('span');
    span.className = 'product-badge-device-text';
    span.textContent = text;
    item.append(span);
    list.append(item);
  });

  button.addEventListener('click', () => {
    const isOpen = list.classList.contains('show');
    list.classList.toggle('show', !isOpen);
    dropdown.classList.toggle('is-open', !isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      list.classList.remove('show');
      dropdown.classList.remove('is-open');
    }
  });

  dropdown.append(button, list);
  wrapper.append(tabs, dropdown);
  return wrapper;
}

function buildSearch() {
  const search = document.createElement('div');
  search.className = 'product-badge-search';

  const container = document.createElement('div');
  container.className = 'product-badge-search-container';

  const form = document.createElement('form');
  form.action = '/search';
  form.method = 'get';
  form.className = 'product-badge-search-form';

  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.className = 'product-badge-search-input';
  input.placeholder = 'Search Adobe Help';
  input.setAttribute('aria-label', 'Search Adobe Help');

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'product-badge-search-submit';
  submitBtn.setAttribute('aria-label', 'Search');

  form.append(input, submitBtn);
  container.append(form);
  search.append(container);
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

  // Col 1: Product badge (icon + name + open app)
  const badge = document.createElement('div');
  badge.className = 'product-badge-info';

  const productLink = OPEN_APP_URLS[productKey] || '#';

  // Product icon
  const iconLink = document.createElement('a');
  iconLink.href = productLink;
  iconLink.className = 'product-badge-icon-link';
  if (pic) {
    const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
    if (img) {
      img.className = 'product-badge-icon';
      img.alt = productName;
      iconLink.append(img);
    }
  } else {
    const iconUrl = PRODUCT_ICONS[productKey];
    if (iconUrl) {
      const img = document.createElement('img');
      img.src = iconUrl;
      img.alt = productName;
      img.className = 'product-badge-icon';
      iconLink.append(img);
    }
  }
  badge.append(iconLink);

  // Product name + Open app
  const openLinkWrap = document.createElement('div');
  openLinkWrap.className = 'product-badge-open-link';

  const nameEl = document.createElement('p');
  nameEl.className = 'product-badge-name';
  const nameLink = document.createElement('a');
  nameLink.href = productLink;
  nameLink.textContent = productName;
  nameEl.append(nameLink);
  openLinkWrap.append(nameEl);

  const openApp = document.createElement('a');
  openApp.href = productLink;
  openApp.className = 'product-badge-open-app';
  const openText = document.createElement('span');
  openText.className = 'product-badge-open-app-text';
  openText.textContent = 'Open app';
  const openIcon = document.createElement('span');
  openIcon.className = 'product-badge-open-app-icon';
  openApp.append(openText, openIcon);
  openLinkWrap.append(openApp);

  badge.append(openLinkWrap);
  topNav.append(badge);

  // Col 2: Device selector (absorbed from navigation-list)
  const navListSection = el.closest('.section')?.nextElementSibling;
  const navListBlock = navListSection?.querySelector('.navigation-list');
  if (navListBlock) {
    const devices = buildDeviceSelector(navListBlock);
    if (devices) topNav.append(devices);
    navListSection.style.display = 'none';
  }

  // Col 3: Search
  topNav.append(buildSearch());

  el.textContent = '';
  el.append(topNav);
}
