// Device icons for navigation tabs
const DEVICE_ICONS = {
  desktop: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H2C1.448 2 1 2.448 1 3v8c0 0.552 0.448 1 1 1h5v1H5.5c-0.276 0-0.5 0.224-0.5 0.5S5.224 14 5.5 14h5c0.276 0 0.5-0.224 0.5-0.5S10.776 13 10.5 13H9v-1h5c0.552 0 1-0.448 1-1V3c0-0.552-0.448-1-1-1zm0 9H2V3h12v8z"/></svg>',
  mobile: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11 1H5C4.448 1 4 1.448 4 2v12c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1V2c0-0.552-0.448-1-1-1zm0 12H5V3h6v10zm-3 1.5c-0.414 0-0.75-0.336-0.75-0.75s0.336-0.75 0.75-0.75 0.75 0.336 0.75 0.75-0.336 0.75-0.75 0.75z"/></svg>',
  web: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm5.74 4.5h-2.356c-0.188-1.007-0.502-1.95-0.925-2.771 1.483 0.638 2.685 1.84 3.281 3.271zm-5.49-3.391c0.618 0.841 1.117 1.865 1.428 3.021H6.322c0.311-1.156 0.81-2.18 1.428-3.021zM2.261 9c-0.167-0.32-0.261-0.685-0.261-1.07s0.094-0.75 0.261-1.07h2.489c-0.05 0.349-0.075 0.706-0.075 1.07s0.025 0.721 0.075 1.07H2.261zm0.519 1h2.356c0.188 1.007 0.502 1.95 0.925 2.771-1.483-0.638-2.685-1.84-3.281-3.271zm2.356-5.5H2.78c0.596-1.431 1.798-2.633 3.281-3.271-0.423 0.821-0.737 1.764-0.925 2.771zM8.25 13.891c-0.618-0.841-1.117-1.865-1.428-3.021h2.856c-0.311 1.156-0.81 2.18-1.428 3.021zM9.916 9.93H6.584c-0.054-0.312-0.084-0.637-0.084-0.97s0.03-0.658 0.084-0.97h3.332c0.054 0.312 0.084 0.637 0.084 0.97s-0.03 0.658-0.084 0.97zm0.545 3.841c0.423-0.821 0.737-1.764 0.925-2.771h2.356c-0.596 1.431-1.798 2.633-3.281 3.271zm1.175-3.771c0.05-0.349 0.075-0.706 0.075-1.07s-0.025-0.721-0.075-1.07h2.489c0.167 0.32 0.261 0.685 0.261 1.07s-0.094 0.75-0.261 1.07h-2.489z"/></svg>',
};

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const nav = document.createElement('nav');
  nav.className = 'navigation-list-nav';
  nav.setAttribute('aria-label', 'Page navigation');

  const list = document.createElement('ul');
  list.className = 'navigation-list-items';
  const currentPath = window.location.pathname;

  rows.forEach((row) => {
    const link = row.querySelector('a');
    if (!link) return;

    const li = document.createElement('li');
    li.className = 'navigation-list-item';

    const a = document.createElement('a');
    a.href = link.href;
    a.className = 'navigation-list-link';

    // Detect device type from link text
    const linkText = link.textContent.trim();
    const deviceType = linkText.toLowerCase();
    const iconSvg = DEVICE_ICONS[deviceType] || '';

    if (iconSvg) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'navigation-list-icon';
      iconSpan.innerHTML = iconSvg;
      a.append(iconSpan);
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = linkText;
    a.append(textSpan);

    if (new URL(a.href, window.location.origin).pathname === currentPath) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }

    li.append(a);
    list.append(li);
  });

  nav.append(list);
  el.textContent = '';
  el.append(nav);
}
