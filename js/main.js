document.addEventListener('DOMContentLoaded', () => {
  // AOS (Animate on Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 550, easing: 'ease-out', once: true, offset: 60 });
  }

  // Plyr video embeds
  if (typeof Plyr !== 'undefined') {
    Plyr.setup('.plyr-video', { youtube: { noCookie: true } });
  }

  // Highlight active nav link
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(link => {
    if (link.getAttribute('href') === page) {
      link.classList.add('active');
    }
  });
});
