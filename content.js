window.onload = function () {

  const content = document.querySelector(".pv-top-card-v2-ctas");
  const htmlBtn = `<button class="artdeco-button artdeco-button--2 artdeco-button--secondary ember-view fetch-data-btn">Fetch Data</button>`;
  content.insertAdjacentHTML("afterbegin", htmlBtn);

  let requestPerson = {};
  const fetchData = function () {
    const name = document.querySelector( ".text-heading-xlarge");
    const skills = document.querySelector(".text-body-medium").textContent;
    const aboutParent = document.querySelector("#about").parentElement;
    const about = aboutParent.querySelector(".pv-shared-text-with-see-more .visually-hidden").textContent;
    requestPerson = {
      name: name.textContent,
      url: name.baseURI,
      skills,
      about
    };
    console.log("Data Fetched");
  };

  document.addEventListener("focusin", async function (event) {
    if (event.target.classList.contains("connect-button-send-invite__custom-message")) {
      const textField = document.querySelector(".connect-button-send-invite__custom-message");
      const generateBtn = `<button class="artdeco-button artdeco-button--2 artdeco-button--secondary ember-view generate-note-btn">Generate Note</button>`;
      const sm = document.querySelector(".artdeco-modal__actionbar");
      sm.insertAdjacentHTML("afterbegin", generateBtn);
      const grn = document.querySelector(".generate-note-btn");

      let sendMsg = async function () {
        const responseText = await makeApiRequest(requestPerson);
        console.log(responseText);
        emulateWriting("connect-button-send-invite__custom-message", responseText, grn, sendMsg);
      }

      grn.addEventListener("click", sendMsg);
    }
  });

  const btn = document.querySelector('.fetch-data-btn');
  btn.addEventListener('click', fetchData);
};

function emulateWriting(elementName, text, removeEle, handleClick) {
  const input = document.querySelector(`.${elementName}`);
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      input.value += text[i];
      i++;
      for (let j = 0; j < 10; j++) {
        if (i < text.length) {
          input.value += text[i];
          i++;
        }
      }
    } else {
      clearInterval(interval);
      // removeEle.removeEventListener('click', handleClick);
    }
  }, 10);
}

async function makeApiRequest(requestPerson) {
  const url = 'https://api.openai.com/v1/completions';
  const apiKey = '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';

  const prompt = `generate a request note for giving request in linkedin me to ${requestPerson.name} based on their skills and background? Here's a short summary: ${requestPerson.about}. And, here's the link to their profile for more information: ${requestPerson.url} under 300 characters and end with an interesting question so that they can reply.`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 2000
    })
  };
  const response = await fetch(url, options);
  const result = await response.json();

  if (response.ok) {
    return result.choices[0].text;
  } else {
    console.log(`Error: ${result.error.message}`);
  }
}
