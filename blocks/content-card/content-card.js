export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  rows.forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    const card = document.createElement('div');
    card.className = 'content-card-item';

    // First cell with image becomes card image
    const pic = cells[0]?.querySelector('picture');
    if (pic) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'content-card-image';
      imageWrap.append(pic);
      card.append(imageWrap);
      cells.shift();
    }

    // Remaining content
    if (cells.length) {
      const body = document.createElement('div');
      body.className = 'content-card-body';

      cells.forEach((cell) => {
        body.append(...cell.childNodes);
      });

      // Wrap first link as card CTA
      const cta = body.querySelector('a');
      if (cta) {
        cta.classList.add('content-card-link');
        // Make entire card clickable
        card.addEventListener('click', (e) => {
          if (e.target.tagName !== 'A') cta.click();
        });
        card.style.cursor = 'pointer';
      }

      card.append(body);
    }

    row.replaceWith(card);
  });
}
