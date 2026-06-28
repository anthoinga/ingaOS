import { useTranslation } from 'react-i18next'
import { ItemRow } from './ItemRow'
import type { Category } from '@/types'

interface Props {
  category: Category
  activeItemIndex: number
  onSelectItem: (index: number) => void
  onOpenItem: (index: number) => void
}

export function ItemList({ category, activeItemIndex, onSelectItem, onOpenItem }: Props) {
  const { t } = useTranslation()

  if (category.items.length === 0) {
    return (
      <div className="px-8 py-4">
        <p className="text-sm text-[var(--text-muted)]">{t('apps.loading')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 px-6 py-2 w-full max-w-sm" role="listbox">
      {category.items.map((item, i) => (
        <ItemRow
          key={item.id}
          item={item}
          isActive={i === activeItemIndex}
          onClick={() => {
            if (i === activeItemIndex) {
              onOpenItem(i)
            } else {
              onSelectItem(i)
            }
          }}
        />
      ))}
    </div>
  )
}
