# Mes Voisins Producteurs - Picking Application

![Badge](https://img.shields.io/badge/version-0.0.5-orange)
![Badge](https://img.shields.io/badge/made_with-vue.js-informational)
![Badge](https://img.shields.io/badge/made_with-Quasar-informational)

![MVP Logo](https://www.pointlocal.fr/wp-content/uploads/2019/02/Mes-Voisins-Producteurs_4.jpg)
MvpPicking is a module for the [Nyx](https://github.com/snuids/nyx) platform using the [Quasar](https://quasar.dev/) framework.

## Setup

- clone the project
- cd nyx_mob
- npm install

## Development

- Single page application
  `quasar dev`
- Cordova for Android
  `quasar dev -m cordova -T android`

## Build

### Before building

- modify the `apiurl` property in **src/store/index.js** according with your server url.
- update `version` in **package.json**

### Android building

[(source)](https://quasar.dev/quasar-cli/developing-cordova-apps/publishing-to-store)

- Build the apk
  `quasar build -m cordova -T android`
  You'll find your builded apk under **dist/cordova/android/apk/release**
- Generate private keys
  `keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 20000`
- Signing apk
  `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore <path-to-unsigned-apk-file> alias_name`
- Optimize apk
  `zipalign -v 4 <path-to-same-apk-file> HelloWorld.apk`

## Configuration

Made in .env file

- AUTO_REFRESH=30
  Time interval between two "purchase orders list" refresh. Default is 30 seconds.
- SERVER_URL='...'
  Where the application connect to your server.
- SLACK_URL='...'
  Endpoint url for slack messages been pushed.
- SLACK*MENTION='{},{},...'
  Contain user list to be mentionned in slack when a message is pushed from application. \_No space allowed* !

# Version

0.0.5
