// 格式化日期

export function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  let hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()
  let min = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()
  let sec = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + hour + ':' + min + ':' + sec
}