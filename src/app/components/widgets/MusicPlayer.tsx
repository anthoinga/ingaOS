import Image from 'next/image';
import type { NowPlaying } from '@/app/types';
import {
  playPath,
  previousPath,
  nextPath,
  spotifyLogoPath,
} from '@/app/lib/icons';

interface MusicPlayerProps {
  nowPlaying: NowPlaying;
}

export function MusicPlayer({ nowPlaying }: MusicPlayerProps) {
  return (
    <div className="player-container h-20 relative w-full shrink-0">
      <div className="album absolute left-0 top-0 w-20 h-20">
        <Image
          src={nowPlaying.albumArt}
          alt={nowPlaying.albumName}
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10">
            <svg className="w-full h-full" fill="none" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="19.5"
                fill="rgba(0,0,0,0.4)"
                stroke="white"
              />
              <path d={playPath} fill="white" />
            </svg>
          </div>
        </div>
      </div>

      <div className="info absolute left-20 right-0 top-0 h-20">
        <div className="meta absolute top-2 left-2 right-11">
          <p
            className="font-body font-bold text-[14px] text-white truncate"
            style={{ textShadow: '0px 0px 2px rgba(0,0,0,0.4)' }}
          >
            {nowPlaying.albumName}
          </p>
          <p
            className="font-body text-[14px] text-white truncate"
            style={{ textShadow: '0px 0px 2px rgba(0,0,0,0.4)' }}
          >
            {nowPlaying.artistName}
          </p>
        </div>

        <div className="logo absolute right-2 top-[10px] w-[18px] h-[18px]">
          <svg className="w-full h-full" fill="none" viewBox="0 0 18 18">
            <path d={spotifyLogoPath} fill="white" />
          </svg>
        </div>

        <div className="controls absolute bottom-0 left-0 right-0 w-full flex items-center pl-2 pr-4">
          <button type="button" className="p-1" aria-label="Previous">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path
                d={previousPath}
                fill="white"
                filter="drop-shadow(0 0 2px rgba(0,0,0,0.4))"
              />
            </svg>
          </button>
          <div className="progress flex-1 h-1 bg-[rgba(255,255,255,0.3)] mx-1" />
          <button type="button" className="p-1" aria-label="Next">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path
                d={nextPath}
                fill="white"
                filter="drop-shadow(0 0 2px rgba(0,0,0,0.4))"
              />
            </svg>
          </button>
          <div className="pl-1">
            <span
              className="font-body text-[10px] text-white"
              style={{ textShadow: '0px 0px 2px rgba(0,0,0,0.4)' }}
            >
              {nowPlaying.remainingTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
