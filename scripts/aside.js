document.addEventListener("asideLoaded", () => {
    const sidenav = document.querySelector("nav.bar");
    const toggleBtn = document.querySelector(".icon");

    if (!sidenav || !toggleBtn) {
        console.warn("Sidebar-Elemente nicht gefunden");
        return;
    }

    // Toggle Sidebar (Öffnen/Schließen)
    toggleBtn.addEventListener("click", () => {
        sidenav.classList.toggle("is-active");
        toggleBtn.classList.toggle("is-active");
    });

    // Sidebar generieren und Auto-Close-Listener setzen
    generateSidebarFromComponent();
});

function generateSidebarFromComponent() {
    const component = document.querySelector('#component');
    const sidebar = document.querySelector('#aside nav ul');
    if (!component || !sidebar) return;

    sidebar.innerHTML = ''; // Reset Sidebar

    const headings = component.querySelectorAll('h1, h2, h3');

    headings.forEach((heading, index) => {
        if (!heading.id) heading.id = `headline-${index}`;

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        li.appendChild(a);
        sidebar.appendChild(li);
    });

    // Nach dem Erzeugen der Links Auto-Close-Listener setzen
    setupSidebarAutoClose();
}

function setupSidebarAutoClose() {
    const sidebar = document.querySelector('#aside > nav');
    const links = sidebar?.querySelectorAll('a');

    if (!sidebar || !links) return;

    links.forEach(link => {
        link.addEventListener('click', () => {
            // Nur auf kleinen Screens (z. B. mobile) schließen
            if (window.innerWidth <= 600) {
                sidebar.classList.remove('is-active');
                document.querySelector('.icon')?.classList.remove('is-active');
            }
        });
    });
}

document.addEventListener("scroll", highlightSidebarLink);

function highlightSidebarLink() {
    const headings = document.querySelectorAll('#component h1, #component h2, #component h3');
    const sidebarLinks = document.querySelectorAll('#aside nav ul li a');
    let currentId = "";

    headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom > 80) { // 80px als Offset für Header
            currentId = heading.id;
        }
    });

    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
