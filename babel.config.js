module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        crypto: 'react-native-quick-crypto',
                        stream: 'stream-browserify',
                        buffer: '@craftzdog/react-native-buffer',
                        '@components': './components',
                        '@utils': './utils',
                        '@assets': './assets',
                        '@navigation': './navigation',
                        '@screens': './screens',
                        '@storage': './storage',
                        '@state': './state',
                        '@hooks': './hooks',
                        '@constants': './constants',
                    },
                },
            ],
            'react-native-reanimated/plugin',
        ],
    };
};
