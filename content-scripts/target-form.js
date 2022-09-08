function main() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "open-target-form") {
      const { titleToAnswer, hasIgnoreWrong } = request.data;

      const radWrapperList = document.querySelectorAll(".Qr7Oae [jscontroller=sWGJ4b]");

      radWrapperList.forEach((ele) => {
        const title = ele.querySelector(".M7eMe")?.textContent;
        const options = ele.querySelectorAll("[jscontroller=EcW08c]");
        const answer = titleToAnswer[title];

        options.forEach((option) => {
          if (hasIgnoreWrong) {
            chooseCorrectOnly(option, answer);
            return;
          }

          chooseAll(option, answer);
        });
      });
    }

    return true; // Keep the message channel open
  });
}
main();

function chooseCorrectOnly(option, answer) {
  if (answer.value === option.dataset.value && answer.isCorrect) {
    option.click();
  }
}

function chooseAll(option, answer) {
  if (answer.value === option.dataset.value) {
    option.click();
  }
}
