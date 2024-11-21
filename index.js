const chatBody = document.querySelector(".my-chat-container");
const inputMessage = document.querySelector("#message");
const sendMessageButton = document.querySelector(".upload-btn");
const fileInput = document.querySelector("#file-input");

const API_KEY = "AIzaSyCooo66D1AVtAPJ2wum3Jg299jvz1EswNg";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const userData = {
  message: null,
  file :{
    data: null,
    mime_type: null
  }
};

const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(
    ".ai-chat-container2"
  );
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userData.message }, ...(userData.file.data ? [{inline_data:userData.file}]: [])],
        },
      ],
    }),
  };
  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    const responseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();
    messageElement.innerText = responseText;
  } catch (err) {
    console.log(err);
    messageElement.innerText = err.message;
    messageElement.style.color = "#ff0000";
  } finally {
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};
const createMessageDiv = (userContent, classes) => {
  const div = document.createElement("div");
  div.classList.add("my-chat", classes);
  div.innerHTML = userContent;
  return div;
};

const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = inputMessage.value.trim();
  inputMessage.value = "";

  const userContent = `<div class="file-flex">
  <span class="my-chat-text"></span>
  ${userData.file.data? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment"/>`: ""}
  </div>`;
  const outgoingMessageDiv = createMessageDiv(userContent, "my-chat");
  outgoingMessageDiv.querySelector(".my-chat-text").textContent =
    userData.message;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  setTimeout(() => {
    const userContent = `  <div class="ai-chat-container">
              <div class="chat-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 123 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2473_147)">
                    <path
                      d="M57.49 29.2001V23.5301C56.8006 23.2717 56.1319 22.9608 55.49 22.6001C52.9764 21.108 51.0832 18.7617 50.1561 15.9895C49.229 13.2173 49.3297 10.2042 50.44 7.50011C51.057 6.02547 51.9534 4.68415 53.08 3.55011C54.2032 2.4268 55.5347 1.53344 57 0.920112C58.4765 0.30601 60.0609 -0.00678321 61.66 0.000111548C64.0624 -0.000227108 66.4109 0.712245 68.4082 2.04733C70.4055 3.38242 71.9618 5.28009 72.88 7.50011C74.1062 10.4685 74.1062 13.8018 72.88 16.7701C72.269 18.245 71.3717 19.5841 70.24 20.7101L70.18 20.7701C69.4678 21.4705 68.6757 22.0847 67.82 22.6001C67.1854 22.9748 66.5155 23.2863 65.82 23.5301V29.2001H94.3C98.3873 29.2133 102.303 30.8435 105.193 33.7346C108.082 36.6258 109.709 40.5428 109.72 44.6301V46.9201H115C117.095 46.928 119.101 47.7643 120.581 49.2462C122.061 50.7282 122.895 52.7356 122.9 54.8301V73.2001C122.895 75.2946 122.061 77.302 120.581 78.784C119.101 80.266 117.095 81.1022 115 81.1101H109.75V83.1801C109.737 87.2718 108.104 91.1918 105.209 94.0832C102.314 96.9746 98.3917 98.6022 94.3 98.6101H55.23L31.81 118.72C31.5518 118.942 31.2523 119.11 30.9287 119.216C30.6052 119.321 30.2639 119.362 29.9246 119.335C29.5854 119.308 29.2548 119.214 28.9519 119.059C28.6491 118.904 28.3799 118.69 28.16 118.43C27.7202 117.917 27.4946 117.255 27.53 116.58L28.78 98.5801H28.57C24.488 98.5696 20.576 96.944 17.6887 94.0585C14.8013 91.173 13.1732 87.2621 13.16 83.1801V81.1101H7.91C5.81376 81.1048 3.80489 80.2698 2.32262 78.7875C0.840348 77.3052 0.00528022 75.2964 0 73.2001L0 54.8301C0.00526756 52.7356 0.838961 50.7282 2.31907 49.2462C3.79918 47.7643 5.8055 46.928 7.9 46.9201H13.16V44.6201C13.1679 40.5346 14.7937 36.6186 17.6816 33.7288C20.5696 30.839 24.4845 29.2107 28.57 29.2001H57.49ZM82.74 47.3201C84.5912 47.3201 86.4009 47.8691 87.9401 48.8976C89.4794 49.926 90.6791 51.3879 91.3875 53.0982C92.0959 54.8085 92.2813 56.6905 91.9202 58.5062C91.559 60.3218 90.6675 61.9896 89.3585 63.2986C88.0495 64.6076 86.3817 65.4991 84.566 65.8603C82.7504 66.2214 80.8684 66.0361 79.1581 65.3276C77.4478 64.6192 75.9859 63.4195 74.9574 61.8802C73.929 60.341 73.38 58.5313 73.38 56.6801C73.38 54.1977 74.3661 51.8169 76.1215 50.0616C77.8768 48.3063 80.2576 47.3201 82.74 47.3201ZM40.16 47.3201C42.0112 47.3201 43.8209 47.8691 45.3601 48.8976C46.8994 49.926 48.0991 51.3879 48.8075 53.0982C49.516 54.8085 49.7013 56.6905 49.3401 58.5062C48.979 60.3218 48.0875 61.9896 46.7785 63.2986C45.4695 64.6076 43.8017 65.4991 41.986 65.8603C40.1704 66.2214 38.2884 66.0361 36.5781 65.3276C34.8678 64.6192 33.4059 63.4195 32.3774 61.8802C31.349 60.341 30.8 58.5313 30.8 56.6801C30.8 54.1977 31.7861 51.8169 33.5415 50.0616C35.2968 48.3063 37.6776 47.3201 40.16 47.3201ZM46.54 78.6801C46.3988 78.5689 46.2712 78.4413 46.16 78.3001C45.8359 77.9198 45.6523 77.4396 45.64 76.9401C45.6309 76.438 45.7932 75.9477 46.1 75.5501C46.2146 75.4056 46.3454 75.2747 46.49 75.1601C47.0401 74.7267 47.7164 74.4844 48.4166 74.4699C49.1168 74.4555 49.8025 74.6697 50.37 75.0801C52.079 76.4284 53.9756 77.5199 56 78.3201C57.7442 78.9947 59.6 79.3339 61.47 79.3201C63.3635 79.2799 65.2353 78.9076 67 78.2201C69.0484 77.4011 70.9814 76.3187 72.75 75.0001C73.3303 74.6044 74.0235 74.408 74.7251 74.4405C75.4267 74.473 76.0987 74.7325 76.64 75.1801C76.7757 75.3051 76.8995 75.4424 77.01 75.5901C77.304 75.996 77.452 76.4894 77.43 76.9901C77.3873 77.4909 77.1839 77.9644 76.85 78.3401C76.7232 78.4843 76.5787 78.612 76.42 78.7201C74.171 80.3822 71.7047 81.7281 69.09 82.7201C66.6814 83.6282 64.1338 84.112 61.56 84.1501C58.9832 84.1861 56.4214 83.7523 54 82.8701C51.3313 81.8717 48.832 80.4686 46.59 78.7101L46.54 78.6801ZM94.29 34.4001H28.57C25.861 34.4107 23.2661 35.4922 21.3515 37.4087C19.4369 39.3252 18.3579 41.9211 18.35 44.6301V83.1801C18.3579 85.8891 19.4369 88.4851 21.3515 90.4016C23.2661 92.3181 25.861 93.3996 28.57 93.4101H31.74C32.4255 93.4614 33.0632 93.781 33.5144 94.2997C33.9657 94.8183 34.1941 95.4941 34.15 96.1801L33.15 110.76L52.45 94.1501C52.6901 93.91 52.9755 93.72 53.2896 93.5913C53.6038 93.4625 53.9405 93.3975 54.28 93.4001H94.28C96.989 93.3896 99.5839 92.3081 101.499 90.3916C103.413 88.4751 104.492 85.8791 104.5 83.1701V44.6201C104.495 41.9129 103.418 39.318 101.504 37.4028C99.591 35.4876 96.9972 34.408 94.29 34.4001Z"
                      fill="#ffffff"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2473_147">
                      <rect width="122.88" height="119.35" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div class="ai-chat-container2">
                <div class="loader">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </div>
            </div>`;
    const incomingMessageDiv = createMessageDiv(userContent, "main-ai-chat");
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    generateBotResponse(incomingMessageDiv);
  }, 600);
};

//handle user Message
inputMessage.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && userMessage) {
    handleOutgoingMessage(e);
  }
});

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  
  reader.onload = (e) => {
    const base64String = e.target.result.split(",")[1];
    userData.file = {
      data: base64String,
      mime_type: file.type
    }
    fileInput.value = "";
  };

  reader.readAsDataURL(file);
});

document.querySelector("#file-upload").addEventListener("click", () => {
  fileInput.click();
});
