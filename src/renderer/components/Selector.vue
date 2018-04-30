<template>
  <div class="selector">
    <div class="d-flex flex-wrap">
      <div class="p-2 item"
           :class="{'active':val===it.name}"
           v-for="(it,i) in dChooses" @click="choosesThis(it)">
        {{it.name}}
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "Selector",
    model: {
      prop: 'val'
    },
    props: {
      val: String,
      chooses: {
        type: Array,
        default: []
      },
    },
    data() {
      return {
        mVal: this.val,
        dChooses: this.chooses,
      }
    },
    components: {},
    methods: {
      choosesThis(c) {
        this.mVal = c.name;
        this.$emit('input', this.mVal);
      }
    },
    mounted() {
    }
  };
</script>

<style lang="scss">
  .selector {
    display: flex;
    .item {
      border: 1px solid #e2e3e5;
      margin: 0 5px 5px;
      min-width: 80px;
      text-align: center;
      cursor: pointer;
      &.active {
        border-color: red;
        color: red;
      }
    }
  }
</style>
