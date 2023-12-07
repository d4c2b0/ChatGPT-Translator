import * as openai from "./openai.js";
import { Message, ChatHistory, convertToMessage } from "./history.js";

//TODO: Set API key

const chat = new openai.ChatCompletion(
    "https://api.openai.com/v1/chat/completions",
    ""
);

// const result = await chat.create("gpt-3.5-turbo-1106", [
//     { role: "user", content: "Make me laugh" },
// ]);

// console.log(result.choices[0].message.content);

const chatHistory = new ChatHistory();

// chatHistory.addMessage("user", "Hello!");
// chatHistory.addMessage("assistant", "Hi! How can I assist you today?");

// console.log(chatHistory.getLastNMessages(1));
// console.log(chatHistory.historySize);
// chatHistory.printHistory();

// const chat = new openaiChat(
//     "https://api.openai.com/v1/chat/completions",
//     "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",
//     "gpt-3.5-turbo"
// );

const buttonSend = document.querySelector("#input-send");
const inputMessage = document.querySelector("#input-message");

const messageContainer = document.querySelector(".message-container");

buttonSend.addEventListener("click", async () => {
    const messageSend = document.createElement("p");
    messageSend.textContent = inputMessage.value;
    messageContainer.appendChild(messageSend);

    const messageRecieved = document.createElement("p");
    messageContainer.appendChild(messageRecieved);

    chatHistory.addMessage("user", inputMessage.value);
    const messages = chatHistory.getLastNMessages(6);
    messages.unshift({ role: "system", content: "Output in markdown format" });
    console.log(messages);

    const result = await chat.create("gpt-4-1106-preview", messages);

    chatHistory.addMessage("assistant", result.choices[0].message.content);
    messageRecieved.innerHTML = result.choices[0].message.content;
});
