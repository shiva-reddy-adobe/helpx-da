/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

export const [setLibs, getLibs] = (() => {
  let libs;
  return [
    (prodLibs, location) => {
      libs = (() => {
        const { hostname, search } = location || window.location;
        if (!(hostname.includes('.aem.') || hostname.includes('local'))) return prodLibs;
        const branch = new URLSearchParams(search).get('milolibs') || 'main';
        if (branch === 'local') return 'http://localhost:6456/libs';
        return branch.includes('--') ? `https://${branch}.aem.live/libs` : `https://${branch}--milo--adobecom.aem.live/libs`;
      })();
      return libs;
    }, () => libs,
  ];
})();

function decorateArea() {
  const eagerLoad = (parent, selector) => {
    const img = parent.querySelector(selector);
    img?.removeAttribute('loading');
  };

  (async function loadLCPImage() {
    const marquee = document.querySelector('.marquee');
    if (!marquee) {
      eagerLoad(document, 'img');
      return;
    }
    eagerLoad(marquee, 'div:first-child img');
    eagerLoad(marquee, 'div:last-child > div:last-child img');
  }());
}

const STYLES = '/styles/styles.css';

const LIBS = '/libs';

const CONFIG = {
  codeRoot: '',
  prodDomains: ['helpx.adobe.com', 'helpx-internal.adobe.com'],
  imsClientId: 'helpx_thin',
  imsScope: 'AdobeID,openid,gnav',
  decorateArea,
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    ar: { ietf: 'ar', tk: 'hah7vzn.css', dir: 'rtl' },
    bg: { ietf: 'bg-BG', tk: 'hah7vzn.css' },
    cs: { ietf: 'cs-CZ', tk: 'hah7vzn.css' },
    ct: { ietf: 'zh-TW', tk: 'hah7vzn.css' },
    cz: { ietf: 'cs-CZ', tk: 'hah7vzn.css' },
    da: { ietf: 'da-DK', tk: 'hah7vzn.css' },
    de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    el: { ietf: 'el-GR', tk: 'hah7vzn.css' },
    es: { ietf: 'es-ES', tk: 'hah7vzn.css' },
    et: { ietf: 'et-EE', tk: 'hah7vzn.css' },
    fi: { ietf: 'fi-FI', tk: 'hah7vzn.css' },
    fr: { ietf: 'fr-FR', tk: 'hah7vzn.css' },
    he: { ietf: 'he-IL', tk: 'hah7vzn.css', dir: 'rtl' },
    hi: { ietf: 'hi-IN', tk: 'hah7vzn.css' },
    hr: { ietf: 'hr-HR', tk: 'hah7vzn.css' },
    hu: { ietf: 'hu-HU', tk: 'hah7vzn.css' },
    id: { ietf: 'id-ID', tk: 'hah7vzn.css' },
    it: { ietf: 'it-IT', tk: 'hah7vzn.css' },
    ja: { ietf: 'ja-JP', tk: 'hah7vzn.css' },
    ko: { ietf: 'ko-KR', tk: 'zfo3ouc' },
    kr: { ietf: 'ko-KR', tk: 'zfo3ouc' },
    lt: { ietf: 'lt-LT', tk: 'hah7vzn.css' },
    lv: { ietf: 'lv-LV', tk: 'hah7vzn.css' },
    nb: { ietf: 'nb-NO', tk: 'hah7vzn.css' },
    nl: { ietf: 'nl-NL', tk: 'hah7vzn.css' },
    no: { ietf: 'no-NO', tk: 'hah7vzn.css' },
    pl: { ietf: 'pl-PL', tk: 'hah7vzn.css' },
    pt: { ietf: 'pt-BR', tk: 'hah7vzn.css' },
    ro: { ietf: 'ro-RO', tk: 'hah7vzn.css' },
    ru: { ietf: 'ru-RU', tk: 'hah7vzn.css' },
    sk: { ietf: 'sk-SK', tk: 'hah7vzn.css' },
    sl: { ietf: 'sl-SI', tk: 'hah7vzn.css' },
    sr: { ietf: 'sr-RS', tk: 'hah7vzn.css' },
    sv: { ietf: 'sv-SE', tk: 'hah7vzn.css' },
    th: { ietf: 'th-TH', tk: 'hah7vzn.css' },
    tr: { ietf: 'tr-TR', tk: 'hah7vzn.css' },
    uk: { ietf: 'uk-UA', tk: 'hah7vzn.css' },
    vi: { ietf: 'vi-VN', tk: 'hah7vzn.css' },
    zh: { ietf: 'zh-CN', tk: 'hah7vzn.css' },
    'zh-hans': { ietf: 'zh-Hans', tk: 'hah7vzn.css' },
    'zh-hant': { ietf: 'zh-Hant', tk: 'hah7vzn.css' },
    tw: { ietf: 'zh-TW', tk: 'hah7vzn.css' },
  },
};

function applyRtlDirection() {
  const localeKey = Object.keys(CONFIG.locales).find((key) => {
    const { pathname } = window.location;
    return key && pathname.startsWith(`/${key}/`);
  });
  const locale = localeKey ? CONFIG.locales[localeKey] : null;
  if (locale?.dir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  }
}

decorateArea();

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

const miloLibs = setLibs(LIBS);

(function loadStyles() {
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}());

function decorateBrowsingPage() {
  if (!document.body.classList.contains('browsing-page')) return;

  // Wrap h2 + ul + p groups into .two-col-card divs in two-column-cards sections
  document.querySelectorAll('.section.two-column-cards > .default-content-wrapper, .section.two-column-cards > .content').forEach((wrapper) => {
    const children = [...wrapper.children];
    const cards = [];
    let current = null;
    children.forEach((child) => {
      if (child.tagName === 'H2') {
        current = document.createElement('div');
        current.className = 'two-col-card';
        cards.push(current);
      }
      if (current) current.append(child);
    });
    if (cards.length > 1) {
      wrapper.textContent = '';
      cards.forEach((card) => wrapper.append(card));
    }
  });

  // Wrap h2 followed by a p containing only a link into .heading-with-link
  document.querySelectorAll('.section > .default-content-wrapper, .section > .content').forEach((wrapper) => {
    const headings = wrapper.querySelectorAll('h2');
    headings.forEach((h2) => {
      const next = h2.nextElementSibling;
      if (next?.tagName === 'P' && next.children.length === 1 && next.children[0].tagName === 'A') {
        const container = document.createElement('div');
        container.className = 'heading-with-link';
        h2.before(container);
        container.append(h2, next);
      }
    });
  });
}

export async function loadPage() {
  const { loadArea, setConfig } = await import(`${miloLibs}/utils/utils.js`);
  setConfig({ ...CONFIG, miloLibs });
  applyRtlDirection();
  await loadArea();
  decorateBrowsingPage();
  import('./lazy.js');
}
await loadPage();

(function da() {
  const { searchParams } = new URL(window.location.href);
  if (searchParams.has('dapreview')) import('../tools/da/da.js').then((mod) => mod.default(loadPage)); // eslint-disable-line import/no-unresolved
}());
