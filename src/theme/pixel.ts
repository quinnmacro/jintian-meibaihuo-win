// 像素风主题 - 6色复古调色板
// 参考原项目 PixelTheme.swift

export const theme = {
  // 调色板 (first principles: palette as identity)
  bg: '#1A1A1A',       // near-black
  surface: '#2E2E2E',  // dark gray
  text: '#E8DCC4',     // cream 米白
  accent: '#D4574E',   // 朱砂 vermilion
  muted: '#7A7A7A',    // mid gray
  done: '#6B9B6E',     // 抹茶 matcha

  // 网格间距 (first principles: 4/8 multiples)
  gridUnit: 4,
  spacingS: 8,
  spacingM: 16,
  spacingL: 24,

  // 字体大小
  bodySize: 20,
  titleSize: 24,
  smallSize: 14,
  glyphSize: 24,
  heroSize: 40,

  // 边框宽度 (first principles: sharp edges)
  hairline: 1,
  borderWidth: 2,
  thickBorderWidth: 3,
}

// CSS 变量形式
export const cssVars = `
:root {
  --bg: ${theme.bg};
  --surface: ${theme.surface};
  --text: ${theme.text};
  --accent: ${theme.accent};
  --muted: ${theme.muted};
  --done: ${theme.done};

  --spacing-s: ${theme.spacingS}px;
  --spacing-m: ${theme.spacingM}px;
  --spacing-l: ${theme.spacingL}px;

  --border-width: ${theme.borderWidth}px;
  --thick-border: ${theme.thickBorderWidth}px;
  --hairline: ${theme.hairline}px;

  --body-size: ${theme.bodySize}px;
  --title-size: ${theme.titleSize}px;
  --small-size: ${theme.smallSize}px;
  --glyph-size: ${theme.glyphSize}px;
  --hero-size: ${theme.heroSize}px;
}
`

// Unicode 几何符号 (first principles: no SF Symbols)
export const glyphs = {
  bullet: '▸',
  checkboxEmpty: '□',
  checkboxFilled: '■',
  close: '×',
  expand: '▶',
  collapse: '▼',
  divider: '◇',
  emptyPlaceholder: '□ □ □',
}