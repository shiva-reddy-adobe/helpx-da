export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const grid = document.createElement('div');
  grid.className = 'browsing-page-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('a');
    card.className = 'browsing-page-card';

    const link = row.querySelector('a');
    if (link) card.href = link.href;

    const pic = row.querySelector('picture');
    if (pic) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'browsing-page-card-image';
      imageWrap.append(pic);
      card.append(imageWrap);
    }

    const body = document.createElement('div');
    body.className = 'browsing-page-card-body';

    const heading = row.querySelector('h2, h3, h4');
    if (heading) {
      const title = document.createElement('h3');
      title.className = 'browsing-page-card-title';
      title.textContent = heading.textContent;
      body.append(title);
    }

    const desc = cells[cells.length - 1];
    if (desc) {
      const paras = desc.querySelectorAll('p');
      paras.forEach((p) => {
        if (!p.querySelector('a') && !p.querySelector('picture')) {
          const text = document.createElement('p');
          text.className = 'browsing-page-card-desc';
          text.textContent = p.textContent;
          body.append(text);
        }
      });
    }

    card.append(body);
    grid.append(card);
  });

  el.textContent = '';
  el.append(grid);
}
