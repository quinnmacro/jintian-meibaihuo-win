// 单元测试: Todo 数据模型
import { describe, it, expect } from 'vitest'
import { createTodo, Todo } from '../types/todo'

describe('Todo 类型', () => {
  it('createTodo 应创建有效的 Todo 对象', () => {
    const todo = createTodo('测试待办')

    expect(todo.text).toBe('测试待办')
    expect(todo.completed).toBe(false)
    expect(todo.id).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/) // UUID format
    expect(todo.createdAt).toBeTypeOf('number')
    expect(todo.createdAt).toBeLessThanOrEqual(Date.now())
  })

  it('createTodo 应 trim 文本', () => {
    const todo = createTodo('  有空格的待办  ')

    expect(todo.text).toBe('有空格的待办')
  })

  it('createTodo 应忽略空文本', () => {
    // 注意：createTodo 只创建对象，不验证空文本
    // 空文本验证在 store 层
    const todo = createTodo('')
    expect(todo.text).toBe('')
  })

  it('Todo 结构应符合接口定义', () => {
    const todo: Todo = {
      id: 'uuid-123',
      text: '待办事项',
      completed: false,
      createdAt: 1234567890,
    }

    expect(todo).toHaveProperty('id')
    expect(todo).toHaveProperty('text')
    expect(todo).toHaveProperty('completed')
    expect(todo).toHaveProperty('createdAt')
  })
})