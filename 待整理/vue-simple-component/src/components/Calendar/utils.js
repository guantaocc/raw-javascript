export const getFirstDayOfMonth = (date) => {
  const temp = new Date(date.getTime());
  temp.setDate(1);
  // 获取当前时间第一天
  return temp.getDay();
}

export const getDayCountOfMonth = function(year, month) {
  if (isNaN(+month)) return 31;

  return new Date(year, +month + 1, 0).getDate();
};

export const getDayCountOfYear = function(year) {
  const isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  return isLeapYear ? 366 : 365;
};

export const prevDate = function(date, amount = 1) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - amount);
};

export const nextDate = function(date, amount = 1) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
};

export const getStartDateOfMonth = function(year, month) {
  const result = new Date(year, month, 1);
  const day = result.getDay();

  if (day === 0) {
    return prevDate(result, 7);
  } else {
    return prevDate(result, day);
  }
};