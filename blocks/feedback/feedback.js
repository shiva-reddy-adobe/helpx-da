/**
 * Feedback block — "Was this page helpful?" widget.
 *
 * Authoring (DA table rows):
 *   Row 0: Question text (e.g. "Was this page helpful?")
 *   Row 1: Yes button label (e.g. "Yes, thanks")
 *   Row 2: No button label (e.g. "Not really")
 *   Row 3: Comment prompt (e.g. "How can we improve?")
 *   Row 4: Comment placeholder (e.g. "Tell us what went wrong...")
 *   Row 5: Submit button label (e.g. "Submit")
 *   Row 6: Thank you message (e.g. "Thank you for your feedback!")
 *
 * All rows are optional — sensible defaults used if omitted.
 */

const HAPPY_SVG = `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
  <circle cx="10" cy="10" r="8.9" fill="#ffd400"/>
  <path d="M8.2 7.7a1 1 0 01-1 1 1.08 1.08 0 01-1-1 1.08 1.08 0 011-1 1.08 1.08 0 011 1" fill="#2c0600"/>
  <path d="M14 7.7a1 1 0 01-1 1 1.08 1.08 0 01-1-1 1.08 1.08 0 011-1 1.08 1.08 0 011 1" fill="#2c0600"/>
  <path d="M14.4 11.3a4.53 4.53 0 01-6 2.6 4.45 4.45 0 01-2.6-2.6" fill="none" stroke="#2c0600" stroke-linecap="round" stroke-width="1.2"/>
</svg>`;

const NEUTRAL_SVG = `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
  <circle cx="10" cy="10" r="8.9" fill="#f29423"/>
  <path d="M8 7.7a1 1 0 11-1-1 1.08 1.08 0 011 1" fill="#2c0600"/>
  <path d="M13.9 7.7a1 1 0 01-1 1 1.08 1.08 0 01-1-1 1.08 1.08 0 011-1 1.08 1.08 0 011 1" fill="#2c0600"/>
  <path d="M13.9 13.3H6.1a.5.5 0 110-1h7.8a.5.5 0 110 1" fill="#2c0600"/>
</svg>`;

const CLOSE_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <path d="M12 4L4 12" stroke="#6e6e6e" stroke-width="2" stroke-linecap="round"/>
  <path d="M4 4L12 12" stroke="#6e6e6e" stroke-width="2" stroke-linecap="round"/>
</svg>`;

function getRowText(rows, index, fallback) {
  return rows[index]?.textContent?.trim() || fallback;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  // Read all strings from authored rows (with defaults)
  const questionText = getRowText(rows, 0, 'Was this page helpful?');
  const yesLabel = getRowText(rows, 1, 'Yes, thanks');
  const noLabel = getRowText(rows, 2, 'Not really');
  const commentPrompt = getRowText(rows, 3, 'How can we improve?');
  const commentPlaceholder = getRowText(rows, 4, 'Tell us what went wrong or how we can improve...');
  const submitLabel = getRowText(rows, 5, 'Submit');
  const thankYouText = getRowText(rows, 6, 'Thank you for your feedback!');

  el.textContent = '';

  const container = document.createElement('div');
  container.className = 'feedback-bar';

  const content = document.createElement('div');
  content.className = 'feedback-content';

  const question = document.createElement('p');
  question.className = 'feedback-question';
  question.textContent = questionText;

  const btnGroup = document.createElement('div');
  btnGroup.className = 'feedback-buttons';

  const yesBtn = document.createElement('button');
  yesBtn.className = 'feedback-btn feedback-yes';
  yesBtn.setAttribute('aria-label', yesLabel);
  yesBtn.innerHTML = HAPPY_SVG;
  const yesText = document.createElement('span');
  yesText.textContent = yesLabel;
  yesBtn.append(yesText);

  const noBtn = document.createElement('button');
  noBtn.className = 'feedback-btn feedback-no';
  noBtn.setAttribute('aria-label', noLabel);
  noBtn.innerHTML = NEUTRAL_SVG;
  const noText = document.createElement('span');
  noText.textContent = noLabel;
  noBtn.append(noText);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'feedback-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = CLOSE_SVG;

  function showThankYou() {
    el.textContent = '';
    const msg = document.createElement('div');
    msg.className = 'feedback-thanks';
    msg.innerHTML = `<p>${thankYouText}</p>`;
    el.append(msg);
    setTimeout(() => el.remove(), 3000);
  }

  function showCommentForm() {
    content.textContent = '';

    const form = document.createElement('div');
    form.className = 'feedback-comment';

    const label = document.createElement('label');
    label.className = 'feedback-label';
    label.textContent = commentPrompt;
    label.setAttribute('for', 'feedback-textarea');

    const textarea = document.createElement('textarea');
    textarea.id = 'feedback-textarea';
    textarea.className = 'feedback-textarea';
    textarea.placeholder = commentPlaceholder;
    textarea.rows = 4;
    textarea.addEventListener('input', () => textarea.classList.remove('is-invalid'));

    const submit = document.createElement('button');
    submit.className = 'feedback-submit';
    submit.textContent = submitLabel;
    submit.addEventListener('click', () => {
      const comment = textarea.value.trim();
      if (!comment) { textarea.classList.add('is-invalid'); return; }
      showThankYou();
    });

    form.append(label, textarea, submit);
    content.append(form);
  }

  yesBtn.addEventListener('click', () => showThankYou());
  noBtn.addEventListener('click', () => showCommentForm());
  closeBtn.addEventListener('click', () => el.remove());

  btnGroup.append(yesBtn, noBtn);
  content.append(question, btnGroup);
  container.append(content, closeBtn);
  el.append(container);
}
