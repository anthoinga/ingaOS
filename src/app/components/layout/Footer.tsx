import type { FooterInfo } from '@/app/types';
import { SPACING } from '@/app/data/constants';

export function Footer({ name, copyright, tagline }: FooterInfo) {
  return (
    <footer
      className="flex flex-col md:flex-row items-center md:items-end justify-between w-full gap-4"
      style={{ minHeight: `${SPACING.footerHeight}px` }}
    >
      <div className="info flex flex-col md:flex-row gap-2 items-center h-10">
        <div
          className="name-badge flex items-center justify-center rounded-[20px]"
          style={{
            paddingLeft: `${SPACING.pillPaddingX}px`,
            paddingRight: `${SPACING.pillPaddingX}px`,
            paddingTop: `${SPACING.pillPaddingY}px`,
            paddingBottom: `${SPACING.pillPaddingY}px`,
          }}
        >
          <span className="font-logo text-[18px] md:text-[24px] text-[#3d3d3d] uppercase tracking-[1.2px]">
            {name}
          </span>
        </div>
        <p className="font-code font-medium text-[13px] md:text-[15px] text-[#3d3d3d] uppercase text-center md:text-left">
          {copyright}
        </p>
      </div>

      <div
        className="tagline flex items-center justify-center h-10 rounded-[20px]"
        style={{
          paddingLeft: `${SPACING.pillPaddingX}px`,
          paddingRight: `${SPACING.pillPaddingX}px`,
          paddingTop: `${SPACING.pillPaddingY}px`,
          paddingBottom: `${SPACING.pillPaddingY}px`,
        }}
      >
        <p className="font-code font-medium text-[14px] md:text-[16px] text-[#3d3d3d]">
          {tagline}
        </p>
      </div>
    </footer>
  );
}
