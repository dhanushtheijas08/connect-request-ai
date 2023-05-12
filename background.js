let globalTaburl;
// Listen for tab updates and inject content.js file
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  chrome.tabs.get(tabId, function (tabInfo) {
    if (changeInfo.status !== "complete") return;
    if (
      tabInfo.url.match(/^https:\/\/www\.linkedin\.com\/in\/[^/]+\/$/) && // check if LinkedIn profile page
      tabInfo.width >= 1280 // check if window size is large enough
    ) {
      globalTaburl = tabInfo.url;
      chrome.scripting.executeScript({
        target: { tabId: tabInfo.id },
        files: ["content.js"],
      });
    }
  });
});

let getApiKey = async function () {
  let result = await chrome.storage.sync.get(['apiKey']);
  return result.apiKey;
}

// Send request to OpenAI API and receive response
async function fetchData(request) {

  const url = "https://api.openai.com/v1/completions";
  let apiKey = await getApiKey();
  console.log("🚀  apiKey:", apiKey)

  // Generate request prompt with user data
  const prompt = `generate a request note in professional way for giving request in linkedin me to ${request.name} based on their skills and intrested are ${request.skills} and background? Here's a short summary: ${request.about}. And, here's the link to their profile for more information: ${globalTaburl} under 300 characters and end with an interesting question so that they can reply.`;

  // Send request to OpenAI API
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 10,
    }),
  };
  const response = await fetch(url, options);
  const result = await response.json();

  // Send response to content.js file
  if (response.ok) {
    let responseText = result.choices[0].text;
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, responseText, function (responseText) {
          console.log("send response", responseText);
        });
      }
    );
  } else {
    console.log(`Error: ${result.error.message}`);
  }
}

// Get user data from content.js file and send request to OpenAI API
chrome.runtime.onMessage.addListener(async function ({ userData }, sender, sendResponse) {
  if (sender.url.includes("popup.html")) {
    if (userData.status === "store api key") {
      console.log(userData);
      // Storing the API key
      chrome.storage.sync.set({ apiKey: userData.api_key }, function () {
        console.log('API key stored.');
      });
    }
    else if (userData.status === "delete api key") {
      // Deleting the stored data
      chrome.storage.sync.remove(['apiKey'], function () {
        console.log('API key deleted.');
      });
    }
    else if (userData.status === "show api key") {
      // Retrieving the stored data
      chrome.storage.sync.get(['apiKey'], function (result) {
        console.log('API key retrieved: ' + result.apiKey);
      });
    }
  }
  else {
    await fetchData(userData);
  }
});
