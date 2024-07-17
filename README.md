# Jarvis (React-Native)

## Links:
1. React-Native environment setup - https://reactnative.dev/docs/0.72/environment-setup <br>
2. NativeWind - https://www.nativewind.dev/quick-starts/react-native-cli <br>
3. TailWind CSS - https://tailwindcss.com/docs
4. React Navigation - https://reactnavigation.org/docs/getting-started/ <br>
5. React Native Voice - https://www.npmjs.com/package/@react-native-community/voice?activeTab=readme <br>
6. react-native-responsive-screen - https://www.npmjs.com/package/react-native-responsive-screen <br>
7. @react-native-community/voice (Speech to text) - https://www.npmjs.com/package/@react-native-community/voice?activeTab=readme <br>
8. react-native-tts (Text to Speech) - https://github.com/ak1394/react-native-tts <br>
9. OpenAI api reference - https://platform.openai.com/docs/api-reference/introduction <br><br>

# Project Overview:<br>
The Jarvis Mobile Assistant represents a sophisticated endeavor in mobile development, utilizing a modern stack of React Native and supportive libraries. This application serves as a versatile tool, integrating advanced language and image generation models provided by OpenAI, alongside a host of other functionalities aimed at enhancing user interaction and experience on mobile devices.

Client-Side Development: <br>
The mobile application is crafted with React Native, enabling cross-platform app development for both Android and iOS devices. This project embraces the utility of Tailwind CSS via NativeWind, which simplifies the process of styling components consistently across various screen sizes using the utility-first framework. Essential navigation between different screens and modalities within the app is handled gracefully by React Navigation.

Voice and Text Interaction: <br>
Key to Jarvis is its ability to interact with the user via voice commands. This is facilitated by react-native-community/voice for voice recognition, allowing users to engage with the app hands-free, enhancing accessibility and ease of use. The responses and continuous interaction are managed through OpenAI's GPT models, known for their robust performance in generating human-like text.

Image Generation: <br>
Leveraging OpenAI's DALL-E model, Jarvis can generate images based on textual descriptions provided by the user. This feature introduces a creative dimension to the app, where users can visualize concepts and ideas directly through their mobile device. <br><br>

Libraries Utilized:
```shell
1. React Native: Provides the framework for building native apps using React.
2. NativeWind: Integrates Tailwind CSS into React Native for consistent styling.
3. React Navigation: Manages the navigation tree and handles the transition between screens.
4. react-native-responsive-screen: Assists in creating responsive layouts and UIs across different device sizes.
5. react-native-community/voice: Enables voice input for commanding and interacting with the app.
6. react-native-tts (Text-to-Speech): Converts text into spoken words to provide auditory feedback to the user.
7. OpenAI API:
  - GPT: Powers the conversational capabilities of the app.
  - DALL-E: Used for generating images based on user prompts.
8. dotenv & react-native-config: Manages environment variables securely within the app's development and production environments.
```
<br><br>

### 1 - Welcome Screen:<br>
![Welcome-Light](https://github.com/user-attachments/assets/49ecf89f-f594-4064-83f1-c282f1c420ff)![Welcome-Dark](https://github.com/user-attachments/assets/2cf433c6-8d6a-4fa4-b7e0-e38da9c4c8ba)<br><br>

### 2 - Features Screen:<br>
![Features-Light](https://github.com/user-attachments/assets/b7bedd72-8fed-447f-abd5-e763e4ba7410)![Features-Dark](https://github.com/user-attachments/assets/618f8e71-69c2-45d2-bc47-e78f7da4a040)<br><br>

### 3 - Chat Screen:<br>
![Chat-Light](https://github.com/user-attachments/assets/66a28419-783c-4b73-90a2-2a1b248cde7d)![Chat-Dark](https://github.com/user-attachments/assets/ffe8940f-0566-47dc-8c97-50f97fbdde1b)<br><br>

### 4 - Settings Screen:<br>
![Settings-Light](https://github.com/user-attachments/assets/1984d156-fa7d-460f-beb6-c97444674592)![Settings-Dark](https://github.com/user-attachments/assets/b8af9b65-a18d-46c3-90eb-e94fe0ca5428)<br><br>

## Credits to: <br>
CodingWithNomi for his iOS Jarvis app tutorial
