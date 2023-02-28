/**
 * 几种特殊的类型和转换
 * 值: null undefined boolean string number symbol  void
 * 引用: object array function class
 * 枚举: enum
 * 接口: interface
 * 泛型: <>
 * 
 */

/** base: 类型推断 */

let color: string = 'red'
let date: Date = new Date()
let b = true
let nothing: null = null


/** 引用 */
let arrays: string[] = ['base', 'second']
let obj = { name: 'zhansan', age: 11, hobby: { first: 'ball', second: 'swaming'} }

let sum: (num: string) => void = (num) => { console.log(num) } 
let sum2 = (num: string): void => { console.log(num) }

sum('1')

let throwError = function (message: string): never {
  throw new Error(message)
}

interface person {
  name: string,
  age: number
}


const showObj = ({ name, age }: person): void => {
  console.log(name, age)
}

showObj(obj)

/** 解构 */
const { age }: { age: number } = obj
const { hobby: { first, second }} : { hobby: { first: string, second: string
}} = obj




/** 联合类型 */
let zero: boolean | number = false

let arrayZero: (boolean | number)[] = [0, false]


/** 类型别名 */
type Falsey = [number, string, string]
  
  
/** 元组 tuple */
let pos: Falsey  = [0, '0', '0']
// pos[0] = '1' // error


/** 类 */
class Car { }
let car: Car = new Car()

class Person {
  name: string = ''
  // age: number

  // constructor age params
  constructor(public age: number) {
    this.age = age
  }
  public say() {
    console.log('hello')
  }
}

const person = new Person(13)
person.say()
console.log(person.name)


class Mike extends Person {
  constructor(age: number, public hobby: string) {
    super(age)
    this.hobby = hobby
  }
}

const mike = new Mike(13, '12')
mike.say()
console.log(mike.age, mike.hobby)