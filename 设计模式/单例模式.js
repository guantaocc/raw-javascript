// 1
class Single {
  static instance
  static getInstance(...args){
    return this.instance ? this.instance : (this.instance = new Single(...args))
  }
  constructor(opts){
   
  }
}