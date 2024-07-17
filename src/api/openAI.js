import axios from "axios";
const { apiKey } = require("../constants");

const client = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    }
});

const chatGPTEndpoint = "https://api.openai.com/v1/chat/completions";
const dalleEndpoint = "https://api.openai.com/v1/images/generations";

// function to handle different assistant modes
const getSystemMessage = (mode) => {
    if (mode === 'Baymax') {
        return {
            role: 'system',
            content: 'You are Baymax (similar personality to Baymax of Big Hero 6), a personal healthcare companion.'
        };
    }
    // Default mode
    return {
        role: 'system',
        content: 'You are Jarvis, a helpful assistant created by Notsky, the genius engineer who is said to be the spiritual successor to Tony Stark, the Iron Man.'
    };
};

// This function checks the mode based on the prompt
const checkMode = (prompt) => {
    if (prompt.toLowerCase().includes("baymax mode")) {
        return 'Baymax';
    }
    return 'default'; // Default to Jarvis
};

export const apiCall = async (prompt, messages) => {
    try {
        // Send an initial message to determine if the prompt involves image generation
        const res = await client.post(chatGPTEndpoint, {
            model: "gpt-3.5-turbo",
            messages: [{
                    role: 'user',
                    content: `Does this message want to generate an AI picture, image art, or anything similar?
                        Generating an image means we specifically ask for it with keywords such as 'generate, create, paint, draw, illustrate, etc...'
                        ${prompt}. Simply answer with a yes or no.`
                }]
        });

        // Extract response to check if the intent is to generate an image
        let isArt = res.data?.choices[0]?.message?.content;

        if (isArt.toLowerCase().includes('yes')) {
            console.log('dalle api call')
            return dalleApiCall(prompt, messages || []);
        } else {
            console.log('chatGPT api call')
            // determine if chat changes mode or Jarvis/Baymax

            return chatgptApiCall(prompt, messages || []);
        }

    } catch(err) {
        console.log('Error: ', err);
        return Promise.resolve({success: false, message: err.message});
    }
}

const chatgptApiCall = async(prompt, messages) => {
    try {
        // Update mode based on the prompt
        mode = checkMode(prompt);
        const systemMessage = getSystemMessage(mode);

        // Prepare messages for API call including the system context
        const apiMessages = [
            systemMessage,
            ...messages.filter(msg => msg.role === 'user') // Ensure only user messages are sent
        ];

        // Add the current user prompt
        apiMessages.push({ role: 'user', content: prompt });

        const res = await client.post(chatGPTEndpoint, {
            model: "gpt-3.5-turbo",
            messages: apiMessages
        });

        let answer = res.data?.choices[0]?.message?.content;
        messages.push({role: 'assistant', content: answer.trim()});
        console.log('answer: ', answer);
        return Promise.resolve({success: true, data: messages});
    } catch(err) {
        console.error('ChatGPT API call error details: ', err.response ? err.response.data : err);
        return Promise.resolve({success: false, message: err.message});
    }
}

const dalleApiCall = async(prompt, messages) => {
    try {
        const res = await client.post(dalleEndpoint, {
            prompt,
            n: 1,
            size: "512x512"
        });

        let url = res?.data?.data[0]?.url;
        console.log('image url: ', url);
        messages.push({role: 'assistant', content: url});
        return Promise.resolve({success: true, data: messages});
    } catch(err) {
        console.log('Error: ', err);
        return Promise.resolve({success: false, message: err.message});
    }
}
