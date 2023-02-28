const throttle = (fn, wait = 200) => {
  let last = 0
  return function(...args){
    let now = Date.now()
    if(now - last >= wait){
      fn.apply(this, args)
      last = now
    }
  }
}

export default throttle