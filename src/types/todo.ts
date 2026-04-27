// Todo 数据模型
// 参考原项目 Todo.swift

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number // timestamp
}

export function createTodo(text: string): Todo {
  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  }
}