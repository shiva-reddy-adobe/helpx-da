function isLoggedIn() {
  return !!window.adobeIMS?.isSignedInUser?.();
}

async function fetchWalletData() {
  if (!isLoggedIn()) return null;
  try {
    const token = await window.adobeIMS?.getAccessToken?.();
    if (!token) return null;
    const resp = await fetch('https://commerce.adobe.com/api/wallet', { headers: { Authorization: `Bearer ${token.token}` } });
    if (!resp.ok) return null;
    return resp.json();
  } catch {
    return null;
  }
}

function renderBanner(data) {
  const banner = document.createElement('div');
  banner.className = 'wallet-banner';

  const text = document.createElement('p');
  text.className = 'wallet-text';
  text.textContent = data.message || 'Manage your Adobe subscriptions and payment methods.';
  banner.append(text);

  const link = document.createElement('a');
  link.href = data.actionUrl || 'https://account.adobe.com/';
  link.className = 'wallet-cta';
  link.textContent = data.actionText || 'Manage account';
  banner.append(link);

  return banner;
}

export default async function init(el) {
  if (!isLoggedIn()) {
    el.style.display = 'none';
    return;
  }

  const walletData = await fetchWalletData();
  if (!walletData) {
    el.style.display = 'none';
    return;
  }

  const banner = renderBanner(walletData);
  el.textContent = '';
  el.append(banner);
}
