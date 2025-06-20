console.log("Service worker loaded");
chrome.runtime.onMessage.addListener((message, sender) => {
    console.log("Received message:", message, sender);

  if (sender.tab && typeof message.shopifyDetected === "boolean") {
    const iconPrefix = message.shopifyDetected ? "icon-shopify" : "icon-default";
    chrome.action.setIcon({
      tabId: sender.tab.id,
      path: {
        "16": `${iconPrefix}-16.png`,
        "48": `${iconPrefix}-48.png`,
        "128": `${iconPrefix}-128.png`
      }
    });
  }
});