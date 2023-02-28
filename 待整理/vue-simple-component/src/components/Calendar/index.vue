<template>
  <div class="calendar">
    <button @click="prev">上一月</button>
    <button @click="curr">下一月</button>
    <date-table ref="dateTable"></date-table>
  </div>
</template>

<script>
import DateTable from './DateTable.vue'
export default {
  name: 'Calendar',
  components: {
    DateTable,
  },
  methods: {
    prev(){
      this.$refs.dateTable.prevRows()
    },
    curr(){
      this.$refs.dateTable.nextRows()
    }
  }
}
</script>

<style lang="less" scoped></style>
