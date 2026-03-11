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
  container.className = 'feedback-container';

  const question = document.createElement('p');
  question.className = 'feedback-question';
  question.textContent = 'Was this helpful?';

  const btnGroup = document.createElement('div');
  btnGroup.className = 'feedback-buttons';

  const yesBtn = document.createElement('button');
  yesBtn.className = 'feedback-btn feedback-yes';
  yesBtn.setAttribute('aria-label', 'Yes, this was helpful');
  yesBtn.textContent = 'Yes';

  const noBtn = document.createElement('button');
  noBtn.className = 'feedback-btn feedback-no';
  noBtn.setAttribute('aria-label', 'No, this was not helpful');
  noBtn.textContent = 'No';

  yesBtn.addEventListener('click', async () => {
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful: true, page: window.location.pathname }),
      });
    } catch { /* best effort */ }
    el.textContent = '';
    el.append(createThankYou());
  });

  noBtn.addEventListener('click', () => {
    btnGroup.remove();
    const commentForm = createCommentForm(el, apiUrl);
    container.append(commentForm);
  });

  btnGroup.append(yesBtn, noBtn);
  container.append(question, btnGroup);

  el.textContent = '';
  el.append(container);
}
