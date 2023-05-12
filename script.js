"use strict";

let inputKey = document.querySelector(".input");
let btn = document.querySelector(".btn");
let newBtn = document.querySelector(".new-btn")

btn.addEventListener("click", function () {
  const data = { api_key: inputKey.value };
  chrome.runtime.sendMessage({ data }, function(response) {
    console.log("Response received from background.js:", response);
  });
});



