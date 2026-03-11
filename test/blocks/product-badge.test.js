import { expect } from '@esm-bundle/chai';

describe('Product Badge', () => {
  it('renders a product badge topnav', async () => {
    // Create section wrapper (simulates Milo section)
    const section = document.createElement('div');
    section.className = 'section';

    const el = document.createElement('div');
    el.className = 'product-badge';
    el.innerHTML = '<div><div><img src="/icons/ps.svg" alt=""></div><div>Photoshop</div></div>';
    section.append(el);
    document.body.append(section);

    const { default: init } = await import('../../blocks/product-badge/product-badge.js');
    init(el);

    expect(el.querySelector('.product-badge-topnav')).to.exist;
    expect(el.querySelector('.product-badge-icon')).to.exist;
    expect(el.querySelector('.product-badge-name').textContent).to.equal('Photoshop');
    expect(el.querySelector('.product-badge-open-app')).to.exist;
    expect(el.querySelector('.product-badge-search')).to.exist;
    section.remove();
  });

  it('absorbs adjacent navigation-list into device dropdown', async () => {
    const section1 = document.createElement('div');
    section1.className = 'section';
    const el = document.createElement('div');
    el.className = 'product-badge';
    el.innerHTML = '<div><div></div><div>Photoshop</div></div>';
    section1.append(el);

    const section2 = document.createElement('div');
    section2.className = 'section';
    const navList = document.createElement('div');
    navList.className = 'navigation-list';
    navList.innerHTML = `
      <div><div><a href="/photoshop/desktop">Desktop</a></div></div>
      <div><div><a href="/photoshop/mobile">Mobile</a></div></div>
      <div><div><a href="/photoshop/web">Web</a></div></div>
    `;
    section2.append(navList);

    document.body.append(section1, section2);

    const { default: init } = await import('../../blocks/product-badge/product-badge.js');
    init(el);

    expect(el.querySelector('.product-badge-device-dropdown')).to.exist;
    expect(el.querySelector('.product-badge-device-button')).to.exist;
    expect(section2.style.display).to.equal('none');
    section1.remove();
    section2.remove();
  });
});
