export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const cards = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    cells.forEach((cell) => {
      if (!cell.textContent.trim()) return;

      const card = document.createElement('a');
      card.className = 'explore-card';

      const link = cell.querySelector('a');
      if (link) {
        card.href = link.href;

        const extIcon = document.createElement('span');
        extIcon.className = 'explore-card-icon';
        extIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667M12.5 2.5H17.5M17.5 2.5V7.5M17.5 2.5L8.33333 11.6667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        card.appendChild(extIcon);

        const heading = document.createElement('h3');
        heading.textContent = link.textContent.trim();
        card.appendChild(heading);
      }

      // Get description: split by <br> and take text after the link
      const html = cell.innerHTML;
      const parts = html.split(/<br\s*\/?>/i);
      const descParts = parts.slice(1).map((p) => {
        const temp = document.createElement('div');
        temp.innerHTML = p.trim();
        temp.querySelectorAll('a').forEach((a) => a.remove());
        return temp.textContent.trim();
      }).filter(Boolean);

      if (descParts.length) {
        const desc = document.createElement('p');
        desc.textContent = descParts.join(' ');
        card.appendChild(desc);
      }

      cards.push(card);
    });
  });

  block.textContent = '';
  cards.forEach((c) => block.appendChild(c));
}
