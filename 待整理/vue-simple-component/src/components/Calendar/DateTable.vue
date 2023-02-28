<template>
  <div class="calendar">
    <div>{{formatDate()}}</div>
    <table class="date-table">
      <thead>
        <th v-for="item in weekDays" :key="item">
          {{item}}
        </th>
      </thead>
      <tbody>
        <tr v-for="(row, index) in days" :key="index">
          <td v-for="(date, index) in row" :key="index" class="td-cell">
            <slot :date="date">
              <div :class="['date-cell', date.prev && 'date-prev', date.next && 'date-next', date.current && 'is-current']">
                {{date.text}}
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'DateTable',
  props: {
    date: Date,
  },
  data() {
    return {
      dayjs: null,
      // 当前 42数组 第一天
      currentFirstDate: null,
      // 本月 当前时间
      currentDate: null,
      days: [],
      weekDays : ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }
  },
  mounted() {
    this.currentDate = new Date()
    this.renderRows()
  },
  methods: {
    formatDate() {
      return dayjs(this.currentDate).format('YYYY年MM月')
    },
    prevRows() {
      this.currentDate = dayjs(this.currentDate).subtract(1, 'month')
      this.renderRows()
    },
    nextRows() {
      this.currentDate = dayjs(this.currentDate).add(1, 'month')
      this.renderRows()
    },
    rangeRows(prevNum, currNum, currentDate) {
      // 根据天数 着色
      let days = []
      const dateArr = Array.from({ length: 42 }).map((_, index) => {
        return dayjs(this.currentFirstDate).add(index, 'days')
      }).map((item, index) => {
        if (index < prevNum) {
          return {
            text: item,
            prev: true,
          }
        } else if (index >= prevNum && index < prevNum + currNum) {
          return {
            text: item,
            currDate: true,
            current: dayjs(item).date() === dayjs(currentDate).date()
          }
        } else {
          return {
            text: item,
            next: true,
          }
        }
      })

      for (let index = 0; index < dateArr.length; index += 7) {
        days.push(
          dateArr.slice(index, index + 7).map(item => {
            return {
              ...item,
              text: dayjs(item.text).date()
            }
          })
        )
      }
      // 设置days
      console.log(days)
      this.days = days
    },
    renderRows() {
      // 当月 1号
      let dateOne = dayjs(this.currentDate).date(1)
      console.log(dateOne.day())
      // 获取当前周 周一的日期 和 offset
      // 如果是周日则需要 获取上一周的 周一
      let firstDateOfWeek = dateOne.day()
        ? dateOne.day(1)
        : dayjs(dateOne).subtract(1, 'day').day(1)
      // 第一天和当前周相差天数
      const prevDayNum = dayjs(dateOne).diff(dayjs(firstDateOfWeek), 'days')
      const currentMouthDayNum = dayjs(this.currentDate).daysInMonth()
      // const nextMouthDayNum = 42 - prevDayNum - currentMouthDayNum
      this.currentFirstDate = firstDateOfWeek
      this.rangeRows(prevDayNum, currentMouthDayNum, this.currentDate)
    },
  },
}
</script>

<style lang="less" scoped>
.date-table {
  border-collapse: collapse;
}
.td-cell {
  display: table-cell;
  border: 1px solid #ebeef5;
}
.date-cell {
  width: 40px;
  height: 40px;
  text-align: center;
  cursor: pointer;
  &.date-prev,
  &.date-next {
    color: #ccc;
  }
  &.is-current {
    color: #1989fa;
    background-color: #f2f8fe;
  }

  &:hover {
    color: #1989fa;
    background-color: #f2f8fe;
  }
}
</style>
