function isLoggedIn() {
  return !!window.adobeIMS?.isSignedInUser?.();
}

async function fetchPlanData() {
  if (!isLoggedIn()) return null;
  try {
    const token = await window.adobeIMS?.getAccessToken?.();
    if (!token) return null;
    const resp = await fetch('https://commerce.adobe.com/api/plans', { headers: { Authorization: `Bearer ${token.token}` } });
    if (!resp.ok) return null;
    return resp.json();
  } catch {
    return null;
  }
}

function renderPlanCard(plan) {
  const card = document.createElement('div');
  card.className = 'plan-card-item';

  const header = document.createElement('div');
  header.className = 'plan-card-header';

  const name = document.createElement('h4');
  name.className = 'plan-card-name';
  name.textContent = plan.name || plan.productName || 'Your Plan';
  header.append(name);

  if (plan.status) {
    const status = document.createElement('span');
    status.className = `plan-card-status plan-card-status-${plan.status.toLowerCase()}`;
    status.textContent = plan.status;
    header.append(status);
  }

  card.append(header);

  if (plan.renewalDate || plan.nextBillingDate) {
    const renewal = document.createElement('p');
    renewal.className = 'plan-card-renewal';
    renewal.textContent = `Next billing: ${plan.renewalDate || plan.nextBillingDate}`;
    card.append(renewal);
  }

  const actions = document.createElement('div');
  actions.className = 'plan-card-actions';

  const manageBtn = document.createElement('a');
  manageBtn.href = 'https://account.adobe.com/plans';
  manageBtn.className = 'plan-card-btn';
  manageBtn.textContent = 'Manage plan';
  actions.append(manageBtn);

  card.append(actions);
  return card;
}

function renderFallback(el) {
  const container = document.createElement('div');
  container.className = 'plan-card-fallback';

  el.querySelectorAll(':scope > div').forEach((row) => {
    container.append(...row.childNodes);
  });

  el.textContent = '';
  el.append(container);
}

export default async function init(el) {
  if (!isLoggedIn()) {
    renderFallback(el);
    return;
  }

  const planData = await fetchPlanData();
  if (!planData || !planData.plans?.length) {
    renderFallback(el);
    return;
  }

  const container = document.createElement('div');
  container.className = 'plan-card-container';

  planData.plans.forEach((plan) => {
    container.append(renderPlanCard(plan));
  });

  el.textContent = '';
  el.append(container);
}
