import Config from 'react-native-config';

export const apiKey = Config.API_KEY;

export const dummyMessages = [
    {
        role: 'user',
        content: 'How are you?',
    },
    {
        role: 'assistant',
        content: "I'm doing well, thank you for asking. How can I help you today?",
    },
    {
        role: 'user',
        content: 'create an image of a dog playing with a cat'
    },
    {
        role: 'assistant',
        content: 'https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg',
    }
]