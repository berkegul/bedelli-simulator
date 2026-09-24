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
      // React Compiler kuralları. Proje compiler kullanmıyor; bu desenlerin
      // çoğu (Animated.Value ref'i, shared value ataması) bugün doğru
      // çalışıyor. Uyarı olarak kalıyorlar ve dosyasına dokunan iş onları
      // temizliyor (yayin-plani.md · S12). Sayı sıfıra inince "error" olacak.
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      // HTML için yazılmış bir kural; React Native <Text> içinde kesme işareti
      // ve tırnak kaçırılmadan yazılıyor.
      'react/no-unescaped-entities': 'off',
    },
  },
]);
