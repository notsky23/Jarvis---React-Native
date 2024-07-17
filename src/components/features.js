import { View, Text, Image } from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTheme } from '../themes/ThemeContext';

export default function Features() {
    const { styles } = useTheme();

    return (
        <View style={{height: hp(60)}} className='space-y-2'>
            <Text style={{fontSize: wp(6.5), color: styles.textColor}} className='font-semibold'>Features</Text>
            <View className='bg-emerald-200 rounded-xl space-y-1 p-4'>
                <View className='flex-row items-center space-x-3 mb-2'>
                    <Image source={require('../../assets/images/chatgptIcon.png')} style={{height: hp(4), width: hp(4)}} />
                    <Text style={{fontSize: wp(4.8)}} className='text-gray-700 font-semibold'>ChatGPT</Text>
                </View>
                <Text style={{fontSize: wp(3.8)}} className='text-gray-500 font-medium'>
                    ChatGPT can provide you with insightful answers, creative ideas, and helpful guidance on a wide range of topics, making your tasks easier and more efficient.
                </Text>
            </View>
            <View className='bg-purple-200 rounded-xl space-y-1 p-4'>
                <View className='flex-row items-center space-x-3 mb-2'>
                    <Image source={require('../../assets/images/dalleIcon.png')} style={{height: hp(4), width: hp(4)}} />
                    <Text style={{fontSize: wp(4.8)}} className='text-gray-700 font-semibold'>DALL-E</Text>
                </View>
                <Text style={{fontSize: wp(3.8)}} className='text-gray-500 font-medium'>
                DALL-E can generate unique and visually stunning images from textual descriptions, bringing your imaginative concepts to life with remarkable detail and creativity.
                </Text>
            </View>
            <View className='bg-cyan-200 rounded-xl space-y-1 p-4'>
                <View className='flex-row items-center space-x-3 mb-2'>
                    <Image source={require('../../assets/images/smartaiIcon.png')} style={{height: hp(4), width: hp(4)}} />
                    <Text style={{fontSize: wp(4.8)}} className='text-gray-700 font-semibold'>SmartAI</Text>
                </View>
                <Text style={{fontSize: wp(3.8)}} className='text-gray-500 font-medium'>
                A powerful voice assistant with the abilities of ChatGPT and DALL-E, that can engage in smart conversations, provide detailed information, and create custom images from spoken descriptions, revolutionizing your interaction with technology.
                </Text>
            </View>
        </View>
    )
}