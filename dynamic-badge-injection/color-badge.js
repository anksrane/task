(function () {
  const badgeClass = 'shopify-variant-badge';
  let lastImageSrc = null;
  let lastLabel = null;

  function removeOldBadge() {
    document.querySelectorAll(`.${badgeClass}`).forEach(b => b.remove());
  }

  function appendBadge(container, label) {
    let badge = container.querySelector(`.${badgeClass}`);

    if (badge) {
      // Only update text if it's different
      if (badge.innerText !== label) {
        badge.innerText = label;
      }
      return;
    }

    // Else, create a new badge
    badge = document.createElement("div");
    badge.innerText = label;
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
      max-width: 200px;
      word-wrap: break-word;
    `;
    container.style.position = 'relative';
    container.appendChild(badge);
  }

  function getAllCheckedRadioLabels() {
    const labels = [];
    const seenNames = new Set();

    const checkedRadios = document.querySelectorAll('input[type="radio"]:checked');

    checkedRadios.forEach(radio => {
      const name = radio.name;

      if (seenNames.has(name)) return; // skip if we've seen this group
      seenNames.add(name);

      const label = document.querySelector(`label[for="${radio.id}"]`);
      if (label) {
        labels.push(label.innerText.trim());
      } else {
        labels.push(radio.value.trim());
      }
    });

    return labels.join(' - ');
  }


  function applyBadgeIfReady() {
    const activeSlide = document.querySelector('li.product__media-item.is-active');
    if (!activeSlide) return;

    const opener = activeSlide.querySelector('[class*="product__modal-opener"]');
    const image = activeSlide.querySelector('img');

    if (!opener || !image) return;

    const label = getAllCheckedRadioLabels();
    if (!label) return;

    if (image.complete && image.naturalHeight !== 0) {
      const isNewImage = image.src !== lastImageSrc;
      const isNewLabel = label !== lastLabel;

      if (isNewImage || isNewLabel) {
        lastImageSrc = image.src;
        lastLabel = label;
        appendBadge(opener, label);
      }
    } else {
      image.addEventListener('load', () => {
        lastImageSrc = image.src;
        appendBadge(opener, label);
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
      setTimeout(applyBadgeIfReady, 100);
    };

    window.addEventListener('popstate', () => {
      setTimeout(applyBadgeIfReady, 100);
    });
  }

  // ✅ Run on first load
  setTimeout(applyBadgeIfReady, 500);

  // ✅ Watch Shopify mutations
  observeDOMChanges();
  observeVariantChanges();
})();
