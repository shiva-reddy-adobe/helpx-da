export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'known-issues-container';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const issue = document.createElement('div');
    issue.className = 'known-issue-item';

    // Status (first cell: Open/Resolved/Fixed)
    const statusText = cells[0]?.textContent?.trim().toLowerCase() || 'open';
    const statusBadge = document.createElement('span');
    statusBadge.className = `known-issue-status known-issue-status-${statusText}`;
    statusBadge.textContent = cells[0]?.textContent?.trim() || 'Open';

    // Content
    const body = document.createElement('div');
    body.className = 'known-issue-body';

    const heading = cells[1]?.querySelector('h3, h4, strong');
    if (heading) {
      const title = document.createElement('h4');
      title.className = 'known-issue-title';
      title.textContent = heading.textContent;
      body.append(title);
    }

    // Description from remaining content
    const desc = document.createElement('div');
    desc.className = 'known-issue-desc';
    const contentCell = cells[2] || cells[1];
    const paras = contentCell?.querySelectorAll('p');
    if (paras) {
      paras.forEach((p) => {
        if (!p.querySelector('strong')) {
          const clone = p.cloneNode(true);
          desc.append(clone);
        }
      });
    }
    body.append(desc);

    issue.append(statusBadge, body);
    container.append(issue);
  });

  el.textContent = '';
  el.append(container);
}
