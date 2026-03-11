const ASDE_SDK_URL = 'https://prod.adobeccstatic.com/asde/v3.8.1/asde.min.js';
const SEARCH_REDIRECT = '/search.html';

const ASDE_CONFIG = {
  apiVersion: { major: 1, minor: 0, revision: 0 },
  apiKey: 'CCSearchHelpX',
  client: 'Helpx',
  surface: 'CCWeb',
  env: 'prod',
  featureFlags: 'temp_enable_search_history_server,temp_enable_search_auto_suggestion_server_uss,temp_enable_jump_urls,ccsearch_enable_geo_service,ccsearch_enable_sort_dropdown,ccsearch_enable_uss_contextual_parameters,ccsearch_enable_uss_auto_complete_contextual_parameters',
  defaultSelectedTab: 'support',
};

/* Lightweight HostContext for ASDE SDK */
class HelpxHostContext {
  constructor(config) {
    this.config = config;
    this.hostUIState = { tab: config.defaultSelectedTab, folder: '', library: '', routePath: '' };
  }

  get environment() { return this.config.env; }

  get locale() {
    const lang = document.documentElement.lang || 'en';
    return lang.split('-')[0];
  }

  get geoCode() {
    try {
      const loc = sessionStorage.getItem('feds_location');
      if (loc) return JSON.parse(loc).country || null;
    } catch { /* noop */ }
    return null;
  }

  get countryCode() { return null; }

  get hostInfo() {
    return {
      surface: this.config.surface,
      client: this.config.client,
      version: this.config.apiVersion,
      apiKey: this.config.apiKey,
    };
  }

  get userLoggedOut() {
    return !(window.adobeIMS?.isSignedInUser?.());
  }

  get imsInfo() {
    return { authenticated: false };
  }

  get handledResultCategories() { return []; }

  get uiStyling() {
    return {
      overflowX: 'visible',
      overflowY: 'visible',
      styleSpecifier: 'asdeHelpx',
      topOffsetHeight: 0,
      bottomOffsetHeight: 40,
      leftOffsetWidth: 0,
    };
  }

  get featureFlags() {
    const ff = this.config.featureFlags;
    return ff ? ff.split(',').map((f) => f.trim()) : [];
  }

  get showTutorialModal() { return false; }

  get searchDefaultTab() { return this.config.defaultSelectedTab || 'support'; }

  get HostUIState() { return this.hostUIState; }

  getHostUIState() { return this.hostUIState; }

  setHostUIState(tab, folder, library, routePath) {
    this.hostUIState = { tab, folder, library, routePath };
  }

  openURI(uri, sameTab) {
    if (sameTab) window.location.href = uri;
    else window.open(uri, '_blank');
    return true;
  }

  openURISameTab(uri) {
    window.location.href = uri;
    return true;
  }

  canStoreHistory() { return true; }

  search() {
    return Promise.resolve({ resultItems: [], totalResults: 0 });
  }

  analyticsDataFunction() {
    return { analyticData: { source: 'Helpx', componentName: 'AsdeHelpx' } };
  }

  // stubs for WAM-dependent methods
  async isAppLaunchable() { return false; }
  launchApp() {}
  async getProductCTAActions() { return []; }
  async isCCDPresent() { return false; }
  async installApp() {}
  logger() {}
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    if (window.ASDE) { resolve(); return; }
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  el.textContent = '';

  const headingText = rows[0]?.textContent?.trim() || 'Hi, how can we help?';
  const searchPlaceholder = rows[1]?.textContent?.trim() || 'Search Help & Support';
  // Row 2 (optional): background image URL or picture element
  const bgPic = rows[2]?.querySelector('picture, img');
  const bgLink = !bgPic ? rows[2]?.querySelector('a') : null;
  const bgUrl = bgLink?.href || '';
  // Row 3 (optional): search redirect path (default: /search.html)
  const searchRedirect = rows[3]?.textContent?.trim() || SEARCH_REDIRECT;

  // Set usseInfo for ASDE redirect
  window.usseInfo = window.usseInfo || {
    endPoint: 'https://adobesearch.adobe.io/autocomplete/completions',
    apiKey: 'helpxcomprod',
    redirectUrl: searchRedirect,
    autocompleteLocales: 'en,fr,de,ja',
  };

  const container = document.createElement('div');
  container.className = 'hero-banner-container';

  const bg = document.createElement('div');
  bg.className = 'hero-banner-bg';
  if (bgPic) {
    bg.append(bgPic);
  } else if (bgUrl) {
    bg.style.backgroundImage = `url('${bgUrl}')`;
    bg.style.backgroundSize = 'cover';
    bg.style.backgroundPosition = 'center';
  }
  container.append(bg);

  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  const h1 = document.createElement('h1');
  h1.className = 'hero-banner-heading';
  h1.textContent = headingText;
  content.append(h1);

  // ASDE search mount point
  const searchWrap = document.createElement('div');
  searchWrap.className = 'hero-banner-search';

  const searchBarContainer = document.createElement('div');
  searchBarContainer.className = 'searchBar-container';
  searchWrap.append(searchBarContainer);

  content.append(searchWrap);
  container.append(content);
  el.append(container);

  // Load ASDE SDK and mount search bar
  const hostContext = new HelpxHostContext(ASDE_CONFIG);

  const onSubmit = (query) => {
    if (!query) return;
    const q = query.trim();
    const params = new URLSearchParams();
    params.set('q', encodeURIComponent(q));
    params.set('context', encodeURIComponent(window.location.href));
    const redirectUrl = window.usseInfo?.redirectUrl || searchRedirect;
    window.location.href = `${window.location.origin}${redirectUrl}?${params.toString()}`;
  };

  loadScript(ASDE_SDK_URL).then(async () => {
    if (!window.ASDE) return;
    try {
      const response = await window.ASDE.mountSearchBar({
        rootNode: searchBarContainer,
        props: {
          theme: 'light',
          maxLength: '100',
          placeholder: searchPlaceholder,
          onSubmit,
          searchHostContext: hostContext,
        },
      });
      response.initiateSearch();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error mounting ASDE search bar:', e);
    }
  });
}
