function main() {
  let openerTab = null;
  let hasIgnoreWrong = false;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "open-completed-form") {
      const contentScriptPath = "content-scripts/completed-form.js";

      openerTab = request.data.currentTab;
      hasIgnoreWrong = request.data.hasIgnoreWrong;

      openTab(request.data.completedUrl).then((tab) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: [contentScriptPath],
        });
      });
    }

    if (request.type === "scrape-completed-form") {
      const contentScriptPath = "content-scripts/target-form.js";

      focusTab(openerTab).then(async () => {
        await chrome.scripting.executeScript({
          target: { tabId: openerTab.id },
          files: [contentScriptPath],
        });

        await chrome.tabs.sendMessage(openerTab.id, {
          type: "open-target-form",
          data: {
            titleToAnswer: request.data,
            hasIgnoreWrong,
          },
        });
      });
    }

    return true; // Keep the message channel open
  });
}
main();

function openTab(url) {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ url }, (tab) => {
      const handler = (tabId, changeInfo, tabInfor) => {
        if (tabId === tab.id && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(handler);
          resolve(tabInfor);
        }
      };
      chrome.tabs.onUpdated.addListener(handler);
    });
  });
}

async function focusTab(tab) {
  await chrome.tabs.highlight({ tabs: tab.index });
}
