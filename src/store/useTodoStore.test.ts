// 单元测试: TodoStore
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTodoStore } from '../store/useTodoStore'

describe('useTodoStore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('初始化', () => {
    it('应从空状态初始化', () => {
      const { result } = renderHook(() => useTodoStore())

      expect(result.current.items).toHaveLength(0)
      expect(result.current.undoneCount).toBe(0)
      expect(result.current.hasCompleted).toBe(false)
    })

    it('应从 localStorage 恢复数据', () => {
      localStorage.setItem('jintian-meibaihuo-todos', JSON.stringify([
        { id: '1', text: '已恢复', completed: false, createdAt: 1000 }
      ]))

      const { result } = renderHook(() => useTodoStore())

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].text).toBe('已恢复')
    })

    it('应恢复 windowAlpha', () => {
      localStorage.setItem('jintian-meibaihuo-alpha', '0.8')

      const { result } = renderHook(() => useTodoStore())

      expect(result.current.windowAlpha).toBe(0.8)
    })

    it('windowAlpha 默认应为 0.95', () => {
      const { result } = renderHook(() => useTodoStore())

      expect(result.current.windowAlpha).toBe(0.95)
    })
  })

  describe('添加待办', () => {
    it('add 应添加新待办', () => {
      const { result } = renderHook(() => useTodoStore())

      act(() => {
        result.current.add('新待办')
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].text).toBe('新待办')
      expect(result.current.items[0].completed).toBe(false)
    })

    it('add 应忽略空文本', () => {
      const { result } = renderHook(() => useTodoStore())

      act(() => {
        result.current.add('')
        result.current.add('   ')
      })

      expect(result.current.items).toHaveLength(0)
    })

    it('add 应 trim 文本', () => {
      const { result } = renderHook(() => useTodoStore())

      act(() => {
        result.current.add('  带空格  ')
      })

      expect(result.current.items[0].text).toBe('带空格')
    })

    it('undoneCount 应正确计算', () => {
      const { result } = renderHook(() => useTodoStore())

      act(() => {
        result.current.add('待办1')
        result.current.add('待办2')
      })

      expect(result.current.undoneCount).toBe(2)
    })
  })

  describe('切换完成状态', () => {
    it('toggle 应切换完成状态', () => {
      const { result } = renderHook(() => useTodoStore())

      act(() => {
        result.current.add('待办')
      })

      const id = result.current.items[0].id

      act(() => {
        result.current.toggle(id)
      })

      expect(result.current.items[0].completed).toBe(true)
      expect(result.current.undoneCount).toBe(0)
      expect(result.current.hasCompleted).toBe(true)

      act(() => {
        result.current.toggle(id)
      })

      expect(result.current.items[0].completed).toBe(false)
    })
  })

  describe('更新待办', () => {
    it('update 应更新文本', () => {
      const { result } = renderHook(() => useTodoStore())

      act(() => {
        result.current.add('原文本')
      })

      const id = result.current.items[0].id

      act(() => {
        result.current.update(id, '新文本')
      })

      expect(result.current.items[0].text).toBe('新文本')
    })

    it('update 空文本应删除待办', () => {
      const { result } = renderHook(() => useTodoStore())

      act(() => {
        result.current.add('待办')
      })

      const id = result.current.items[0].id

      act(() => {
        result.current.update(id, '')
      })

      expect(result.current.items).toHaveLength(0)
    })

    it('update 应 trim 文本', () => {
      const { result } = renderHook(() => useTodoStore())

      act(() => {
        result.current.add('待办')
      })

      const id = result.current.items[0].id

      act(() => {
        result.current.update(id, '  带空格  ')
      })

      expect(result.current.items[0].text).toBe('带空格')
    })
  })

  describe('删除待办', () => {
    it('deleteTodo 应删除指定待办', () => {
      const { result } = renderHook(() => useTodoStore())

      act(() => {
        result.current.add('待办1')
        result.current.add('待办2')
      })

      const id = result.current.items[0].id

      act(() => {
        result.current.deleteTodo(id)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].text).toBe('待办2')
    })
  })

  describe('清除已完成', () => {
    it('clearCompleted 应删除所有已完成待办', () => {
      const { result } = renderHook(() => useTodoStore())

      act(() => {
        result.current.add('待办1')
        result.current.add('待办2')
        result.current.add('待办3')
      })

      act(() => {
        result.current.toggle(result.current.items[0].id)
        result.current.toggle(result.current.items[1].id)
      })

      expect(result.current.hasCompleted).toBe(true)

      act(() => {
        result.current.clearCompleted()
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.hasCompleted).toBe(false)
    })
  })

  describe('持久化', () => {
    it('修改后应保存到 localStorage', async () => {
      vi.useFakeTimers()

      const { result } = renderHook(() => useTodoStore())

      act(() => {
        result.current.add('待办')
      })

      // 等待 debounce (150ms)
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      const saved = localStorage.getItem('jintian-meibaihuo-todos')
      expect(saved).toBeDefined()
      expect(JSON.parse(saved!)).toHaveLength(1)

      vi.useRealTimers()
    })

    it('windowAlpha 修改应立即保存', () => {
      const { result } = renderHook(() => useTodoStore())

      act(() => {
        result.current.setWindowAlpha(0.7)
      })

      expect(localStorage.getItem('jintian-meibaihuo-alpha')).toBe('0.7')
    })
  })
})