import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../themes/ThemeContext';

export default function WelcomeScreen() {
    const navigation = useNavigation();
    const { styles } = useTheme();

    return (
        <SafeAreaView className="flex-1 flex justify-around" style={{ backgroundColor: styles.backgroundColor }}>
            <View className='space-y-2'>
                <Text style={{fontSize: wp(10), color: styles.textColor}} className='text-center font-bold'>
                    Jarvis
                </Text>
                <Text style={{fontSize: wp(4), color: styles.subtextColor}} className='text-center tracking-wider font-semibold'>
                    The future is here, powered by AI.
                </Text>
            </View>
            <View className='flex-row justify-center'>
                <Image source={require('../../assets/images/welcome.png')} style={{height: wp(75), width: wp(75)}} />
            </View>
            <TouchableOpacity
                className='bg-emerald-600 mx-5 p-4 rounded-2xl'
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={{fontSize: wp(6)}} className='text-white text-center font-bold'>Get Started</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}