function isImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(url);
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  rows.forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    const card = document.createElement('div');
    card.className = 'content-card-item';

    // First cell — check for image (picture, img, or link to image URL)
    const pic = cells[0]?.querySelector('picture, img');
    const imgLink = !pic ? cells[0]?.querySelector('a') : null;
    const hasImage = pic || (imgLink && isImageUrl(imgLink.href));

    if (hasImage) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'content-card-image';

      if (pic) {
        if (pic.tagName === 'IMG') pic.loading = 'lazy';
        imageWrap.append(pic);
      } else if (imgLink) {
        const img = document.createElement('img');
        img.src = imgLink.href;
        img.alt = imgLink.textContent.trim();
        img.loading = 'lazy';
        imageWrap.append(img);
      }

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
        card.addEventListener('click', (e) => {
          if (e.target.tagName !== 'A') cta.click();
        });
        card.style.cursor = 'pointer';
      }

      // For text-only cards (article-card style): wrap link in h4, description in p
      if (!hasImage && cta) {
        const heading = document.createElement('h4');
        heading.className = 'content-card-heading';
        heading.append(cta.cloneNode(true));
        heading.querySelector('a').classList.add('content-card-link');

        // Collect description text after the link (skip <br> elements)
        let descText = '';
        let node = cta.nextSibling;
        const toRemove = [];
        while (node) {
          if (node.nodeType === Node.TEXT_NODE) {
            descText += node.textContent;
          }
          toRemove.push(node);
          node = node.nextSibling;
        }
        toRemove.forEach((n) => n.remove());
        cta.remove();

        body.prepend(heading);
        if (descText.trim()) {
          const desc = document.createElement('p');
          desc.className = 'content-card-desc';
          desc.textContent = descText.trim();
          heading.after(desc);
        }

        // Re-bind click handler to new link
        const newCta = heading.querySelector('a');
        card.onclick = (e) => { if (e.target.tagName !== 'A') newCta.click(); };
      }

      card.append(body);
    }

    row.replaceWith(card);
  });
}
