/**
 * Throws an error indicating that a required parameter is missing.
 * @param {string} key - The name of the missing parameter.
 * @throws {Error} - The error indicating that the parameter is required.
 */
function requires(key) {
    throw new Error(`${key} is required.`);
}

function createElementFromHTML(html) {
    const tempEl = document.createElement("div");
    tempEl.innerHTML = html;
    return tempEl.firstElementChild;
}

/**
 * A class representing an OpenAI chat.
 */
export class openaiChat {
    /**
     * Create a new OpenAI chat instance.
     * @param {string} apiUrl - The URL of the OpenAI API.
     * @param {string} apiKey - The API key for the OpenAI API.
     * @param {string} modelName - The name of the OpenAI model to use.
     */
    constructor(url, apiKey, modelName) {
        this.apiUrl = url;
        this.apiKey = apiKey;
        this.model = modelName;
        console.log(
            "API URL: " +
                this.apiUrl +
                "\nAPI Key: " +
                this.apiKey.slice(0, 12) +
                "..." +
                "\nModel: " +
                this.model
        );
    }

    /**
     * Fetches completion from OpenAI API and streams it to an element.
     * @async
     * @param {Object} options - The options object.
     * @param {Array} options.context - The context to generate completion for.
     * @param {Number} options.temperature - The sampling temperature to use.
     * @param {Number} options.maxTokens - The maximum number of tokens to generate.
     * @param {HTMLElement} element - The element to stream the completion to.
     * @param {String} contentProparty - The property of the element to set the completion to.
     * @returns {String} The generated completion.
     * @throws {Error} If the response from OpenAI API is invalid or if there is an error reading the response.
     */
    async streamToElement(options, element, contentProparty) {
        const {
            context = requires("Context"),
            temperature = 1.0,
            maxTokens = null,
        } = options;

        console.log("Context: ");
        console.log(context);
        console.log(
            "Temperature: " + temperature + "\nMax tokens: " + maxTokens
        );

        const completion = await fetch(this.apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            method: "POST",
            body: JSON.stringify({
                messages: context,
                model: this.model,
                max_tokens: maxTokens,
                temperature: temperature,
                stream: true,
            }),
        });

        const reader = completion.body?.getReader();

        if (completion.status !== 200 || !reader) {
            throw new Error("Invalid response from OpenAI API");
            // return "error";
        }

        const decoder = new TextDecoder("utf-8");

        let result = "";
        let tokens = 0;

        try {
            const read = async () => {
                const { done, value } = await reader.read();
                if (done) return reader.releaseLock();

                const chunk = decoder.decode(value, { stream: true });

                const jsons = chunk
                    .split("data: ")
                    .map((data) => {
                        const trimData = data.trim();
                        if (trimData === "") return undefined;
                        if (trimData === "[DONE]") return undefined;
                        return JSON.parse(data.trim());
                    })
                    .filter((data) => data);

                if (jsons.length > 1) {
                    const messages = jsons.map(
                        (json) => json.choices[0].delta.content
                    );
                    if (messages.includes(undefined)) {
                        console.log(
                            "Content is undefined. Completion finished."
                        );
                        return read();
                    }
                    const joinedMessages = messages.join("");
                    result += joinedMessages;
                } else {
                    if (jsons[0].choices[0].delta.content === undefined) {
                        return read();
                    }
                    result += jsons[0].choices[0].delta.content;
                }
                element[contentProparty] = result;
                tokens = tokens + jsons.length;
                return read();
            };
            await read();
        } catch (error) {
            throw new Error("Error reading response from OpenAI API");
            // console.error(error);
        }

        reader.releaseLock();

        element[contentProparty] = result;
        console.log("Completion tokens: " + tokens);
        return result;
    }
}
