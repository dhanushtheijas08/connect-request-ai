chrome.runtime.sendMessage({ action: "getStorage" }, function(response) {
  let storage = response.storage;
  console.log("hi");
});
