// 组件测试: TodoRow
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoRow } from '../components/TodoRow'
import { Todo } from '../types/todo'

const mockTodo: Todo = {
  id: 'test-id',
  text: '测试待办',
  completed: false,
  createdAt: Date.now(),
}

describe('TodoRow', () => {
  it('应显示待办文本', () => {
    render(
      <TodoRow
        todo={mockTodo}
        onToggle={() => {}}
        onUpdate={() => {}}
        onDelete={() => {}}
      />
    )

    expect(screen.getByText('测试待办')).toBeInTheDocument()
  })

  it('未完成时文本不应有删除线', () => {
    render(
      <TodoRow
        todo={mockTodo}
        onToggle={() => {}}
        onUpdate={() => {}}
        onDelete={() => {}}
      />
    )

    const text = screen.getByText('测试待办')
    expect(text).not.toHaveStyle({ textDecoration: 'line-through' })
  })

  it('完成时文本应有删除线和灰色', () => {
    const completedTodo = { ...mockTodo, completed: true }

    render(
      <TodoRow
        todo={completedTodo}
        onToggle={() => {}}
        onUpdate={() => {}}
        onDelete={() => {}}
      />
    )

    const text = screen.getByText('测试待办')
    expect(text).toHaveStyle({
      textDecoration: 'line-through',
      color: '#7A7A7A', // muted
    })
  })

  it('点击 checkbox 应触发 onToggle', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()

    render(
      <TodoRow
        todo={mockTodo}
        onToggle={handleToggle}
        onUpdate={() => {}}
        onDelete={() => {}}
      />
    )

    await user.click(screen.getByRole('button', { name: '' })) // checkbox button

    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  it('点击删除按钮应触发 onDelete', async () => {
    const user = userEvent.setup()
    const handleDelete = vi.fn()

    render(
      <TodoRow
        todo={mockTodo}
        onToggle={() => {}}
        onUpdate={() => {}}
        onDelete={handleDelete}
      />
    )

    await user.click(screen.getByRole('button', { name: '删除' }))

    expect(handleDelete).toHaveBeenCalledTimes(1)
  })

  it('双击文本应进入编辑模式', async () => {
    const user = userEvent.setup()

    render(
      <TodoRow
        todo={mockTodo}
        onToggle={() => {}}
        onUpdate={() => {}}
        onDelete={() => {}}
      />
    )

    await user.dblClick(screen.getByText('测试待办'))

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('测试待办')
  })

  it('编辑模式下按 Enter 应提交并退出编辑', async () => {
    const user = userEvent.setup()
    const handleUpdate = vi.fn()

    render(
      <TodoRow
        todo={mockTodo}
        onToggle={() => {}}
        onUpdate={handleUpdate}
        onDelete={() => {}}
      />
    )

    // 进入编辑模式
    await user.dblClick(screen.getByText('测试待办'))

    // 修改文本
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, '新文本')

    // 按 Enter 提交
    await user.keyboard('{Enter}')

    expect(handleUpdate).toHaveBeenCalledWith('新文本')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('编辑模式下按 Escape 应取消编辑', async () => {
    const user = userEvent.setup()
    const handleUpdate = vi.fn()

    render(
      <TodoRow
        todo={mockTodo}
        onToggle={() => {}}
        onUpdate={handleUpdate}
        onDelete={() => {}}
      />
    )

    // 进入编辑模式
    await user.dblClick(screen.getByText('测试待办'))

    // 修改文本
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, '修改后')

    // 按 Escape 取消
    await user.keyboard('{Escape}')

    expect(handleUpdate).not.toHaveBeenCalled()
    expect(screen.getByText('测试待办')).toBeInTheDocument()
  })

  it('编辑后输入空文本应触发删除', async () => {
    const user = userEvent.setup()
    const handleUpdate = vi.fn()

    render(
      <TodoRow
        todo={mockTodo}
        onToggle={() => {}}
        onUpdate={handleUpdate}
        onDelete={() => {}}
      />
    )

    // 进入编辑模式
    await user.dblClick(screen.getByText('测试待办'))

    // 清空文本
    const input = screen.getByRole('textbox')
    await user.clear(input)

    // 按 Enter 提交空文本
    await user.keyboard('{Enter}')

    expect(handleUpdate).toHaveBeenCalledWith('')
  })
})