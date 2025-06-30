function getCurrentTheme() {
  const html = document.documentElement;
  const dataScheme = html.getAttribute('data-color-scheme');

  if (dataScheme) {
    return dataScheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-color-scheme', newTheme);
  localStorage.setItem('theme', newTheme);
}

function init() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-color-scheme', saved);
  }
}

init();
