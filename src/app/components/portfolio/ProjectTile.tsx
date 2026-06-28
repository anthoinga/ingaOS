'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { Project } from '@/app/types';
import { TILE_SIZES, SPACING } from '@/app/data/constants';
import { Spacer } from '@/app/components/layout/Spacer';

export function ProjectTile({
  size,
  imageUrl,
  imageAlt,
  url,
  header,
  title,
  location,
  date,
}: Project) {
  const dimensions = TILE_SIZES[size];
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const tileRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!tileRef.current) return;

    const rect = tileRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate relative position (0 to 1)
    const relX = x / rect.width;
    const relY = y / rect.height;

    // Convert to -1 to 1 range, centered
    const centerX = (relX - 0.5) * 2;
    const centerY = (relY - 0.5) * 2;

    setMousePosition({ x: centerX, y: centerY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Parallax effect: move image slightly based on mouse position
  const parallaxX = mousePosition.x * 15; // Max 15px movement
  const parallaxY = mousePosition.y * 15;

  return (
    <a
      ref={tileRef}
      href={url}
      className="tile flex flex-col overflow-hidden rounded-[12px] w-full shrink-0 transition-all duration-300 ease-out"
      style={{
        height: `${dimensions.height}px`,
        minHeight: `${dimensions.minHeight}px`,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="content bg-[#e8e8e8] flex flex-col items-center justify-between h-full w-full relative"
        style={{
          paddingLeft: `${SPACING.tilePaddingX}px`,
          paddingRight: `${SPACING.tilePaddingX}px`,
          paddingTop: `${SPACING.tilePaddingY}px`,
          paddingBottom: `${SPACING.tilePaddingY}px`,
        }}
      >
        {header ? (
          <div className="header flex items-center justify-center pt-3 w-full">
            <p className="font-mono font-medium text-[16px] text-[#3d3d3d] uppercase text-center">
              {header}
            </p>
          </div>
        ) : (
          <Spacer />
        )}

        <div className="image-container flex-1 relative w-full flex items-center justify-center min-h-0">
          <div
            className="image-wrapper relative w-full h-full transition-transform duration-200 ease-out"
            style={{
              boxShadow: 'none',
              transform: `translate(${parallaxX}px, ${parallaxY}px)`,
            }}
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              style={{ transform: 'translateY(15px)' }}
              className="object-contain"
              sizes="(max-width: 1240px) 130vw, (max-width: 1024px) 190vw, 130vw"
            />
          </div>
        </div>

        <Spacer />

        {/* Metadata Overlay */}
        {(title || location || date) && (
          <div
            className="metadata absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ease-out pointer-events-none"
            style={{
              opacity: isHovered ? 1 : 0,
              padding: `${SPACING.tilePaddingX}px ${SPACING.tilePaddingX}px ${SPACING.tilePaddingY}px`,
            }}
          >
            <div
              className="flex flex-col"
              style={{
                gap: 0,
                backgroundColor: 'rgb(232, 232, 232)',
                padding: '6px 8px',
                width: 'fit-content',
              }}
            >
              {title && (
                <p className="font-code text-[14px] text-[#3d3d3d] leading-none">
                  {title}
                </p>
              )}
              <div className="flex items-center gap-2" style={{ marginTop: 3 }}>
                {location && (
                  <span className="font-code text-[14px] text-[#3d3d3d] leading-none flex items-center gap-1">
                    {location}
                  </span>
                )}
                {date && (
                  <span className="font-code text-[14px] text-[#3d3d3d] leading-none">
                    {date}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </a>
  );
}
