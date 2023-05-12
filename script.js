"use strict";

let inputKey = document.querySelector(".input");
let btn = document.querySelector(".btn");
let clearBtn = document.querySelector(".clear-btn")
let currentBtn = document.querySelector(".current-btn")
btn.addEventListener("click", function () {
  const userData = { api_key: inputKey.value, status: "store api key" };
  chrome.runtime.sendMessage({ userData });
});

clearBtn.addEventListener("click", function () {
  const userData = { status: "delete api key" };
  chrome.runtime.sendMessage({ userData });
})

currentBtn.addEventListener("click", function() {
  const userData = { status: "show api key" };
  chrome.runtime.sendMessage({ userData });
})