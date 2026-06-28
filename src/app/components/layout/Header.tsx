import type { HeaderInfo } from '@/app/types';
import { SPACING } from '@/app/data/constants';

export function Header({ name, title, location, onReset }: HeaderInfo) {
  return (
    <header className="flex items-center justify-between w-full pb-3 gap-2">
      <button
        onClick={onReset}
        className="name-badge flex items-center justify-center h-10 rounded-[20px] transition-opacity duration-150 hover:opacity-50"
        style={{
          paddingLeft: `${SPACING.pillPaddingX}px`,
          paddingRight: `${SPACING.pillPaddingX}px`,
          paddingTop: `${SPACING.pillPaddingY}px`,
          paddingBottom: `${SPACING.pillPaddingY}px`,
          cursor: onReset ? 'pointer' : 'default',
        }}
        aria-label="Return to home"
      >
        <p className="font-code font-medium text-[14px] md:text-[16px] text-[#3d3d3d] uppercase">
          {name}
        </p>
      </button>

      {title && (
        <div className="title hidden md:flex items-center justify-center h-10 py-[10px]">
          <p className="font-code font-medium text-[15px] uppercase text-center text-[#3d3d3d]">
            {title}
          </p>
        </div>
      )}

      <div
        className="location flex items-center justify-center h-10 rounded-[20px]"
        style={{
          paddingLeft: `${SPACING.pillPaddingX}px`,
          paddingRight: `${SPACING.pillPaddingX}px`,
          paddingTop: `${SPACING.pillPaddingY}px`,
          paddingBottom: `${SPACING.pillPaddingY}px`,
        }}
      >
        <p className="font-code font-medium text-[14px] md:text-[16px] text-[#3d3d3d]">
          📍{location}
        </p>
      </div>
    </header>
  );
}
