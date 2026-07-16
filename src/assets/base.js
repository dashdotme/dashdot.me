function toggleTheme() {
  const current = document.documentElement.getAttribute('data-color-scheme');
  const currentTheme = current || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-color-scheme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// The initial theme is applied by an inline <head> script (before first
// paint); toggleTheme handles changes from here.

// Section filter for the home index. Graceful: with no JS, everything shows.
function initFilter() {
  const options = document.querySelectorAll('.segmented-option');
  if (!options.length) return;

  const sectioned = document.querySelectorAll('[data-section]');
  const yearGroups = document.querySelectorAll('.year-group');
  const VALID = ['all', 'technical', 'personal'];

  function apply(value, updateHash) {
    if (!VALID.includes(value)) value = 'all';

    options.forEach((opt) => {
      const active = opt.dataset.filter === value;
      opt.classList.toggle('is-active', active);
      opt.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    sectioned.forEach((el) => {
      el.hidden = !(value === 'all' || el.dataset.section === value);
    });

    // hide a year heading when the filter empties its group
    yearGroups.forEach((group) => {
      const anyVisible = group.querySelector('.post-row:not([hidden])');
      group.hidden = !anyVisible;
    });

    if (updateHash) {
      history.replaceState(null, '', value === 'all' ? location.pathname : '#' + value);
    }
  }

  document.querySelectorAll('[data-filter]').forEach((control) => {
    control.addEventListener('click', (e) => {
      if (control.tagName === 'A') e.preventDefault();
      apply(control.dataset.filter, true);
    });
  });

  apply((location.hash || '').replace('#', ''), false);
}

function initYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = year; });
}

document.addEventListener('DOMContentLoaded', () => {
  initFilter();
  initYear();
});
