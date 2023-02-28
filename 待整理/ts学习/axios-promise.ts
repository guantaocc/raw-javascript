import axios from 'axios'

const url = 'https://jsonplaceholder.typeicode.com/todos/1'

interface Todo {
  id: number,
  title: string,
  completed: boolean
}

// 返回数据类型推断 ?
axios.get(url).then(result => {
  const todo = result.data as Todo

  handleToDo(todo.id, todo.title)
})

const handleToDo = (id: number, title: string) => {
  console.log(id, title)
}