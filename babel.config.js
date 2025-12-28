module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // WAJIB DI BARIS TERAKHIR
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
