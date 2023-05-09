"use strict";

let inputKey = document.querySelector(".input");
let btn = document.querySelector(".btn");
let newBtn = document.querySelector(".new-btn")

let storage = chrome.storage.sync;

btn.addEventListener("click", function () {
  storage.set({ "api_key": inputKey.value }, function () {
    console.log("Key Saved");
  });
});

newBtn.addEventListener("click", function () {
  storage.get(null, function (result) {
    console.log('Value currently is ' + result.api_key);
  });
})


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "getStorage") {
    sendResponse({ storage: "storage" });
  }
});
