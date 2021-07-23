// Configuration for your app

module.exports = function(ctx) {
  return {
    // app boot (/src/boot)
    boot: ['i18n', 'axios', 'vuelidate'],
    css: ['app.styl'],
    extras: [
      'roboto-font',
      'material-icons', // optional, you are not bound to it
      'ionicons-v4',
      'mdi-v5',
      'fontawesome-v5'
    ],
    supportIE: true,
    build: {
      scopeHoisting: true,
      publicPath: '/'
      // vueRouterMode: 'history'
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // extendWebpack(cfg) {
      //   cfg.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /node_modules/
      //   })
      // }
    },
    devServer: {
      // https: true,
      port: 8888,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!

    framework: {
      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QInput',
        'QList',
        'QItem',
        'QField',
        'QItemSection',
        'QUploader',
        'QChip',
        'QSelect',
        'QRating',
        'QToggle',
        'QDate',
        'QTime',
        'QCard',
        'QCardSection',
        'QSeparator'
      ],
      directives: ['Ripple', 'TouchHold', 'TouchSwipe'],
      // Quasar plugins
      plugins: ['Notify', 'Dialog', 'Loading', 'AppFullscreen'],
      config: {
        loading: { delay: 0 },
        capacitor: {
          backButtonExit: false,
          backButton: false
        },
        cordova: {
          backButtonExit: false,
          backButton: true
        },
        brand: {
          primary: '#70B937',
          secondary: '#26A69A',
          accent: '#9C27B0',

          dark: '#465451',

          positive: '#67C23A',
          negative: 'orange',
          info: '#909399',
          warning: '#E6A23C'
        }
      }
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      // i18n: 'de' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: 'all',
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'statics/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack(cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration
        // appId: 'quasar-app'
      }
    }
  }
}
