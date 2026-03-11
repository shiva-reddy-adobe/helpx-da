export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'product-hub-container';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    // Check if this is a section heading row (single cell with heading)
    const heading = cells[0]?.querySelector('h2, h3');
    if (heading && cells.length === 1) {
      const section = document.createElement('div');
      section.className = 'product-hub-section-header';
      section.append(heading);
      container.append(section);
      return;
    }

    // Otherwise build a tile card
    const tile = document.createElement('div');
    tile.className = 'product-hub-tile';

    const link = row.querySelector('a');
    const wrapper = link ? document.createElement('a') : document.createElement('div');
    if (link) {
      wrapper.href = link.href;
      wrapper.className = 'product-hub-tile-link';
    }

    const pic = row.querySelector('picture');
    if (pic) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'product-hub-tile-icon';
      iconWrap.append(pic);
      wrapper.append(iconWrap);
    }

    const body = document.createElement('div');
    body.className = 'product-hub-tile-body';

    const tileHeading = row.querySelector('h3, h4, strong');
    if (tileHeading) {
      const title = document.createElement('h4');
      title.className = 'product-hub-tile-title';
      title.textContent = tileHeading.textContent;
      body.append(title);
    }

    // Description text
    const paras = cells[cells.length - 1]?.querySelectorAll('p');
    if (paras) {
      paras.forEach((p) => {
        if (!p.querySelector('a, picture, strong')) {
          const desc = document.createElement('p');
          desc.className = 'product-hub-tile-desc';
          desc.textContent = p.textContent;
          body.append(desc);
        }
      });
    }

    wrapper.append(body);
    tile.append(wrapper);
    container.append(tile);
  });

  el.textContent = '';
  el.append(container);
}
