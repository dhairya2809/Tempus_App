module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@src': './src',
          '@assets': './src/assets',
          '@components': './src/components',
          '@atoms': './src/components/atoms',
          '@molecules': './src/components/molecules',
          '@organisms': './src/components/organisms',
          '@scenes': './src/scenes',
          '@store': './src/store',
          '@styles': './src/styles',
          '@utils': './src/utils',
          '@services': './src/services',
          '@locales': './src/locales',
        },
      },
    ],
  ],
};
