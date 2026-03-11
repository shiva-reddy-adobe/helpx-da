function createHappyFaceIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('viewBox', '0 0 20 20');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '10');
  circle.setAttribute('cy', '10');
  circle.setAttribute('r', '8.9');
  circle.setAttribute('fill', '#ffd400');

  const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  eye1.setAttribute('d', 'M8.2 7.7a1 1 0 01-1 1 1.08 1.08 0 01-1-1 1.08 1.08 0 011-1 1.08 1.08 0 011 1');
  eye1.setAttribute('fill', '#2c0600');

  const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  eye2.setAttribute('d', 'M14 7.7a1 1 0 01-1 1 1.08 1.08 0 01-1-1 1.08 1.08 0 011-1 1.08 1.08 0 011 1');
  eye2.setAttribute('fill', '#2c0600');

  const smile = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  smile.setAttribute('d', 'M14.4 11.3a4.53 4.53 0 01-6 2.6 4.45 4.45 0 01-2.6-2.6');
  smile.setAttribute('fill', 'none');
  smile.setAttribute('stroke', '#2c0600');
  smile.setAttribute('stroke-linecap', 'round');
  smile.setAttribute('stroke-width', '1.2');

  svg.append(circle, eye1, eye2, smile);
  return svg;
}

function createNeutralFaceIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('viewBox', '0 0 20 20');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '10');
  circle.setAttribute('cy', '10');
  circle.setAttribute('r', '8.9');
  circle.setAttribute('fill', '#f29423');

  const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  eye1.setAttribute('d', 'M8 7.7a1 1 0 11-1-1 1.08 1.08 0 011 1');
  eye1.setAttribute('fill', '#2c0600');

  const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  eye2.setAttribute('d', 'M13.9 7.7a1 1 0 01-1 1 1.08 1.08 0 01-1-1 1.08 1.08 0 011-1 1.08 1.08 0 011 1');
  eye2.setAttribute('fill', '#2c0600');

  const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  mouth.setAttribute('d', 'M13.9 13.3H6.1a.5.5 0 110-1h7.8a.5.5 0 110 1');
  mouth.setAttribute('fill', '#2c0600');

  svg.append(circle, eye1, eye2, mouth);
  return svg;
}

function createCloseIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'none');

  const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  line1.setAttribute('d', 'M12 4L4 12');
  line1.setAttribute('stroke', '#6e6e6e');
  line1.setAttribute('stroke-width', '2');
  line1.setAttribute('stroke-linecap', 'round');

  const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  line2.setAttribute('d', 'M4 4L12 12');
  line2.setAttribute('stroke', '#6e6e6e');
  line2.setAttribute('stroke-width', '2');
  line2.setAttribute('stroke-linecap', 'round');

  svg.append(line1, line2);
  return svg;
}

function createThankYou() {
  const msg = document.createElement('div');
  msg.className = 'feedback-thanks';
  msg.innerHTML = '<p>Thank you for your feedback!</p>';
  return msg;
}

function createCommentForm(el, apiUrl) {
  const form = document.createElement('div');
  form.className = 'feedback-comment';

  const label = document.createElement('label');
  label.className = 'feedback-label';
  label.textContent = 'How can we improve?';
  label.setAttribute('for', 'feedback-textarea');

  const textarea = document.createElement('textarea');
  textarea.id = 'feedback-textarea';
  textarea.className = 'feedback-textarea';
  textarea.placeholder = 'Tell us what went wrong or how we can improve...';
  textarea.rows = 4;

  const submit = document.createElement('button');
  submit.className = 'feedback-submit';
  submit.textContent = 'Submit';
  submit.addEventListener('click', async () => {
    const comment = textarea.value.trim();
    if (!comment) {
      textarea.classList.add('is-invalid');
      return;
    }
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          helpful: false,
          comment,
          page: window.location.pathname,
        }),
      });
    } catch { /* best effort */ }
    el.textContent = '';
    el.append(createThankYou());
  });

  textarea.addEventListener('input', () => textarea.classList.remove('is-invalid'));

  form.append(label, textarea, submit);
  return form;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const apiUrl = rows[0]?.textContent?.trim() || '/api/feedback';

  const container = document.createElement('div');
  container.className = 'feedback-bar';

  const content = document.createElement('div');
  content.className = 'feedback-content';

  const question = document.createElement('p');
  question.className = 'feedback-question';
  question.textContent = 'Was this page helpful?';

  const btnGroup = document.createElement('div');
  btnGroup.className = 'feedback-buttons';

  const yesBtn = document.createElement('button');
  yesBtn.className = 'feedback-btn feedback-yes';
  yesBtn.setAttribute('aria-label', 'Yes, thanks');
  yesBtn.append(createHappyFaceIcon());
  const yesText = document.createElement('span');
  yesText.textContent = 'Yes, thanks';
  yesBtn.append(yesText);

  const noBtn = document.createElement('button');
  noBtn.className = 'feedback-btn feedback-no';
  noBtn.setAttribute('aria-label', 'Not really');
  noBtn.append(createNeutralFaceIcon());
  const noText = document.createElement('span');
  noText.textContent = 'Not really';
  noBtn.append(noText);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'feedback-close';
  closeBtn.setAttribute('aria-label', 'Close feedback');
  closeBtn.append(createCloseIcon());

  yesBtn.addEventListener('click', async () => {
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful: true, page: window.location.pathname }),
      });
    } catch { /* best effort */ }
    el.textContent = '';
    const thankYou = createThankYou();
    el.append(thankYou);
    setTimeout(() => el.remove(), 3000);
  });

  noBtn.addEventListener('click', () => {
    content.textContent = '';
    const commentForm = createCommentForm(el, apiUrl);
    content.append(commentForm);
  });

  closeBtn.addEventListener('click', () => {
    el.remove();
  });

  btnGroup.append(yesBtn, noBtn);
  content.append(question, btnGroup);
  container.append(content, closeBtn);

  el.textContent = '';
  el.append(container);
}
