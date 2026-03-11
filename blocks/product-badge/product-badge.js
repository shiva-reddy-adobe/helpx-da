/*
 * Product Badge TopNav
 * Port of helpx productbadge + productvariation + topNavBar + search
 */

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

const DEVICE_ICON_URLS = {
  desktop: 'https://helpx.adobe.com/content/dam/help/devicedropdown/desktop-icon.svg',
  mobile: 'https://helpx.adobe.com/content/dam/help/devicedropdown/mobile-icon.svg',
  web: 'https://helpx.adobe.com/content/dam/help/devicedropdown/web-icon.svg',
};

function buildProductBadge(productName, productKey, pic) {
  const badge = document.createElement('div');
  badge.className = 'product-badge-info';

  const details = document.createElement('div');
  details.className = 'product-badge-details';

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
  details.append(iconLink);

  // Product name + open app
  const openLink = document.createElement('div');
  openLink.className = 'product-badge-open-link';

  const nameEl = document.createElement('p');
  nameEl.className = 'product-badge-name';
  const nameA = document.createElement('a');
  nameA.href = productLink;
  nameA.textContent = productName;
  nameEl.append(nameA);
  openLink.append(nameEl);

  const openApp = document.createElement('a');
  openApp.href = productLink;
  openApp.className = 'product-badge-open-app';
  const openText = document.createElement('span');
  openText.className = 'product-badge-open-app-text';
  openText.textContent = 'Open app';
  const openIcon = document.createElement('span');
  openIcon.className = 'product-badge-open-app-icon';
  openApp.append(openText, openIcon);
  openLink.append(openApp);

  details.append(openLink);
  badge.append(details);
  return badge;
}

function buildDeviceTabs(links, currentPath) {
  const wrapper = document.createElement('div');
  wrapper.className = 'product-badge-devices';

  const tabs = document.createElement('div');
  tabs.className = 'product-badge-device-tabs';

  links.forEach((link) => {
    const text = link.textContent.trim();
    const device = text.toLowerCase();
    const isActive = new URL(link.href, window.location.origin).pathname === currentPath;

    const tab = document.createElement('a');
    tab.href = link.href;
    tab.className = `product-badge-device-tab${isActive ? ' is-active' : ''}`;

    if (DEVICE_ICON_URLS[device]) {
      const icon = document.createElement('img');
      icon.src = DEVICE_ICON_URLS[device];
      icon.alt = '';
      icon.className = 'product-badge-device-icon';
      tab.append(icon);
    }

    const span = document.createElement('span');
    span.className = 'product-badge-device-text';
    span.textContent = text;
    tab.append(span);
    tabs.append(tab);
  });

  wrapper.append(tabs);
  return wrapper;
}

function buildMobileDeviceDropdown(links, currentPath) {
  const container = document.createElement('div');
  container.className = 'product-badge-mobile-devices';

  const dropdown = document.createElement('div');
  dropdown.className = 'product-badge-device-dropdown';

  const activeLink = links.find((a) => new URL(a.href, window.location.origin).pathname === currentPath);
  const activeText = activeLink?.textContent?.trim() || links[0].textContent.trim();
  const activeDevice = activeText.toLowerCase();

  // Dropdown button
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'product-badge-dropdown-btn';

  if (DEVICE_ICON_URLS[activeDevice]) {
    const icon = document.createElement('img');
    icon.src = DEVICE_ICON_URLS[activeDevice];
    icon.alt = '';
    icon.className = 'product-badge-device-icon';
    button.append(icon);
  }
  const btnText = document.createElement('span');
  btnText.className = 'product-badge-device-text';
  btnText.textContent = activeText;
  button.append(btnText);
  const chevron = document.createElement('span');
  chevron.className = 'product-badge-chevron';
  button.append(chevron);

  // Dropdown list
  const list = document.createElement('div');
  list.className = 'product-badge-dropdown-list';

  links.forEach((link) => {
    const text = link.textContent.trim();
    const device = text.toLowerCase();
    const isActive = new URL(link.href, window.location.origin).pathname === currentPath;

    const item = document.createElement('div');
    item.className = 'product-badge-dropdown-item';

    const a = document.createElement('a');
    a.href = link.href;
    a.className = 'product-badge-dropdown-link';

    const check = document.createElement('span');
    check.className = `product-badge-dropdown-check${isActive ? '' : ' hidden'}`;
    a.append(check);

    if (DEVICE_ICON_URLS[device]) {
      const icon = document.createElement('img');
      icon.src = DEVICE_ICON_URLS[device];
      icon.alt = '';
      icon.className = 'product-badge-device-icon';
      a.append(icon);
    }

    const span = document.createElement('span');
    span.className = 'product-badge-device-text';
    span.textContent = text;
    a.append(span);

    item.append(a);
    list.append(item);
  });

  button.addEventListener('click', () => {
    list.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      list.classList.remove('show');
    }
  });

  dropdown.append(button, list);
  container.append(dropdown);
  return container;
}

function buildSearch() {
  const search = document.createElement('div');
  search.className = 'product-badge-search';

  // ASDE search container (matches production #search-container)
  const container = document.createElement('div');
  container.id = 'search-container';
  container.className = 'no-toggle';
  container.dataset.placeHolderText = 'Search Adobe Help';
  container.dataset.apiVersion = '1.0.0';
  container.dataset.apiKey = 'CCSearchHelpX';
  container.dataset.clientName = 'Helpx';
  container.dataset.surfaceKey = 'CCWeb';
  container.dataset.env = 'prod';

  const searchSection = document.createElement('div');
  searchSection.id = 'search-section';
  container.append(searchSection);

  // Fallback simple search (shown until ASDE loads)
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
  input.setAttribute('autocomplete', 'off');

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'product-badge-search-submit';
  submitBtn.setAttribute('aria-label', 'Search');

  form.append(input, submitBtn);
  container.append(form);

  search.append(container);

  // Load ASDE search library
  loadAsdeSearch(container, form);

  return search;
}

function loadAsdeSearch(container, fallbackForm) {
  window.usseInfo = {
    endPoint: 'https://adobesearch.adobe.io/autocomplete/completions',
    apiKey: 'helpxcomprod',
    redirectUrl: '/search',
    autocompleteLocales: 'en,fr,de,ja',
  };

  const script = document.createElement('script');
  script.src = 'https://prod.adobeccstatic.com/asde/v3.8.1/asde.min.js';
  script.onload = () => {
    // ASDE renders into #search-section, hide fallback form
    if (container.querySelector('#search-section')?.children.length) {
      fallbackForm.style.display = 'none';
    }
  };
  document.head.append(script);
}

function buildActionItems(searchEl) {
  const actions = document.createElement('div');
  actions.className = 'product-badge-actions';

  const searchToggle = document.createElement('button');
  searchToggle.type = 'button';
  searchToggle.className = 'product-badge-action-btn product-badge-search-toggle';
  searchToggle.setAttribute('aria-label', 'Search');
  searchToggle.addEventListener('click', () => {
    searchEl.classList.toggle('active');
  });

  const tocToggle = document.createElement('button');
  tocToggle.type = 'button';
  tocToggle.className = 'product-badge-action-btn product-badge-toc-toggle';
  tocToggle.setAttribute('aria-label', 'Table of Contents');
  tocToggle.setAttribute('aria-expanded', 'false');

  tocToggle.addEventListener('click', () => {
    const tocSection = document.querySelector('.section:has(.toc-nav)');
    if (!tocSection) return;

    const isVisible = tocSection.classList.contains('toc-overlay-open');
    if (isVisible) {
      tocSection.classList.remove('toc-overlay-open');
      tocToggle.setAttribute('aria-expanded', 'false');
      tocToggle.classList.remove('is-active');
      document.body.style.overflow = '';
    } else {
      tocSection.classList.add('toc-overlay-open');
      tocToggle.setAttribute('aria-expanded', 'true');
      tocToggle.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close TOC overlay when clicking outside
  document.addEventListener('click', (e) => {
    const tocSection = document.querySelector('.section.toc-overlay-open');
    if (!tocSection) return;
    if (!tocSection.contains(e.target) && !tocToggle.contains(e.target)) {
      tocSection.classList.remove('toc-overlay-open');
      tocToggle.setAttribute('aria-expanded', 'false');
      tocToggle.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  });

  actions.append(searchToggle, tocToggle);
  return actions;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const cells = [...rows[0].children];
  const pic = cells[0]?.querySelector('picture, img');
  const nameCell = cells[1] || cells[0];
  const productName = nameCell?.textContent?.trim() || '';
  const productKey = productName.toLowerCase().replace(/\s+/g, '-');
  const currentPath = window.location.pathname;

  // Build topnav grid
  const topNav = document.createElement('div');
  topNav.className = 'product-badge-topnav';

  // Col 1: Product badge
  topNav.append(buildProductBadge(productName, productKey, pic));

  // Col 2: Device tabs (from adjacent navigation-list)
  const navListSection = el.closest('.section')?.nextElementSibling;
  const navListBlock = navListSection?.querySelector('.navigation-list');
  let navLinks = [];
  if (navListBlock) {
    navLinks = [...navListBlock.querySelectorAll('a')];
    topNav.append(buildDeviceTabs(navLinks, currentPath));
    navListSection.style.display = 'none';
  }

  // Col 3: Search
  const searchEl = buildSearch();
  topNav.append(searchEl);

  // Action items (search + toc toggle for tablet/phone)
  topNav.append(buildActionItems(searchEl));

  el.textContent = '';
  el.append(topNav);

  // Mobile device dropdown (placed after topnav, outside the grid)
  if (navLinks.length) {
    el.append(buildMobileDeviceDropdown(navLinks, currentPath));
  }
}
