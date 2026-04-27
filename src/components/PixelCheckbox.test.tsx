// 组件测试: PixelCheckbox
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PixelCheckbox } from '../components/PixelCheckbox'

describe('PixelCheckbox', () => {
  it('未选中时应显示空方框', () => {
    render(<PixelCheckbox checked={false} onChange={() => {}}/>)

    const checkbox = screen.getByRole('button')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveStyle({ background: 'transparent' })
  })

  it('选中时应显示填充方框', () => {
    render(<PixelCheckbox checked={true} onChange={() => {}}/>)

    const checkbox = screen.getByRole('button')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveStyle({ background: '#6B9B6E' }) // done color
  })

  it('点击应触发 onChange', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<PixelCheckbox checked={false} onChange={handleChange}/>)

    await user.click(screen.getByRole('button'))

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('应应用像素风边框样式', () => {
    render(<PixelCheckbox checked={false} onChange={() => {}}/>)

    const checkbox = screen.getByRole('button')
    expect(checkbox).toHaveStyle({ border: '3px solid #E8DCC4' })
  })

  it('尺寸应为 22x22', () => {
    render(<PixelCheckbox checked={false} onChange={() => {}}/>)

    const checkbox = screen.getByRole('button')
    expect(checkbox).toHaveStyle({ width: '22px', height: '22px' })
  })
})