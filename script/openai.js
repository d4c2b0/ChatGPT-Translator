export class ChatCompletion {
    constructor(url, apiKey) {
        this.url = url;
        this.apiKey = apiKey;
    }

    async create(model, messages) {
        const completionResult = await fetch(this.url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            method: "POST",
            body: JSON.stringify({
                messages: messages,
                model: model,
            }),
        });
        return completionResult.json();
    }
}
