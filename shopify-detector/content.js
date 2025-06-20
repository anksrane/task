function isShopifySite() {
    return(
        window.Shopify ||
        document.querySelector('meta[name="shopify-checkout-api-token"]') ||
        document.querySelector('script[src*="cdn.shopify.com"]') ||
        document.documentElement.innerHTML.includes('Shopify.theme')
    );
}

function injectBanner() {
  const banner = document.createElement("div");
  banner.innerText = "Built with Shopify";
  banner.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #95bf47;
    color: white;
    font-size: 16px;
    font-weight: bold;
    padding: 10px;
    text-align: center;
    z-index: 999999;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    font-family: sans-serif;
  `;
  document.body.prepend(banner);
}

window.addEventListener('load', () => {
    const isShopify=isShopifySite();

    if(isShopify){
        injectBanner();
    }

    chrome.runtime.sendMessage({ shopifyDetected: isShopify });
});