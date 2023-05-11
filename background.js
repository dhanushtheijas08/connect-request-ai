let globalTaburl;
// For inject content.js file
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  chrome.tabs.get(tabId, function (tabInfo) {
    if (changeInfo.status !== "complete") return;
    if (
      tabInfo.url.match(/^https:\/\/www\.linkedin\.com\/in\/[^/]+\/$/) &&
      tabInfo.width >= 1280
    ) {
      globalTaburl = tabInfo.url;
      chrome.scripting.executeScript({
        target: { tabId: tabInfo.id },
        files: ["content.js"],
      });
    }
  });
});

// For making request
async function fetchData(request) {
  const url = "https://api.openai.com/v1/completions";
  const apiKey = "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";

  const prompt = `generate a request note for giving request in linkedin me to ${request.name} based on their skills and intrested are ${request.skills} and background? Here's a short summary: ${request.about}. And, here's the link to their profile for more information: ${globalTaburl} under 300 characters and end with an interesting question so that they can reply.`;

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

// Geting user data and send the response message
chrome.runtime.onMessage.addListener(async function ({ userData }) {
  console.log("🚀  request.userData:", userData)
  if (userData) {
    await fetchData(userData);
  }
});
