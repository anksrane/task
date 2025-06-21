(function () {
  const badgeClass = 'shopify-variant-badge';
  let lastImageSrc = null;

  function removeOldBadge() {
    document.querySelectorAll(`.${badgeClass}`).forEach(b => b.remove());
  }

  function appendBadge(container, colorName) {
    removeOldBadge();
    const badge = document.createElement("div");
    badge.innerText = colorName;
    badge.className = badgeClass;
    badge.style.cssText = `
      position: absolute;
      top: 1%;
      right: 1%;
      background: #f2f3f5;
      color: #000;
      font-size: 14px;
      font-weight: bold;
      padding: 10px;
      text-align: center;
      z-index: 999999;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      font-family: sans-serif;
    `;
    container.style.position = 'relative';
    container.appendChild(badge);
  }

  function getCheckedColor() {
    const checked = document.querySelector('input[type="radio"][name^="Color-"]:checked');
    return checked ? checked.value : null;
  }

  function applyBadgeIfReady() {
    const activeSlide = document.querySelector('li.product__media-item.is-active');
    if (!activeSlide) return;

    const opener = activeSlide.querySelector('[class*="product__modal-opener"]');
    const image = activeSlide.querySelector('img');

    if (!opener || !image) return;

    const colorName = getCheckedColor();

    if (!colorName) return;

    // If image already loaded
    if (image.complete && image.naturalHeight !== 0) {
      if (image.src !== lastImageSrc) {
        lastImageSrc = image.src;
        appendBadge(opener, colorName);
      }
    } else {
      image.addEventListener('load', () => {
        lastImageSrc = image.src;
        appendBadge(opener, colorName);
      }, { once: true });
    }
  }

  function observeDOMChanges() {
    const gallery = document.querySelector('ul.product__media-list');
    if (!gallery) return;

    const observer = new MutationObserver(() => {
      applyBadgeIfReady();
    });

    observer.observe(gallery, { childList: true, subtree: true });
  }

  function observeVariantChanges() {
    const originalPushState = history.pushState;
    history.pushState = function () {
      originalPushState.apply(this, arguments);
      setTimeout(applyBadgeIfReady, 100); // wait for DOM to update
    };

    window.addEventListener('popstate', () => {
      setTimeout(applyBadgeIfReady, 100); // handle back/forward nav
    });
  }

  // ✅ Run on first load too
  setTimeout(applyBadgeIfReady, 500);

  // ✅ Watch for Shopify changes
  observeDOMChanges();
  observeVariantChanges();
})();