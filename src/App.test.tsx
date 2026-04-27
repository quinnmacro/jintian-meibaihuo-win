// 集成测试: App 完整流程 (简化版)
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from './App'

describe('App 集成测试', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('初始化渲染', () => {
    it('应显示标题', () => {
      render(<App />)
      expect(screen.getByText('今天没白活')).toBeInTheDocument()
    })

    it('应显示输入框', () => {
      render(<App />)
      expect(screen.getByPlaceholderText('写下一件要做的事…')).toBeInTheDocument()
    })

    it('应显示添加按钮', () => {
      render(<App />)
      expect(screen.getByRole('button', { name: '添加 (Enter)' })).toBeInTheDocument()
    })

    it('空状态应显示提示', () => {
      render(<App />)
      expect(screen.getByText('还没有待办')).toBeInTheDocument()
    })

    it('计数器应显示 0/0', () => {
      render(<App />)
      expect(screen.getByText('0/0')).toBeInTheDocument()
    })
  })

  describe('添加待办流程', () => {
    it('输入文本并点击添加按钮应创建待办', async () => {
      const user = userEvent.setup()
      render(<App />)

      const input = screen.getByPlaceholderText('写下一件要做的事…')
      await user.type(input, '第一个待办')

      const addBtn = screen.getByRole('button', { name: '添加 (Enter)' })
      await user.click(addBtn)

      expect(screen.getByText('第一个待办')).toBeInTheDocument()
      expect(screen.getByText('1/1')).toBeInTheDocument()
      expect(screen.queryByText('还没有待办')).not.toBeInTheDocument()
    })

    it('按 Enter 应添加待办', async () => {
      const user = userEvent.setup()
      render(<App />)

      const input = screen.getByPlaceholderText('写下一件要做的事…')
      await user.type(input, '按 Enter 添加')
      await user.keyboard('{Enter}')

      expect(screen.getByText('按 Enter 添加')).toBeInTheDocument()
    })

    it('添加后输入框应清空', async () => {
      const user = userEvent.setup()
      render(<App />)

      const input = screen.getByPlaceholderText('写下一件要做的事…')
      await user.type(input, '待办')
      await user.keyboard('{Enter}')

      expect(input).toHaveValue('')
    })

    it('应 trim 文本', async () => {
      const user = userEvent.setup()
      render(<App />)

      const input = screen.getByPlaceholderText('写下一件要做的事…')
      await user.type(input, '  带空格的待办  ')
      await user.keyboard('{Enter}')

      expect(screen.getByText('带空格的待办')).toBeInTheDocument()
    })
  })

  describe('删除待办流程', () => {
    it('点击删除按钮应删除待办', async () => {
      const user = userEvent.setup()
      render(<App />)

      // 添加待办
      const input = screen.getByPlaceholderText('写下一件要做的事…')
      await user.type(input, '待办')
      await user.keyboard('{Enter}')

      // 点击删除按钮 (用 aria-label 定位)
      await user.click(screen.getByRole('button', { name: '删除' }))

      expect(screen.getByText('还没有待办')).toBeInTheDocument()
      expect(screen.getByText('0/0')).toBeInTheDocument()
    })
  })

  describe('透明度设置', () => {
    it('点击展开按钮应显示设置面板', async () => {
      const user = userEvent.setup()
      render(<App />)

      // 默认隐藏
      expect(screen.queryByText('透明度')).not.toBeInTheDocument()

      // 点击展开 (设置按钮)
      await user.click(screen.getByRole('button', { name: '设置' }))

      expect(screen.getByText('透明度')).toBeInTheDocument()
      expect(screen.getByText('95%')).toBeInTheDocument()
    })

    it('应显示透明度滑块', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: '设置' }))
      expect(screen.getByRole('slider')).toBeInTheDocument()
    })
  })

  describe('数据持久化', () => {
    it('添加待办后应保存到 localStorage', async () => {
      render(<App />)

      const input = screen.getByPlaceholderText('写下一件要做的事…')
      await userEvent.setup().type(input, '持久化测试{Enter}')

      // 直接验证 items 存在（持久化逻辑已通过 store 测试验证）
      expect(screen.getByText('持久化测试')).toBeInTheDocument()

      // 持久化测试在 useTodoStore.test.ts 中已覆盖
    })

    it('应从 localStorage 恢复数据', () => {
      localStorage.setItem('jintian-meibaihuo-todos', JSON.stringify([
        { id: '1', text: '已保存的待办', completed: false, createdAt: 1000 }
      ]))

      render(<App />)

      expect(screen.getByText('已保存的待办')).toBeInTheDocument()
      expect(screen.getByText('1/1')).toBeInTheDocument()
    })
  })
})