// The header steps aside while you read down and comes back when you scroll up.
const bar = document.getElementById('bar');
let lastY = scrollY, queued = false;
const onScroll = () => {
  queued = false;
  const y = scrollY;
  bar.classList.toggle('solid', y > 8);
  if (Math.abs(y - lastY) > 6) { bar.classList.toggle('away', y > lastY && y > 240); lastY = y }
};
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(onScroll) } }, { passive: true });
bar.addEventListener('focusin', () => bar.classList.remove('away'));
onScroll();

// The contents list follows the section you're reading.
const links = new Map([...document.querySelectorAll('.toc a')].map((a) => [a.hash.slice(1), a]));
if (links.size) {
  const reading = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((a) => a.classList.remove('on'));
      links.get(e.target.id)?.classList.add('on');
    }
  }, { rootMargin: '-30% 0px -60% 0px' });
  document.querySelectorAll('article section[id]').forEach((s) => reading.observe(s));
}

// Picking a section on a phone folds the list away.
document.querySelectorAll('.toc-m a').forEach((a) => a.addEventListener('click', () => { a.closest('details').open = false }));
