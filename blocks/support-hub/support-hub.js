function isLoggedIn() {
  return !!window.adobeIMS?.isSignedInUser?.();
}

function renderLoggedOutView(el, rows) {
  const container = document.createElement('div');
  container.className = 'support-hub-content support-hub-logged-out';

  rows.forEach((row) => {
    const section = document.createElement('div');
    section.className = 'support-hub-section';
    section.append(...row.childNodes);
    container.append(section);
  });

  el.append(container);
}

function renderLoggedInView(el, rows) {
  const container = document.createElement('div');
  container.className = 'support-hub-content support-hub-logged-in';

  const greeting = document.createElement('div');
  greeting.className = 'support-hub-greeting';

  const profile = window.adobeIMS?.getProfile?.();
  const name = profile?.displayName || profile?.first_name || 'there';
  const h2 = document.createElement('h2');
  h2.textContent = `Welcome back, ${name}`;
  greeting.append(h2);
  container.append(greeting);

  rows.forEach((row) => {
    const section = document.createElement('div');
    section.className = 'support-hub-section';
    section.append(...row.childNodes);
    container.append(section);
  });

  el.append(container);
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  el.textContent = '';

  if (isLoggedIn()) {
    renderLoggedInView(el, rows);
  } else {
    renderLoggedOutView(el, rows);

    // Re-render when user signs in
    document.addEventListener('IMS:ready', () => {
      if (isLoggedIn()) {
        el.textContent = '';
        renderLoggedInView(el, rows);
      }
    });
  }
}
