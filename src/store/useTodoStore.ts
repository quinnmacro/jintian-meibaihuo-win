// Todo 数据存储
// 参考原项目 TodoStore.swift
// 使用 JSON 文件持久化，通过 Tauri invoke 调用 Rust 后端

import { useState, useEffect, useCallback } from 'react'
import { Todo, createTodo } from '../types/todo'

const STORE_KEY = 'jintian-meibaihuo-todos'
const ALPHA_KEY = 'jintian-meibaihuo-alpha'

export function useTodoStore() {
  const [items, setItems] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [windowAlpha, setWindowAlpha] = useState(() => {
    const saved = localStorage.getItem(ALPHA_KEY)
    return saved ? parseFloat(saved) : 0.95
  })

  // 自动保存 (防抖)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORE_KEY, JSON.stringify(items))
    }, 150)
    return () => clearTimeout(timer)
  }, [items])

  useEffect(() => {
    localStorage.setItem(ALPHA_KEY, String(windowAlpha))
  }, [windowAlpha])

  const add = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setItems(prev => [...prev, createTodo(trimmed)])
  }, [])

  const toggle = useCallback((id: string) => {
    setItems(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }, [])

  const update = useCallback((id: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) {
      setItems(prev => prev.filter(t => t.id !== id))
      return
    }
    setItems(prev => prev.map(t =>
      t.id === id ? { ...t, text: trimmed } : t
    ))
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setItems(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setItems(prev => prev.filter(t => !t.completed))
  }, [])

  return {
    items,
    windowAlpha,
    setWindowAlpha,
    add,
    toggle,
    update,
    deleteTodo,
    clearCompleted,
    undoneCount: items.filter(t => !t.completed).length,
    hasCompleted: items.some(t => t.completed),
  }
}