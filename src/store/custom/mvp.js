import axios from 'axios'
import moment from 'moment'

export default {
  namespaced: true,
  state: {
    timer: 5,
    targetDate: {
      dateFrom: '',
      dateTo: '',
      dateFromShort: '',
      dateToShort: ''
    },
    screenSize: {
      windowHeight: '',
      windowWidth: '',
      appWidth: '',
      appHeight: ''
    },
    slack_api_key: ''
  },
  getters: {
    // exemple : this.$store.commit("targetDate", { dateObj: obj });
    // exemple : this.$store.state.custom.mvp.date
    // exemple : this.$store.getters.targetDate
    // exemple : this.$store.getters.screenSize.windowHeight
    targetDate: state => state.targetDate,
    screenSize: state => state.screenSize,
    timer: state => state.timer,
    slackKey: state => state.slack_api_key
  },
  mutations: {
    mutate_screenSize(state, payload) {
      state.screenSize = payload.data
    },
    mutate_targetDate(state, payload) {
      state.targetDate = payload.dateObj
    }
  },
  actions: {
    async sendMessageToSlack({ commit }, payload) {
      var firstLine = ''
      var mentionned = ''
      var title = ''
      var channel = ''

      // mentionned users string preparation
      var slack = process.env.SLACK_MENTION
      var mentionned_UserList = []

      for (var i in slack) {
        mentionned_UserList.push({
          user: slack[i].split(':')[0],
          id: slack[i].split(':')[1]
        })
      }

      for (var i = 0; i < mentionned_UserList.length; i++) {
        if (i === mentionned_UserList.length - 1) {
          mentionned += mentionned_UserList[i].id
        } else {
          mentionned += mentionned_UserList[i].id + ' '
        }
      }
      // message building by type
      var poType = null
      if (payload.poType !== 'PO-NYX') poType = payload.poType

      if (payload.type === 'direct') {
        // building direct slack message
        channel = '#appro'
        title = 'Message de ' + payload.user
        firstLine =
          '[ ' +
          payload.user +
          ' | ' +
          moment(payload.date).format('DD/MM/YYYY') +
          ' ]\n' +
          payload.msg
      } else if (payload.type === 'po') {
        // building message from a producer
        channel = '#appro'
        title = 'Tournée de ramassage : ' + payload.supplier
        firstLine = '[ ' + payload.user + ' | ' + payload.supplier + ' | '
        if (poType !== null) {
          firstLine += poType + ' | '
        }
        firstLine +=
          moment(payload.date).format('DD/MM/YYYY') + ' ]\n' + payload.msg
      } else if (payload.type === 'problem') {
        // building report problem message
        channel = '#ramassage'
        title = 'Tournée de ramassage : problème reporté'
        firstLine = '[ ' + payload.user + ' | ' + payload.supplier + ' | '
        if (poType !== null) {
          firstLine += poType + ' | '
        }
        firstLine += moment(payload.date).format('DD/MM/YYYY') + ' ]'
      }

      var msg2send = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: title
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: mentionned
          }
        },
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: firstLine
          }
        }
      ]

      // if payload.type = 'problem' we need to append the list of items
      // with problems
      if (payload.type === 'problem') {
        // if less > 0
        if (payload.problems.less.length > 0) {
          // add header text
          msg2send.push({ type: 'divider' })
          var head = {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Il manque des produits :*'
            }
          }
          msg2send.push(head)

          // then add all items
          for (var i = 0; i < payload.problems.less.length; i++) {
            var toAdd = {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  '*Produit :* ' +
                  payload.problems.less[i].title +
                  '\n*SKU :* ' +
                  payload.problems.less[i].sku +
                  '\n*Quantité reçue :* ' +
                  payload.problems.less[i].received +
                  ' / ' +
                  payload.problems.less[i].quantity
              }
            }
            msg2send.push(toAdd)
          }
        }

        // if more > 0
        if (payload.problems.more.length > 0) {
          // add header text
          msg2send.push({ type: 'divider' })
          var head = {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Il a des produits en surplus :*'
            }
          }
          msg2send.push(head)

          // then add all items
          for (var i = 0; i < payload.problems.more.length; i++) {
            var toAdd = {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  '*Produit :* ' +
                  payload.problems.more[i].title +
                  '\n*SKU :* ' +
                  payload.problems.more[i].sku +
                  '\n*Quantité reçue :* ' +
                  payload.problems.more[i].received +
                  ' / ' +
                  payload.problems.more[i].quantity
              }
            }
            msg2send.push(toAdd)
          }
        }

        // if new > 0
        if (payload.problems.new.length > 0) {
          // add header text
          msg2send.push({ type: 'divider' })
          var head = {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Il y a des produits non commandé :*'
            }
          }
          msg2send.push(head)

          // then add all items
          for (var i = 0; i < payload.problems.new.length; i++) {
            var toAdd = {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  '*Produit :* ' +
                  payload.problems.new[i].title +
                  '\n*Quantité reçue :* ' +
                  payload.problems.new[i].received +
                  ' / ' +
                  payload.problems.new[i].quantity
              }
            }
            msg2send.push(toAdd)
          }
        }

        msg2send.push({ type: 'divider' })
      }

      var slackObject = {
        channel: channel,
        blocks: msg2send
      }
      var slackUrl =
        payload.apiUrl + process.env.SLACK_URL + '?apikey=' + payload.apiKey

      return axios.post(slackUrl, slackObject)
    }
  }
}
