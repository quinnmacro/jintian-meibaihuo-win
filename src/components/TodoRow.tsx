import React, { useState, useRef, useEffect } from 'react'
import { Todo } from '../types/todo'
import { theme, glyphs } from '../theme/pixel'
import { PixelCheckbox } from './PixelCheckbox'
import './TodoRow.css'

interface Props {
  todo: Todo
  onToggle: () => void
  onUpdate: (text: string) => void
  onDelete: () => void
}

export function TodoRow({ todo, onToggle, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const commit = () => {
    onUpdate(draft)
    setIsEditing(false)
  }

  const cancel = () => {
    setDraft(todo.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commit()
    } else if (e.key === 'Escape') {
      cancel()
    }
  }

  return (
    <div className="todo-row" style={{
      background: theme.surface,
      borderBottom: `${theme.hairline}px solid ${theme.muted}`,
      opacity: todo.completed ? 0.6 : 1,
    }}>
      <PixelCheckbox checked={todo.completed} onChange={onToggle} />

      {isEditing ? (
        <input
          ref={inputRef}
          className="todo-input"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          style={{
            color: theme.text,
            fontSize: theme.bodySize,
          }}
        />
      ) : (
        <span
          className={`todo-text ${todo.completed ? 'completed' : ''}`}
          onDoubleClick={() => {
            setDraft(todo.text)
            setIsEditing(true)
          }}
          style={{
            color: todo.completed ? theme.muted : theme.text,
            fontSize: theme.bodySize,
            textDecoration: todo.completed ? 'line-through' : 'none',
          }}
        >
          {todo.text}
        </span>
      )}

      <button
        className="todo-delete"
        onClick={onDelete}
        title="删除"
        style={{
          color: theme.accent,
          fontSize: theme.glyphSize,
        }}
      >
        {glyphs.close}
      </button>
    </div>
  )
}