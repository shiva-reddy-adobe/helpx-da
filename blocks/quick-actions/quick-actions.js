export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'quick-actions-grid';

  rows.forEach((row) => {
    const link = row.querySelector('a');
    if (!link) return;

    const action = document.createElement('a');
    action.href = link.href;
    action.className = 'quick-action-item';

    const pic = row.querySelector('picture, img');
    if (pic) {
      const icon = document.createElement('div');
      icon.className = 'quick-action-icon';
      icon.append(pic);
      action.append(icon);
    }

    const label = document.createElement('span');
    label.className = 'quick-action-label';
    label.textContent = link.textContent;
    action.append(label);

    container.append(action);
  });

  el.textContent = '';
  el.append(container);
}
