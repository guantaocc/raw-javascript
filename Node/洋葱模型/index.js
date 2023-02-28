class Middleware {
  constructor(){
    this.middlewares = []
  }
  use(fn){
    if(typeof fn !== 'function'){
      throw new Error('middware muse be a function')
    }
    this.middlewares.push(fn)
    return this
  }
  run(){
    const middlewares = this.middlewares
    function next(index){
      const currMiddleware = middlewares[index]
      if(!currMiddleware) return
      const ctx = {}
      const result = currMiddleware(ctx, next.bind(null, index + 1))
      return Promise.resolve(result)
    }
    return next(0)
  }
}

const middleware = new Middleware()

middleware.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(2)
})

middleware.use(async (ctx, next) => {
  console.log(3)
  await next()
  console.log(4)
})

middleware.run() // 1, 3, 4, 2
