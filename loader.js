(function () {
  const startLoaderTimer = () => {
    const loader = document.getElementById('siteLoader');
    if (!loader) return;
    window.setTimeout(() => {
      loader.classList.add('is-hidden');
      window.setTimeout(() => loader.remove(), 350);
    }, 1650);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLoaderTimer, { once: true });
  } else {
    startLoaderTimer();
  }
})();
