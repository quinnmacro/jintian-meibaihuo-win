import React, { useState } from 'react'
import { theme, glyphs } from '../theme/pixel'
import './PixelCheckbox.css'

interface Props {
  checked: boolean
  onChange: () => void
}

export function PixelCheckbox({ checked, onChange }: Props) {
  return (
    <button
      className="pixel-checkbox"
      onClick={onChange}
      style={{
        width: 22,
        height: 22,
        background: checked ? theme.done : 'transparent',
        border: `${theme.thickBorderWidth}px solid ${theme.text}`,
      }}
    >
      {checked && (
        <span style={{
          display: 'block',
          width: 12,
          height: 12,
          background: theme.done,
        }} />
      )}
    </button>
  )
}