document.addEventListener("componentLoaded", function(e) {
  if (e.detail && e.detail.path && e.detail.path.endsWith("main.html")) {
    const items = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.2 });
    items.forEach(item => observer.observe(item));
  }
});