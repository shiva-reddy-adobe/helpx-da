export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (rows.length < 2) return;

  // First row: comma-separated list of allowed country codes
  const allowedCountries = rows[0]?.textContent?.trim().split(',').map((c) => c.trim().toUpperCase()) || [];

  // Remaining rows: content to show/hide
  const content = document.createElement('div');
  content.className = 'geofencing-content';
  rows.slice(1).forEach((row) => content.append(...row.childNodes));

  el.textContent = '';

  // Check country via CF Worker header (set by Cloudflare)
  // The CF-IPCountry header is typically available via a config endpoint
  const country = document.cookie.match(/geo_country=(\w+)/)?.[1]
    || document.documentElement.dataset.geoCountry
    || '';

  if (!country) {
    // Try fetching from config endpoint
    fetch('/config.json')
      .then((r) => r.json())
      .then((config) => {
        const detectedCountry = config.country || config.geo?.country || '';
        if (allowedCountries.includes(detectedCountry.toUpperCase())) {
          el.append(content);
        }
      })
      .catch(() => {
        // Default: show content if we can't determine country
        el.append(content);
      });
    return;
  }

  if (allowedCountries.includes(country.toUpperCase())) {
    el.append(content);
  }
}
