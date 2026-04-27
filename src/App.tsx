import React, { useState } from 'react'
import { useTodoStore } from './store/useTodoStore'
import { TodoRow } from './components/TodoRow'
import { theme, glyphs, cssVars } from './theme/pixel'
import './App.css'

// 注入 CSS 变量
const styleSheet = document.createElement('style')
styleSheet.textContent = cssVars
document.head.appendChild(styleSheet)

export function App() {
  const store = useTodoStore()
  const [newText, setNewText] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  const handleAdd = () => {
    if (newText.trim()) {
      store.add(newText)
      setNewText('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className="app" style={{ background: theme.bg }}>
      {/* Header */}
      <header className="header">
        <h1 className="title" style={{ color: theme.text, fontSize: theme.titleSize }}>
          今天没白活
        </h1>
        <span className="count" style={{ color: theme.muted, fontSize: theme.smallSize }}>
          {store.undoneCount}/{store.items.length}
        </span>
        <button
          className="expand-btn"
          onClick={() => setShowSettings(!showSettings)}
          style={{ color: theme.text }}
        >
          {showSettings ? glyphs.collapse : glyphs.expand}
        </button>
      </header>

      {/* Divider */}
      <div className="divider thick" style={{ background: theme.text }} />

      {/* Input */}
      <div className="input-bar">
        <span className="bullet" style={{ color: theme.accent }}>{glyphs.bullet}</span>
        <input
          className="todo-input"
          placeholder="写下一件要做的事…"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ color: theme.text }}
        />
        <button
          className="add-btn"
          onClick={handleAdd}
          title="添加 (Enter)"
          style={{ background: theme.accent, color: theme.bg }}
        >
          +
        </button>
      </div>

      {/* Divider */}
      <div className="divider" style={{ background: theme.muted }} />

      {/* List */}
      <main className="todo-list">
        {store.items.length === 0 ? (
          <div className="empty">
            <span className="empty-glyph" style={{ color: theme.muted }}>
              {glyphs.emptyPlaceholder}
            </span>
            <span className="empty-text" style={{ color: theme.muted }}>
              还没有待办
            </span>
          </div>
        ) : (
          store.items.map(todo => (
            <TodoRow
              key={todo.id}
              todo={todo}
              onToggle={() => store.toggle(todo.id)}
              onUpdate={text => store.update(todo.id, text)}
              onDelete={() => store.deleteTodo(todo.id)}
            />
          ))
        )}
      </main>

      {/* Divider */}
      <div className="divider" style={{ background: theme.muted }} />

      {/* Footer */}
      <footer className="footer">
        <span className="hint" style={{ color: theme.muted }}>
          {glyphs.divider} 双击编辑 · Enter 添加
        </span>
        {store.hasCompleted && (
          <button
            className="clear-btn"
            onClick={store.clearCompleted}
            style={{ color: theme.accent }}
          >
            [清除已完成]
          </button>
        )}
      </footer>

      {/* Settings Panel */}
      {showSettings && (
        <>
          <div className="divider" style={{ background: theme.muted }} />
          <div className="settings">
            <label className="alpha-label">
              <span style={{ color: theme.text }}>透明度</span>
              <span style={{ color: theme.muted }}>
                {Math.round(store.windowAlpha * 100)}%
              </span>
            </label>
            <input
              type="range"
              className="alpha-slider"
              min="0.3"
              max="1"
              step="0.05"
              value={store.windowAlpha}
              onChange={e => store.setWindowAlpha(parseFloat(e.target.value))}
            />
          </div>
        </>
      )}
    </div>
  )
}