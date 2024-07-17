export const getThemeStyles = (theme) => {
    return {
        backgroundColor: theme === 'dark' ? '#333' : '#FFF',
        textColor: theme === 'dark' ? '#FFF' : '#374151',
        subtextColor: theme === 'dark' ? '#a3a3a3' : '#6B7280',
        borderColor: theme === 'dark' ? '#FFF' : '#374151',
    };
};