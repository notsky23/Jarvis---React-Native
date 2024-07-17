import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Features from '../components/features';
import { dummyMessages } from '../constants';
import Voice from '@react-native-community/voice';
import { apiCall } from '../api/openAI';
import { Alert } from 'react-native';
import Tts from 'react-native-tts';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../themes/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
    const [messages, setMessages] = useState([]);
    const [recording, setRecording] = useState(false);
    const [speaking, setSpeaking ] = useState(false);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const ScrollViewRef = useRef();
    const navigation = useNavigation();
    const { styles } = useTheme();
    const [selectedVoice, setSelectedVoice] = useState('');

    // clear messages
    const clear = () => {
        Tts.stop();
        setMessages([]);
    }

    // stop speaking
    const stopSpeaking = () => {
        Tts.stop();
        setSpeaking(false);
    }
   
    // speech handlers
    const speechStartHandler = e => {
        console.log('Speech started');
    }
    const speechEndHandler = e => {
        setRecording(false);
        console.log('Speech ended');
    }
    const speechResultsHandler = e => {
        console.log('Speech results: ', e);
        const text = e.value[0];
        setResult(text);
    }
    const speechErrorHandler = e => {
        console.log('Speech error: ', e);
    }

    // start and stop recording
    const startRecording = async () => {
        Tts.stop();
        setRecording(true);
        try {
            await Voice.start('en-US');
        } catch (error) {
            console.log('Error: ', error);
        }
    }
    const stopRecording = async () => {
        try {
            await Voice.stop();
            setRecording(false);
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            const loadVoiceSetting = async () => {
                const voice = await AsyncStorage.getItem('selectedVoice');
                if (voice && voice !== selectedVoice) {
                    setSelectedVoice(voice);
                    Tts.setDefaultVoice(voice);
                    console.log('Voice updated for TTS:', voice);
                }
            };
    
            loadVoiceSetting();
    
            return () => {
                // Optional: Any cleanup actions
            };
        }, [])
    );

    const startTextToSpeech = async (message) => {
        if (!message.content.includes('https')) {
            setSpeaking(true);
            Tts.speak(message.content, {
                androidParams: {
                  KEY_PARAM_PAN: 0,
                  KEY_PARAM_VOLUME: 1,
                  KEY_PARAM_STREAM: 'STREAM_MUSIC',
                },
            });
        }
    }

    // fetch response from API
    const fetchResponse = async () => {
        if(result.trim().length > 0) {
            let newMessages = [...messages];
            newMessages.push({role: 'user', content: result.trim()});
            setMessages([...newMessages]);
            updateScrollView();
            setLoading(true);

            try {
                const res = await apiCall(result.trim(), newMessages);
                setLoading(false);
                if (res.success) {
                    setMessages([...res.data]);
                    updateScrollView();
                    setResult('');
                    startTextToSpeech(res.data[res.data.length - 1]);
                } else {
                    console.log('API call failed: ', res.message);
                    Alert.alert('Error: ', res.message);
                }
            } catch (error) {
                console.log('Error fetching response: ', error);
                Alert.alert('Error', 'Error fetching response from server');
                setLoading(false);
            }
        }
    }

    // set up voice listeners
    useEffect(() => {
        // set up voice listeners
        Voice.onSpeechStart = speechStartHandler;
        Voice.onSpeechEnd = speechEndHandler;
        Voice.onSpeechResults = speechResultsHandler;
        Voice.onSpeechError = speechErrorHandler;

        // set up TTS listeners
        Tts.addEventListener('tts-start', (event) => console.log("start", event));
        Tts.addEventListener('tts-progress', (event) => console.log("progress", event));
        Tts.addEventListener('tts-finish', (event) => {console.log("finish", event); setSpeaking(false)});
        Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

        return () => {
            // destroy voice instance and remove all listeners
            Voice.destroy().then(Voice.removeAllListeners);
        }
    }, [])

    // listen for result changes then fetch response
    useEffect(() => {
        if (result) {
            fetchResponse();
        }
    }, [result]);

    const updateScrollView = () => {
        setTimeout(() => {
            ScrollViewRef?.current?.scrollToEnd({animated: true});
        }, 200);
    }

    console.log('result: ', result);

    return (
        <View className='flex-1' style={{ backgroundColor: styles.backgroundColor }}>
            <SafeAreaView className='flex-1 flex mx-5'>
                {/* chatbot icon */}
                <View className='flex-row justify-center mt-3'>
                    <View className='flex-1 justify-center'>
                        <Image source={require('../../assets/images/bot.png')} style={{height: wp(35), width: wp(35), alignSelf: 'center'}} />
                    </View>

                    {/* Settings icon to toggle Picker */}
                    <TouchableOpacity className='absolute right-0 top-2' onPress={() => navigation.navigate('Settings')} >
                        <Icon name="settings-sharp" style={{fontSize: hp(4), color: styles.subtextColor}} />
                    </TouchableOpacity>
                </View>

                {/* features/messages */}
                {
                    messages.length > 0? (
                        <View className='flex-1 space-y-3 mt-5'>
                            <Text style={{fontSize: wp(5), color: styles.textColor}} className='font-semibold ml-1'>
                                Assistant
                            </Text>
                            <View
                                style={{height: hp(60)}}
                                className='bg-neutral-200 rounded-3xl p-4'
                            >
                                <ScrollView
                                    ref={ScrollViewRef}
                                    bounces={false}
                                    className='space-y-4'
                                    showsVerticalScrollIndicator={false}
                                >
                                    {
                                        messages.map((message, index) => {
                                            if(message.role === 'assistant') {
                                                if(message.content.includes('https')) {
                                                    // AI Image
                                                    return (
                                                        <View key={index} className='flex-row justify-start'>
                                                            <View
                                                                className='bg-emerald-100 flex rounded-2xl rounded-tl-none p-2'
                                                            >
                                                                <Image
                                                                    source={{uri: message.content}}
                                                                    className='rounded-2xl'
                                                                    resizeMode='contain'
                                                                    style={{height: wp(60), width: wp(60)}}
                                                                />
                                                            </View>
                                                        </View>
                                                    )
                                                } else {
                                                    // Text
                                                    return (
                                                        <View
                                                            key={index}
                                                            style={{width: wp(70)}}
                                                            className='bg-emerald-100 rounded-xl rounded-tl-none p-2'
                                                        >
                                                            <Text style={{fontSize: wp(3.5)}} className='text-gray-700'>
                                                                {message.content}
                                                            </Text>
                                                        </View>
                                                    )
                                                }
                                            } else {
                                                // User Prompt
                                                return (
                                                    <View key={index} className='flex-row justify-end'>
                                                        <View
                                                            style={{width: wp(70)}}
                                                            className='bg-white rounded-xl rounded-tr-none p-2'
                                                        >
                                                            <Text style={{fontSize: wp(3.5)}} className='text-gray-700'>
                                                                {message.content}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View>
                    ) : (
                        <Features />
                    )
                }
                {/* Buttons  */}
                <View className='absolute bottom-0 w-full flex justify-center items-center mb-3'>
                    {
                        loading? (
                            // animated loading button
                            <FastImage
                                source={require('../../assets/images/loading2.gif')}
                                style={{height: hp(10), width: hp(10)}}
                            />
                        ) : 
                            recording? (
                                // animated button to signify that our voice is being captured
                                <TouchableOpacity onPress={stopRecording}>
                                    <FastImage
                                        source={require('../../assets/images/voiceLoading.gif')}
                                        className='rounded-full'
                                        style={{height: hp(10), width: hp(10)}}
                                    />
                                </TouchableOpacity>
                            ) : (
                                // button to start recording
                                <TouchableOpacity onPress={startRecording}>
                                    <Image
                                        source={require('../../assets/images/recordingIcon.png')}
                                        className='rounded-full'
                                        style={{height: hp(10), width: hp(10)}}
                                    />
                                </TouchableOpacity>
                            )
                        
                    }

                    {/* Button to clear messages */}
                    {
                        messages.length > 0 && (
                            <TouchableOpacity
                                onPress={clear}
                                className='bg-neutral-400 rounded-3xl p-3 px-7 absolute right-10'
                            >
                                <Text style={{fontSize: wp(4.5)}} className='text-white font-semibold '>
                                    Clear
                                </Text>
                            </TouchableOpacity>
                        )
                    }

                    {/* Button to stop speaking */}
                    {
                        speaking && (
                            <TouchableOpacity
                                onPress={stopSpeaking}
                                className='bg-red-400 rounded-3xl p-3 px-7 absolute left-10'
                            >
                                <Text style={{fontSize: wp(4.5)}} className='text-white font-semibold '>
                                    Stop
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </SafeAreaView>
        </View>
    );
}