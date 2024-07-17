import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getThemeStyles } from './ThemeStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('themeSetting');
            if (savedTheme) {
                setTheme(savedTheme); // Use saved theme if available
            } else {
                setTheme(systemTheme); // Otherwise, use system theme on first load
                AsyncStorage.setItem('themeSetting', systemTheme); // Save system theme as default
            }
        };
        loadTheme();
    }, [systemTheme]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        AsyncStorage.setItem('themeSetting', newTheme);
    };

    // Calculate styles based on the current theme
    const styles = getThemeStyles(theme);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, styles }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);