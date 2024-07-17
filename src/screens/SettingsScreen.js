import { View, Text, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../themes/ThemeContext';

// PickerStyle for simplification
const pickerStyle = {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'gray',
    backgroundColor: '#e5e5e5',
    color: '#374151',
    width: wp(60)
};

export default function SettingsScreen() {
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const navigation = useNavigation();
    const { theme: globalTheme, setTheme: setGlobalTheme } = useTheme();
    const [localTheme, setLocalTheme] = useState(globalTheme);
    const [engines, setEngines] = useState([]);
    const [selectedEngine, setSelectedEngine] = useState('');

    // Initialize original settings once
    const [originalSettings, setOriginalSettings] = useState({
        engine: '',
        voice: '',
        theme: globalTheme
    });

    const styles = useMemo(() => {
        return {
            backgroundColor: localTheme === 'dark' ? '#333' : '#FFF',
            textColor: localTheme === 'dark' ? '#FFF' : '#374151',
            subtextColor: localTheme === 'dark' ? '#CBD5E1' : '#6B7280',
            borderColor: localTheme === 'dark' ? '#FFF' : '#374151',
        };
    }, [localTheme]);

    // Load initial settings
    useEffect(() => {
        const loadSettings = async () => {
            const savedEngine = await AsyncStorage.getItem('selectedEngine');
            const savedVoice = await AsyncStorage.getItem('selectedVoice');
            const savedTheme = await AsyncStorage.getItem('themeSetting');
            
            if (savedTheme) {
                setLocalTheme(savedTheme);
                setGlobalTheme(savedTheme);
            }
            if (savedEngine) {
                setSelectedEngine(savedEngine);
                fetchEngines(savedEngine);
                fetchVoices(savedEngine, savedVoice);
            } else {
                fetchEngines();
            }
        };

        loadSettings();
        return () => Tts.stop();  // Clean up TTS when leaving
    }, []);

    // fetch available engines
    const fetchEngines = async (savedEngine, savedVoice) => {
        let attempts = 0;
        const maxAttempts = 5;

        const tryInitTts = async () => {
            try {
                await Tts.getInitStatus();
                const engines = await Tts.engines();
                setEngines(engines.map(engine => ({ label: engine.label, value: engine.name })));
        
                if (engines.length > 0) {
                    console.log('Saved Engine: ', savedEngine);
                    const engineToUse = savedEngine || engines[0].name;
                    setSelectedEngine(engineToUse);
                    fetchVoices(engineToUse, savedVoice);
                }
            } catch (err) {
                if (attempts < maxAttempts) {
                    attempts++;
                    console.log(`TTS initialization attempt ${attempts}: retrying...`);
                    setTimeout(tryInitTts, 1000); // Retry after 1 second
                } else {
                    console.error("TTS init failed after several attempts", err);
                    // Optionally update the UI to inform the user that TTS is not available
                }
            }
        }
        
        tryInitTts();
    };

    // fetch available voices
    const fetchVoices = async (engine, voice) => {
        let attempts = 0;
        const maxAttempts = 5;

        const tryInitTts = async () => {
            try {
                await Tts.getInitStatus();
                await Tts.setDefaultEngine(engine);
                const availableVoices = await Tts.voices();
        
                // Create Picker items with unique keys
                const pickerItems = availableVoices.map(voice => ({
                    label: voice.name,
                    value: voice.id,
                    key: voice.id  // Ensure each item has a unique key
                }));
                setVoices(pickerItems);
        
                // Load saved voice setting
                const currentVoice = voice || pickerItems[0]?.value;
                setSelectedVoice(currentVoice);
                setOriginalSettings(prev => ({ ...prev, voice: currentVoice, theme: globalTheme }));
            } catch (err) {
                if (attempts < maxAttempts) {
                    attempts++;
                    console.log(`TTS initialization attempt ${attempts}: retrying...`);
                    setTimeout(tryInitTts, 1000); // Retry after 1 second
                } else {
                    console.error("TTS init failed after several attempts", err);
                    // Optionally update the UI to inform the user that TTS is not available
                }
            }
        }
        
        tryInitTts();
    };

    const handleEngineChange = async (engine) => {
        setSelectedEngine(engine);
        fetchVoices(engine);
    };

    const setVoice = async (voiceId) => {
        setSelectedVoice(voiceId);
    };

    // Save/Apply Settings
    const applySettings = async () => {
        await AsyncStorage.setItem('selectedEngine', selectedEngine);
        await AsyncStorage.setItem('selectedVoice', selectedVoice);
        await AsyncStorage.setItem('themeSetting', localTheme);
        setGlobalTheme(localTheme); // Apply the theme globally
        navigation.navigate('Home');
    };

    // Cancel Settings
    const cancelSettings = async () => {
        setSelectedEngine(originalSettings.engine);
        setSelectedVoice(originalSettings.voice);
        setLocalTheme(originalSettings.theme); /// Reset local theme to original
        navigation.navigate('Home');
    };

    // Toggle Theme
    const toggleTheme = () => {
        const newTheme = localTheme === 'dark' ? 'light' : 'dark';
        setLocalTheme(newTheme);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: styles.backgroundColor }}>
            {/* Header */}
            <View className='space-y-2 mt-7'>
                <Text style={{fontSize: wp(10), color: styles.textColor}} className='text-gray-700 text-center font-bold'>
                    Settings
                </Text>
            </View>

            {/* Light/Dark Mode Switch */}
            <View className="flex-row justify-between items-center mt-7 px-5 py-2">
                <Text style={{ fontSize: wp(4), color: styles.textColor }}>
                    Dark Mode:
                </Text>
                <Switch
                    style={{
                        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],  // Scale both X and Y by 1.2 times
                        marginRight: 5
                    }}
                    value={localTheme === 'dark'}
                    trackColor={{ false: "#767577", true: "#b9ff66" }}
                    thumbColor={localTheme === 'dark' ? "#f4f3f4" : "#f4f3f4"}
                    onValueChange={toggleTheme}
                />
            </View>

            {/* Engine Picker */}
            {selectedVoice && (
                <View className='flex-row items-center mt-7 px-5 py-2'>
                    <Text
                        className='mr-7'
                        style={{fontSize: wp(4), color: styles.textColor}}
                    >
                        Select Engine:
                    </Text>
                    <RNPickerSelect
                        value={selectedEngine}
                        onValueChange={handleEngineChange}
                        items={engines}
                        style={{
                            inputIOS: pickerStyle,
                            inputAndroid: pickerStyle,
                        }}
                        useNativeAndroidPickerStyle={false}
                    />
                </View>
            )}

            {/* Voice Picker */}
            {selectedVoice && (
                <View className='flex-row items-center mt-7 px-5 py-2'>
                    <Text
                        className='mr-7'
                        style={{fontSize: wp(4), color: styles.textColor}}
                    >
                        Select Voice:
                    </Text>
                    <RNPickerSelect
                        value={selectedVoice}
                        onValueChange={setVoice}
                        items={voices}
                        style={{
                            inputIOS: pickerStyle,
                            inputAndroid: pickerStyle,
                        }}
                        useNativeAndroidPickerStyle={false}
                    />
                </View>
            )}

            {/*Buttons */}
            <View className="flex-1 justify-end mb-7">
                <View className="flex-row justify-around mx-5">
                    <TouchableOpacity
                        className='bg-gray-500 flex-1 mx-5 p-3 rounded-2xl'
                        onPress={applySettings}
                    >
                        <Text style={{fontSize: wp(6)}} className='text-white text-center font-bold'>Apply</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className='bg-red-500 flex-1 mx-5 p-3 rounded-2xl'
                        onPress={cancelSettings}
                    >
                        <Text style={{fontSize: wp(6)}} className='text-white text-center font-bold'>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            
        </SafeAreaView>
    );
}