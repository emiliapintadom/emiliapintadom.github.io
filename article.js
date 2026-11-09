// Site language (labels) and the "translate this piece" button for article pages.
(function () {
  const orig = document.body.dataset.orig; // language the piece was written in
  let lang = 'en';
  try { const saved = localStorage.getItem('lang'); if (saved === 'es' || saved === 'en') lang = saved; } catch (e) {}

  const btn = document.getElementById('translate');
  const note = document.getElementById('note');
  const target = orig === 'es' ? 'en' : 'es';
  const labels = {
    en: { en: 'Read in English', es: 'Read in Spanish' },
    es: { en: 'Leer en inglés', es: 'Leer en español' },
  };
  const offline = {
    en: 'Translation works once the site is online.',
    es: 'La traducción funciona cuando el sitio ya está publicado.',
  };

  function render() {
    document.querySelectorAll('[data-en]').forEach(el => { el.textContent = el.dataset[lang]; });
    document.querySelectorAll('[data-set-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.setLang === lang));
    btn.textContent = labels[lang][target] + ' ↻';
  }

  btn.addEventListener('click', () => {
    const host = location.hostname;
    if (location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1') {
      note.textContent = offline[lang]; note.hidden = false; return;
    }
    // Google Translate's page proxy keeps the reader on a translated copy of this page.
    const url = 'https://translate.google.com/translate?sl=' + orig + '&tl=' + target + '&hl=' + lang + '&u=' + encodeURIComponent(location.href);
    location.href = url;
  });

  document.addEventListener('click', e => {
    const l = e.target.closest('[data-set-lang]');
    if (!l) return;
    lang = l.dataset.setLang;
    try { localStorage.setItem('lang', lang); } catch (err) {}
    render();
  });
  render();
})();
