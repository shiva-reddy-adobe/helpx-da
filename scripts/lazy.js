function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

function getEnv() {
  const { host } = window.location;
  if (!['--', 'local'].some((check) => host.includes(check))) return 'prod';
  if (host.includes('--')) return 'stage';
  return 'dev';
}

function loadScript(src, attrs = {}) {
  const script = document.createElement('script');
  script.src = src;
  Object.entries(attrs).forEach(([key, val]) => script.setAttribute(key, val));
  document.head.append(script);
  return script;
}

function loadAdobeFonts() {
  loadScript('https://use.typekit.net/wrq2oad.js');
}

function loadAnalytics() {
  const env = getEnv() === 'prod' ? 'prod' : 'stage';
  const launchUrls = {
    prod: 'https://assets.adobedtm.com/d4d114c60e50/a0e989131fd5/launch-5dd5dd2177e6.min.js',
    stage: 'https://assets.adobedtm.com/d4d114c60e50/a0e989131fd5/launch-2c94beadc94f-staging.min.js',
  };
  loadScript(launchUrls[env], { async: '' });
}

function loadIMS() {
  const clientId = 'helpx_thin';
  const imsUrl = 'https://auth.services.adobe.com/imslib/imslib.min.js';
  const script = loadScript(imsUrl);
  script.onload = () => {
    if (!window.adobeIMS) return;
    window.adobeIMS.initialize({ client_id: clientId, scope: 'openid,AdobeID' });
  };
}

function loadAJO() {
  const ajoMeta = getMetadata('ajo');
  if (!ajoMeta || ajoMeta === 'off') return;
  loadScript('https://cdn1.adoberesources.net/alloy/2.19.2/alloy.min.js', { async: '' });
}

(function loadLazy() {
  loadAdobeFonts();
  loadAnalytics();
  loadIMS();
  loadAJO();
}());
