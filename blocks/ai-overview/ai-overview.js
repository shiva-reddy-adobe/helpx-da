export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'ai-overview-container';

  const badge = document.createElement('div');
  badge.className = 'ai-overview-badge';
  badge.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1L10 6L15 7L11 11L12 16L8 13L4 16L5 11L1 7L6 6Z" fill="currentColor"/></svg><span>AI Overview</span>';
  container.append(badge);

  const content = document.createElement('div');
  content.className = 'ai-overview-content';

  rows.forEach((row) => {
    content.append(...row.childNodes);
  });

  container.append(content);

  // Feedback buttons
  const feedback = document.createElement('div');
  feedback.className = 'ai-overview-feedback';

  const helpfulBtn = document.createElement('button');
  helpfulBtn.className = 'ai-overview-fb-btn';
  helpfulBtn.setAttribute('aria-label', 'This was helpful');
  helpfulBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7V13H4V7H2ZM7 1C6.45 1 6 1.45 6 2V6H2.5L5.5 13H12L14 7V2C14 1.45 13.55 1 13 1H7Z" fill="currentColor"/></svg>';

  const notHelpfulBtn = document.createElement('button');
  notHelpfulBtn.className = 'ai-overview-fb-btn';
  notHelpfulBtn.setAttribute('aria-label', 'This was not helpful');
  notHelpfulBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" style="transform:rotate(180deg)"><path d="M2 7V13H4V7H2ZM7 1C6.45 1 6 1.45 6 2V6H2.5L5.5 13H12L14 7V2C14 1.45 13.55 1 13 1H7Z" fill="currentColor"/></svg>';

  [helpfulBtn, notHelpfulBtn].forEach((btn) => {
    btn.addEventListener('click', () => {
      feedback.textContent = '';
      const thanks = document.createElement('span');
      thanks.className = 'ai-overview-fb-thanks';
      thanks.textContent = 'Thanks for your feedback';
      feedback.append(thanks);
    });
  });

  feedback.append(helpfulBtn, notHelpfulBtn);
  container.append(feedback);

  el.textContent = '';
  el.append(container);
}
