async function main() {
  const titleToAnswer = {};

  const radWrapperList = document.querySelectorAll(".Qr7Oae [jscontroller=pkFYWb]");

  radWrapperList.forEach((ele) => {
    const title = ele.querySelector(".cTDvob.D1wxyf.G4EHhc").textContent;
    const answer = ele.querySelector("[jscontroller=wPRNsd]").dataset.value;
    const point = ele.querySelector(".RGoode");

    if (point) {
      Object.assign(titleToAnswer, {
        [title]: {
          value: answer,
          isCorrect: point.textContent === "1/1",
        },
      });
    }
  });

  await chrome.runtime.sendMessage({
    type: "scrape-completed-form",
    data: titleToAnswer,
  });
}
main();
