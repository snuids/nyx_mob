import { Notify } from 'quasar'
export default {
  created() {
    document.addEventListener(
      'offline',
      function(e) {
        Notify.create({
          message: "Vous n'êtes pas connecté à l'internet",
          timeout: 5000,
          color: 'red',
          position: 'center'
        })
      },
      false
    )
  }
}
