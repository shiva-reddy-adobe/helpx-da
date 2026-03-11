export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const steps = document.createElement('ol');
  steps.className = 'procedure-steps';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    const li = document.createElement('li');
    li.className = 'procedure-step';

    const content = document.createElement('div');
    content.className = 'procedure-content';
    content.append(...cells[0].childNodes);

    li.append(content);

    // Optional second column for image/illustration
    if (cells[1]) {
      const media = document.createElement('div');
      media.className = 'procedure-media';
      media.append(...cells[1].childNodes);
      li.append(media);
    }

    steps.append(li);
  });

  el.textContent = '';
  el.append(steps);
}
