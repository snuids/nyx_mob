<template>
  <div>
    <q-banner rounded class="bg-primary text-white">
      <template v-slot:avatar>
        <q-icon name="insert_comment" color="white" />
      </template>
      {{ comment }}
    </q-banner>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  components: {},
  data() {
    return {}
  },
  props: {
    comment: {
      type: String
    }
  },
  methods: {}
}
</script>

<style></style>
