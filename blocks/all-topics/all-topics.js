async function fetchTopics(indexUrl) {
  try {
    const resp = await fetch(indexUrl);
    if (!resp.ok) return [];
    const json = await resp.json();
    return json.data || [];
  } catch {
    return [];
  }
}

function groupByTag(items) {
  const groups = {};
  items.forEach((item) => {
    const tags = item.tags ? item.tags.split(',').map((t) => t.trim()) : ['Other'];
    tags.forEach((tag) => {
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push(item);
    });
  });
  return groups;
}

export default async function init(el) {
  const link = el.querySelector('a');
  const indexUrl = link?.href || '/articles/query-index.json';

  const items = await fetchTopics(indexUrl);
  if (!items.length) return;

  const groups = groupByTag(items);
  const container = document.createElement('div');
  container.className = 'all-topics-container';

  Object.keys(groups).sort().forEach((tag) => {
    const section = document.createElement('div');
    section.className = 'all-topics-section';

    const heading = document.createElement('h3');
    heading.className = 'all-topics-heading';
    heading.textContent = tag;
    section.append(heading);

    const list = document.createElement('ul');
    list.className = 'all-topics-list';

    groups[tag].forEach((item) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.path;
      a.className = 'all-topics-link';
      a.textContent = item.title;
      li.append(a);
      list.append(li);
    });

    section.append(list);
    container.append(section);
  });

  el.textContent = '';
  el.append(container);
}
