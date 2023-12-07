/**
 * Represents a chat message with a specific role and content.
 */
class Message {
    /**
     * Create a message instance.
     * @param {string} role - The role associated with the message.
     * @param {string} content - The content of the message.
     * @throws {TypeError} Throws a TypeError if role is not a non-empty string or content is not a string.
     */
    constructor(role, content) {
        if (
            typeof role !== "string" ||
            role.trim() === "" ||
            typeof content !== "string"
        ) {
            throw new TypeError(
                "Role must be a non-empty string and content must be a string."
            );
        }
        this.role = role;
        this.content = content;
    }
}

/**
 * Maintains a history of chat messages.
 */
class ChatHistory {
    #history; // プライベートフィールドとして宣言

    /**
     * Create a chat history with an optional initial array of messages.
     * @param {Message[]} [history=[]] - An optional initial array of Message instances.
     * @throws {TypeError} Throws a TypeError if any item in the history is not an instance of Message.
     */
    constructor(history = []) {
        this.#history = []; // Initialize as an empty array

        // Validate and add each message in the provided history array
        history.forEach((message) => {
            this.#checkMessageFormat(message); // Validate message
            this.#history.push(message); // Add to history if valid
        });
    }

    /**
     * Add a message to the chat history.
     * @param {string} role - The role associated with the message to be added.
     * @param {string} content - The content of the message to be added.
     */
    addMessage(role, content) {
        const message = new Message(role, content);
        this.#checkMessageFormat(message); // Validate message before adding
        this.#history.push(message);
    }

    /**
     * Returns the last 'n' messages from the message history.
     *
     * @param {number} n - The number of messages to retrieve. Must be a positive integer.
     * @param {boolean} [freeze=true] - Flag indicating whether the returned messages should be frozen.
     * @param {boolean} [reverse=false] - Flag indicating whether to return the messages in reverse order.
     * @throws {Error} Throws an error if 'n' is not a positive integer, or if 'freeze' or 'reverse' are not booleans.
     * @returns {Object[]} An array containing the last 'n' messages. Each message is an object.
     */

    getLastNMessages(n, freeze = true, reverse = false) {
        if (!Number.isInteger(n) || n < 1) {
            throw new Error("Argument n must be a positive integer.");
        }
        if (typeof freeze !== "boolean") {
            throw new Error("Argument freeze must be a boolean.");
        }
        if (typeof reverse !== "boolean") {
            throw new Error("Argument reverse must be a boolean.");
        }
        const start = reverse ? 0 : Math.max(0, this.#history.length - n);
        const end = reverse ? n : this.#history.length;
        return this.#history
            .slice(start, end)
            .map((msg) => (freeze ? Object.freeze({ ...msg }) : { ...msg }));
    }

    /**
     * Clear the message history.
     */
    clearHistory() {
        this.#history = [];
    }

    /**
     * Get the current size of the chat history.
     * @returns {number} The number of messages currently in the chat history.
     */
    get historySize() {
        return this.#history.length;
    }

    /**
     * Print all messages in the chat history to the console.
     */
    printHistory() {
        this.#history.forEach((message, index) => {
            console.log(`${index + 1}: ${message.role} - ${message.content}`);
        });
    }

    /**
     * Check the format of the provided message object. Private method.
     * @param {Message} message - The message to validate.
     * @private
     */
    #checkMessageFormat(message) {
        if (!(message instanceof Message)) {
            throw new Error("Invalid message instance.");
        }
    }
}

// 配列の各要素をMessageクラスのインスタンスに変換する
function convertToMessage(obj) {
    return new Message(obj.role, obj.content);
}

export { Message, ChatHistory, convertToMessage };

// // 配列オブジェクトを作成
// const array = [
//     { role: "user", content: "Hello!" },
//     { role: "assistant", content: "Hi!" },
// ];

// // 配列の各要素に関数を適用して新しい配列を作成
// const messages = array.map(convertToMessage);

// // ChatHistoryクラスのインスタンスを作成
// const chat = new ChatHistory(messages);

// // メッセージを追加
// chat.addMessage("user", "こんにちは");
// chat.addMessage(
//     "assistant",
//     "こんにちは、これはBingです。どのようにお手伝いできますか？"
// );

// // 履歴のサイズを取得
// console.log(chat.historySize); // 2

// // 履歴の最後のメッセージを取得
// console.log(chat.getLastNMessages(1)); // [{role: "assistant", content: "こんにちは、これはBingです。どのようにお手伝いできますか？"}]

// // 履歴を出力
// chat.printHistory();
// // 1: user - こんにちは
// // 2: assistant - こんにちは、これはBingです。どのようにお手伝いできますか？

// // 履歴をクリア
// chat.clearHistory();
// console.log(chat.historySize); // 0
