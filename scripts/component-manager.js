// Routing-Tabelle: definiert, welche Hashes eine Komponente laden
const componentRoutes = {
  start: 'components/main.html',
  about: 'components/about.html',
  kontakt: 'components/kontakt.html',
  impressum: 'components/impressum.html',
  datenschutz: 'components/datenschutz.html'
};

// Lädt HTML-Datei in Ziel-Container und triggert Event
async function loadComponent(selector, path, onLoadCallback) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(res.statusText);
    const html = await res.text();
    document.querySelector(selector).innerHTML = html;

    if (typeof onLoadCallback === "function") {
      onLoadCallback();
    }

    const eventName = selector.replace("#", "") + "Loaded";
    document.dispatchEvent(new CustomEvent(eventName, { detail: { path } }));
  } catch (err) {
    console.error("Fehler beim Laden der Komponente:", path, err);
    document.querySelector(selector).innerHTML = `<div style="color:red">Fehler beim Laden: ${path}</div>`;
  }
}

// Lädt Komponente basierend auf dem Hash (wenn er in der Route-Map steht)
function loadComponentFromHash() {
  const hash = location.hash.replace('#', '') || 'start';
  if (componentRoutes.hasOwnProperty(hash)) {
    const path = componentRoutes[hash];
    loadComponent('#component', path);
    window.scrollTo(0, 0);
  }
  // Sonst nichts tun (interner Anchor)
}

// Markiert aktiven Navigationslink im Header
function updateActiveNavLink() {
  const current = location.hash || '#start';
  document.querySelectorAll('header nav a, footer nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === current);
  });
}

// Initiale Komponenten laden
loadComponent('#header', 'components/header.html');
loadComponent('#aside', 'components/aside.html', () => {
    // Optionales Laden von aside.js hier
    if (typeof setupSidebarAutoClose === "function") {
        setupSidebarAutoClose();
    }
});

loadComponent('#footer', 'components/footer.html');

// Wenn #component geladen wurde, Sidebar generieren (falls vorhanden)
document.addEventListener("componentLoaded", () => {
  if (typeof generateSidebarFromComponent === "function") {
    generateSidebarFromComponent();
  } else {
    console.warn("generateSidebarFromComponent ist nicht definiert.");
  }
});

// Routing bei Hashwechsel – aber nur wenn gültiger Seitenname
window.addEventListener('hashchange', () => {
  const hash = location.hash.replace('#', '');
  if (componentRoutes.hasOwnProperty(hash)) {
    loadComponentFromHash();
    updateActiveNavLink();
  }
});

// Beim Start: initialen Hash verarbeiten
window.addEventListener('DOMContentLoaded', () => {
  loadComponentFromHash();
  updateActiveNavLink();
});
