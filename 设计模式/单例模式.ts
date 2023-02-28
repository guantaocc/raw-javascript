class SingleClass {
  static instance: SingleClass
  static getInstance(){
    return this.instance ? this.instance : (this.instance = new Single(...args))
  }
  private constructor(){}
}

// warning: 构造函数设置为私有
// @ts-expect-error
const instance = new SingleClass()

const instance2 = SingleClass.getInstance()