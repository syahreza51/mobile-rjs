InspectorRjs (Mobile App)
Proyek ini dibangun menggunakan React Native v0.83.1. Aplikasi ini dirancang untuk sistem inspeksi menggunakan integrasi database lokal dan fitur native lainnya.

📋 Prasyarat
Sebelum memulai, pastikan Anda telah menginstal:

Node.js (LTS)

Android Studio & SDK Platform (API Level 34/35 direkomendasikan)

Java Development Kit (JDK) 17 atau yang lebih baru

🚀 Memulai (Quick Start)
1. Instalasi Dependensi
Setelah melakukan clone repository, jalankan perintah berikut di root folder:

Bash

npm install
2. Menjalankan Metro Bundler
Jalankan server JavaScript (Metro) terlebih dahulu:

Bash

# Menjalankan Metro dengan reset cache (direkomendasikan setelah clone)
npx react-native start --reset-cache
3. Menjalankan Aplikasi di Android
Buka terminal baru dan jalankan:

Bash

npx react-native run-android
🛠️ Troubleshooting & Pembersihan Build
Jika Anda menemui error saat build (seperti EADDRINUSE atau error CMake/Ninja), ikuti langkah pembersihan ini:

Mengatasi Port 8081 Terpakai
Jika muncul error address already in use :::8081:

PowerShell

# Windows (PowerShell)
stop-process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess -Force
Clean Build Android
Jika folder dipindahkan atau terjadi error pada library native (Reanimated/Worklets):

Hapus folder build manual:

PowerShell

cd android
rm -rf .gradle .cxx build app/build
./gradlew clean
cd ..
Jalankan ulang npx react-native run-android.

📦 Library Utama yang Digunakan
Navigation: react-navigation

Storage: @react-native-async-storage/async-storage

Database: react-native-quick-sqlite

UI & Animation: react-native-reanimated, react-native-vector-icons, react-native-svg

Utilities: react-native-image-picker, @react-native-community/netinfo

📂 Struktur Folder Utama
/android - Konfigurasi native Android.

/src - Kode sumber aplikasi (Komponen, Screen, Hooks).

App.tsx - Entry point utama aplikasi.

🤝 Kontribusi
Pastikan selalu melakukan git pull sebelum bekerja.

Jangan pernah melakukan commit pada folder node_modules, .cxx, atau folder build di dalam direktori android.
