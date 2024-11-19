const chatBody = document.querySelector(".my-chat-container");
const inputMessage = document.querySelector("#message");
const sendMessageButton = document.querySelector(".upload-btn");

const userData = {
  message: null,
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

  const userContent = `<span class="my-chat-text"></span>`;
  const outgoingMessageDiv = createMessageDiv(userContent, "my-chat");
  outgoingMessageDiv.querySelector(".my-chat-text").textContent = userData.message;
  chatBody.appendChild(outgoingMessageDiv);
};

//handle user Message
inputMessage.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && userMessage) {
    handleOutgoingMessage(e);
  }
});

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
