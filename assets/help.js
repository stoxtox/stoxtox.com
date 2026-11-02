// Help search runs on this page only: the article list is in the page, nothing is sent anywhere.
const index = JSON.parse(document.getElementById('index').textContent);
const q = document.getElementById('q'), groups = document.getElementById('groups');
const results = document.getElementById('results'), none = document.getElementById('none');
const words = (s) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Each word you type has to start a word in the title or the line under it. Title matches come first.
const find = (text) => {
  const want = words(text);
  return index
    .map((a) => {
      const t = words(a.t), s = words(a.s);
      if (!want.every((w) => t.some((x) => x.startsWith(w)) || s.some((x) => x.startsWith(w)))) return null;
      return { a, score: want.filter((w) => t.some((x) => x.startsWith(w))).length };
    })
    .filter(Boolean)
    .sort((x, y) => y.score - x.score);
};

const show = () => {
  const text = q.value.trim();
  if (!text) { results.hidden = none.hidden = true; groups.hidden = false; return }
  const hits = find(text);
  groups.hidden = true;
  results.hidden = !hits.length;
  none.hidden = !!hits.length;
  results.innerHTML = hits.map(({ a }) => `<li><a href="${a.u}"><span>${esc(a.t)}<small>${esc(a.s)}</small></span></a></li>`).join('');
};
q.addEventListener('input', show);

// A link like /help/?q=import opens with that search.
const asked = new URLSearchParams(location.search).get('q');
if (asked) { q.value = asked; show() }
