console.log("This is content script file");

let userData = {}; // declare userData variable

// add fetch button
const profileActions = document.querySelector(".pv-top-card-v2-ctas");
const fetchBtn = `<button class="artdeco-button artdeco-button--2 artdeco-button--secondary ember-view fetch-data">Get Data</button>`;
profileActions.insertAdjacentHTML("afterbegin", fetchBtn);
const newFetchBtn = document.querySelector(".fetch-data");

let generateNoteBtn; // declare generateNoteBtn variable

// fetch user data function
const fetchUserData = function () {
  // get user data
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

  // store user data
  userData = {
    name,
    skills,
    about,
  };

  // set generateNoteBtn to undefined
  generateNoteBtn = "Add Button";
};

// add event listener to fetch button
newFetchBtn.addEventListener("click", fetchUserData);

// function to handle focus in event
function handleFocusIn(event) {
  const connectButton = event.target.classList.contains("connect-button-send-invite__custom-message");
  if (!connectButton) {
    return;
  }

  const customMessageField = document.querySelector(".connect-button-send-invite__custom-message");
  const bottomBar = document.querySelector(".artdeco-modal__actionbar");
  const generateNoteButton = `<button class="artdeco-button artdeco-button--2 artdeco-button--secondary ember-view generate-note-btn">Generate Note</button>`;

  if (!generateNoteBtn) {
    // add generate note button
    bottomBar.insertAdjacentHTML("afterbegin", generateNoteButton);
    generateNoteBtn = document.querySelector(".generate-note-btn");
    // add event listener to generate note button to send user data
    generateNoteBtn.addEventListener("click", () => sendData(userData));
  }
}

// function to send user data
function sendData(userData) {
  chrome.runtime.sendMessage({ userData });
}

// add event listener to focus in event
document.addEventListener("focusin", handleFocusIn);

// add listener to receive message from background.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request) {
    console.log(request);
    str = request.replace(/\s+/g, ' '); // remove extra spaces from received message
    console.log(str);
    let input = document.querySelector("#custom-message");
    input.value = str; // set received message to input field value
  }
});


