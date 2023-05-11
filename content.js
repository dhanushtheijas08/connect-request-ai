console.log("This is content script file");

let userData = {};

const profileActions = document.querySelector(".pv-top-card-v2-ctas");
const fetchBtn = `<button class="artdeco-button artdeco-button--2 artdeco-button--secondary ember-view fetch-data">Get Data</button>`;
profileActions.insertAdjacentHTML("afterbegin", fetchBtn);
const newFetchBtn = document.querySelector(".fetch-data");

let generateNoteBtn;
const fetchUserData = function () {
  const name = document.querySelector(".text-heading-xlarge").textContent;
  const skills = document.querySelector(".text-body-medium").textContent;
  const aboutParent = document.querySelector("#about")
    ? document.querySelector("#about").parentElement
    : null;

  const about = aboutParent
    ? aboutParent.querySelector(
      ".pv-shared-text-with-see-more .visually-hidden"
    ).textContent
    : "No about section";
  userData = {
    name,
    skills,
    about,
  };
  generateNoteBtn = "btn"
};

newFetchBtn.addEventListener("click", fetchUserData);

function handleFocusIn(event) {
  const connectButton = event.target.classList.contains("connect-button-send-invite__custom-message");
  if (!connectButton) {
    return;
  }

  const customMessageField = document.querySelector(".connect-button-send-invite__custom-message");
  const bottomBar = document.querySelector(".artdeco-modal__actionbar");
  const generateNoteButton = `<button class="artdeco-button artdeco-button--2 artdeco-button--secondary ember-view generate-note-btn">Generate Note</button>`;

  if (generateNoteBtn) {
    bottomBar.insertAdjacentHTML("afterbegin", generateNoteButton);
    generateNoteBtn = document.querySelector(".generate-note-btn");
    generateNoteBtn.addEventListener("click", () => sendData(userData))
    generateNoteBtn = undefined
  }
}


function sendData(userData) {
  console.log(userData);
  chrome.runtime.sendMessage({ userData });
}

document.addEventListener("focusin", handleFocusIn);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request) {
    console.log(request);
    str = request.replace(/\s+/g, ' ');
    console.log(str);
    let input = document.querySelector("#custom-message");
    input.value = str;
  }
});
