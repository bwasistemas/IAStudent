import { type ParagraphSizeMap } from './types'

export const PARAGRAPH_SIZES: ParagraphSizeMap = {
  xs: 'text-xs font-gotham-book text-darkGray',
  sm: 'text-sm font-gotham-book text-darkGray',
  default: 'text-base font-gotham-book text-darkGray',
  lg: 'text-lg font-gotham-book text-darkGray',
  lead: 'font-gotham-regular text-[1.125rem] leading-[1.35rem] tracking-[-0.01em] text-darkGray',
  title: 'font-gotham-regular text-[0.875rem] leading-5 tracking-[-0.02em] text-darkGray',
  body: 'font-gotham-book text-[0.875rem] leading-5 tracking-[-0.02em] text-darkGray',
  mono: 'font-dmmono text-[0.75rem] font-normal leading-[1.125rem] tracking-[-0.02em] text-darkGray',
  xsmall:
    'font-gotham-book text-[0.75rem] leading-[1.0625rem] tracking-[-0.02em] text-darkGray'
}
