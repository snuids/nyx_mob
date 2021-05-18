<template>
  <div
    :class="[
      'row full-width justify-center q-pa-md text-white',
      `bg-${backgroundColor}`
    ]"
  >
    <h4 class="col-xs-9 col-sm-6 col-md-4  row justify-center q-ma-none">
      <div style="max-width: 450px;">
        A fully featured todo App
      </div>
    </h4>
    <div class="col-xs-3 col-sm-6 col-md-4  row justify-end items-center">
      <div>
        <q-btn class="q-ma-sm" label="Try it now" color="black" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CallAction',
  props: {
    backgroundColor: {
      type: String,
      default: 'secondary'
    }
  }
}
</script>
