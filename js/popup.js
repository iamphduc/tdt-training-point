function main() {
  const textUrl = document.querySelector(".url__text");
  const chkIgnoreWrong = document.querySelector("[name='chk-ignore-wrong']");
  const btn = document.querySelector(".action__btn");

  btn.addEventListener("click", () => {
    const completedUrl = textUrl.value;
    const hasIgnoreWrong = chkIgnoreWrong.checked;

    getCurrentTab().then((currentTab) => {
      sendMessage({
        type: "open-completed-form",
        data: {
          completedUrl,
          currentTab,
          hasIgnoreWrong,
        },
      });
    });
  });
}
main();

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      resolve(response);
    });
  });
}

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
