import { Notify } from 'quasar'
export default {
  created() {
    window.addEventListener('offline', function(e) {
      Notify.create({
        message: "Vous n'êtes pas connecté à l'internet",
        timeout: 5000,
        color: 'red',
        position: 'center'
      })
    })
    // console.log('bonjour mixin')

    window.addEventListener('online', function(e) {
      // console.log('online')
    })
  }
}
