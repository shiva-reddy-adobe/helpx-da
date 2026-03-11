const ICON_BASE = 'https://helpx.adobe.com/content/dam/help/mnemonics';

const ALL_APPS = [
  {
    category: 'Creative Cloud',
    apps: [
      { name: 'Photoshop', icon: `${ICON_BASE}/ps_cc_app_RGB.svg`, href: '/support/photoshop.html' },
      { name: 'Illustrator', icon: `${ICON_BASE}/ai_cc_app_RGB.svg`, href: '/support/illustrator.html' },
      { name: 'Premiere Pro', icon: `${ICON_BASE}/pr_cc_app_RGB.svg`, href: '/support/premiere-pro.html' },
      { name: 'After Effects', icon: `${ICON_BASE}/ae_cc_app_RGB.svg`, href: '/support/after-effects.html' },
      { name: 'Adobe Express', icon: `${ICON_BASE}/cc_express.svg`, href: '/support/express.html' },
      { name: 'Lightroom', icon: `${ICON_BASE}/Lr_cc_appicon_noshadow_2017.svg`, href: '/support/lightroom-cc.html' },
      { name: 'InDesign', icon: `${ICON_BASE}/id_cc_app_RGB.svg`, href: '/support/indesign.html' },
      { name: 'Lightroom Classic', icon: `${ICON_BASE}/Lr_cc_appicon_noshadow_2017.svg`, href: '/support/lightroom-classic.html' },
      { name: 'Firefly', icon: `${ICON_BASE}/firefly_appicon_64_1.svg`, href: '/support/firefly.html' },
      { name: 'Media Encoder', icon: `${ICON_BASE}/me_cc_app_RGB.svg`, href: '/support/media-encoder.html' },
      { name: 'Photoshop Express', icon: `${ICON_BASE}/ps_express_appicon_256.svg`, href: '/support/photoshop-express.html' },
      { name: 'Photoshop Elements', icon: `${ICON_BASE}/ps_elements_appicon_256.svg`, href: '/support/photoshop-elements.html' },
      { name: 'Premiere Elements', icon: `${ICON_BASE}/pr_elements_appicon_256.svg`, href: '/support/premiere-elements.html' },
      { name: 'Premiere Rush', icon: `${ICON_BASE}/ru_cc_app_RGB.svg`, href: '/support/premiere-rush.html' },
      { name: 'Prelude', icon: `${ICON_BASE}/pl_cc_app_RGB.svg`, href: '/support/prelude.html' },
      { name: 'XD', icon: `${ICON_BASE}/xd_cc_app_RGB.svg`, href: '/support/xd.html' },
      { name: 'Animate', icon: `${ICON_BASE}/an_cc_app_RGB.svg`, href: '/support/animate.html' },
      { name: 'Audition', icon: `${ICON_BASE}/au_cc_app_RGB.svg`, href: '/support/audition.html' },
      { name: 'Bridge', icon: `${ICON_BASE}/br_cc_app_RGB.svg`, href: '/support/bridge.html' },
      { name: 'Character Animator', icon: `${ICON_BASE}/ch_cc_app_RGB.svg`, href: '/support/character-animator.html' },
      { name: 'Dimension', icon: `${ICON_BASE}/dn_cc_app_RGB.svg`, href: '/support/dimension.html' },
      { name: 'Dreamweaver', icon: `${ICON_BASE}/dw_cc_app_RGB.svg`, href: '/support/dreamweaver.html' },
      { name: 'Fresco', icon: `${ICON_BASE}/fresco_appicon_256.svg`, href: '/support/adobe-fresco.html' },
      { name: 'InCopy', icon: `${ICON_BASE}/ic_cc_app_RGB.svg`, href: '/support/incopy.html' },
      { name: 'Stock', icon: `${ICON_BASE}/st_app_RGB.svg`, href: '/support/stock.html' },
    ],
  },
  {
    category: 'Substance 3D',
    apps: [
      { name: 'Substance 3D Painter', icon: `${ICON_BASE}/substance_painter_appicon_noshadow_64.svg`, href: '/support/substance-3d-painter.html' },
      { name: 'Substance 3D Designer', icon: `${ICON_BASE}/substance_designer_appicon_noshadow_64.svg`, href: '/support/substance-3d-designer.html' },
      { name: 'Substance 3D Sampler', icon: `${ICON_BASE}/substance_sampler_appicon_noshadow_64.svg`, href: '/support/substance-3d-sampler.html' },
      { name: 'Substance 3D Modeler', icon: `${ICON_BASE}/substance_modeler_appicon_noshadow_64.svg`, href: '/support/substance-3d-modeler.html' },
      { name: 'Substance 3D Stager', icon: `${ICON_BASE}/substance_stager_appicon_noshadow_64.svg`, href: '/support/substance-3d-stager.html' },
    ],
  },
  {
    category: 'PDF & E-signatures',
    apps: [
      { name: 'Acrobat', icon: `${ICON_BASE}/acrobat_dc_app_RGB.svg`, href: '/support/acrobat.html' },
      { name: 'Reader', icon: `${ICON_BASE}/acrobat_reader_dc_appicon_256.svg`, href: '/support/reader.html' },
      { name: 'Acrobat Export PDF', icon: `${ICON_BASE}/acrobat_dc_app_RGB.svg`, href: '/support/acrobat-exportpdf.html' },
      { name: 'Document Cloud', icon: `${ICON_BASE}/dc_appicon_256.svg`, href: '/support/document-cloud.html' },
    ],
  },
];

function buildModal() {
  const dialog = document.createElement('dialog');
  dialog.id = 'apps-grid-modal';
  dialog.className = 'apps-grid-modal';

  const container = document.createElement('div');
  container.className = 'apps-grid-modal-container';

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'apps-grid-modal-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14.25 4.8075L13.1925 3.75L9 7.9425L4.8075 3.75L3.75 4.8075L7.9425 9L3.75 13.1925L4.8075 14.25L9 10.0575L13.1925 14.25L14.25 13.1925L10.0575 9L14.25 4.8075Z" fill="#2c2c2c"/></svg>';
  closeBtn.addEventListener('click', () => dialog.close());

  const content = document.createElement('div');
  content.className = 'apps-grid-modal-content';

  const heading = document.createElement('h2');
  heading.textContent = 'All apps and services';
  content.append(heading);

  ALL_APPS.forEach((cat) => {
    const catTitle = document.createElement('p');
    catTitle.className = 'apps-grid-modal-category';
    catTitle.textContent = cat.category;
    content.append(catTitle);

    const grid = document.createElement('div');
    grid.className = 'apps-grid-modal-grid';

    cat.apps.forEach((app) => {
      const link = document.createElement('a');
      link.className = 'apps-grid-modal-app';
      link.href = app.href;

      const img = document.createElement('img');
      img.src = app.icon;
      img.alt = app.name;
      img.loading = 'lazy';
      img.width = 40;
      img.height = 40;

      const name = document.createElement('span');
      name.className = 'apps-grid-modal-app-name';
      name.textContent = app.name;

      link.append(img, name);
      grid.append(link);
    });

    content.append(grid);
  });

  container.append(closeBtn, content);
  dialog.append(container);

  // Close on backdrop click
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  return dialog;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  el.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'apps-grid-container';

  let dialog;

  rows.forEach((row) => {
    const cells = [...row.children];
    const iconLink = cells[0]?.querySelector('a');
    const pageLink = cells[1]?.querySelector('a');

    if (!pageLink) return;

    const name = pageLink.textContent.trim();
    const isViewAll = !iconLink || !iconLink.href || iconLink.href.includes('about:error');

    if (isViewAll) {
      // "View all" button — opens modal
      const item = document.createElement('div');
      item.className = 'apps-grid-item apps-grid-view-all';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');

      const iconWrap = document.createElement('div');
      iconWrap.className = 'apps-grid-icon';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '36');
      svg.setAttribute('height', '36');
      svg.setAttribute('viewBox', '0 0 36 36');
      svg.setAttribute('fill', 'none');
      svg.innerHTML = `<rect x="4" y="4" width="8" height="8" rx="2" fill="#6e6e6e"/>
        <rect x="14" y="4" width="8" height="8" rx="2" fill="#6e6e6e"/>
        <rect x="24" y="4" width="8" height="8" rx="2" fill="#6e6e6e"/>
        <rect x="4" y="14" width="8" height="8" rx="2" fill="#6e6e6e"/>
        <rect x="14" y="14" width="8" height="8" rx="2" fill="#6e6e6e"/>
        <rect x="24" y="14" width="8" height="8" rx="2" fill="#6e6e6e"/>
        <rect x="4" y="24" width="8" height="8" rx="2" fill="#6e6e6e"/>
        <rect x="14" y="24" width="8" height="8" rx="2" fill="#6e6e6e"/>
        <rect x="24" y="24" width="8" height="8" rx="2" fill="#6e6e6e"/>`;
      iconWrap.append(svg);

      const label = document.createElement('span');
      label.className = 'apps-grid-label';
      label.textContent = name;

      item.append(iconWrap, label);

      // Build modal lazily on first click
      const openModal = () => {
        if (!dialog) {
          dialog = buildModal();
          el.append(dialog);
        }
        dialog.showModal();
      };

      item.addEventListener('click', openModal);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') openModal();
      });

      grid.append(item);
    } else {
      // Regular app item
      const item = document.createElement('a');
      item.className = 'apps-grid-item';
      item.href = pageLink.href;

      const iconWrap = document.createElement('div');
      iconWrap.className = 'apps-grid-icon';

      const img = document.createElement('img');
      img.src = iconLink.href;
      img.alt = name;
      img.loading = 'lazy';
      iconWrap.append(img);

      const label = document.createElement('span');
      label.className = 'apps-grid-label';
      label.textContent = name;

      item.append(iconWrap, label);
      grid.append(item);
    }
  });

  el.append(grid);
}
