// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'public/*', '.expo/*'],
  },
  {
    rules: {
      // React Compiler kuralları (yayin-plani.md · S12, S12b). Jest kurucusu
      // ve worklet'lerdeki yanlış pozitifler dosyasında gerekçesiyle kapatıldı.
      'react-hooks/refs': 'error',
      'react-hooks/immutability': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react-hooks/purity': 'error',
      // HTML için yazılmış bir kural; React Native <Text> içinde kesme işareti
      // ve tırnak kaçırılmadan yazılıyor.
      'react/no-unescaped-entities': 'off',
    },
  },
]);
