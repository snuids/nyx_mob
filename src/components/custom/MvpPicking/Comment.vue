<template>
  <div>
    <q-banner rounded class="bg-primary text-white">
      <template v-slot:avatar>
        <q-icon name="insert_comment" color="white" />
      </template>
      <q-icon
        name="close"
        color="white"
        class="float-right"
        @click="confirmDelete"
      />
      <div class="row flex">
        <div class="col-xs-12 col-sm-auto q-mr-md con-name">
          {{ comment.user }}
        </div>
        <div class="col-xs-12 col-sm-auto">
          (le <span class="com-date">{{ comment.date | dateFrench }}</span> à
          <span class="com-date">{{ comment.date | onlyTime }}</span
          >)
        </div>
      </div>
      <div class="row text-caption com-msg">{{ comment.msg }}</div>
    </q-banner>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Comment',
  components: {},
  data() {
    return {}
  },
  props: {
    comment: {
      type: Object
    }
  },
  methods: {
    confirmDelete() {
      this.$q
        .dialog({
          title: 'Confirmation',
          message:
            'Voulez-vous vraiment effacer ce commentaire? Cette action est définitive et irréversible!',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$emit('deleteComment', this.comment)
        })
    }
  }
}
</script>

<style>
.com-msg {
  margin-left: 25px;
}
.com-name {
  font-weight: bold;
  margin-right: 10px;
  font-style: italic;
}
.com-date {
  margin-left: 5px;
  margin-right: 5px;
}
.com-time {
  margin-left: 5px;
}
</style>
