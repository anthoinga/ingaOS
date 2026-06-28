import type { Track } from '@/app/types';

interface TrackListProps {
  tracks: Track[];
}

export function TrackList({ tracks }: TrackListProps) {
  return (
    <div className="tracklist flex-1 bg-[rgba(0,0,0,0.4)] overflow-hidden mt-2 mb-2">
      <div className="flex">
        <div className="w-full max-w-[424px] overflow-hidden">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="track flex items-center py-px w-full cursor-pointer transition-all duration-200 ease-out relative group"
            >
              {/* Gradient highlight overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)'
                }}
              />

              <div className="track-number w-[39px] shrink-0 flex items-center justify-center relative z-10">
                <span className="font-body text-[14px] text-[#adacb1] tracking-[1px]">
                  {track.id}
                </span>
              </div>
              <div className="track-title flex-1 min-w-0 py-[6px] relative z-10">
                <p className="font-body text-[14px] text-white truncate overflow-hidden">
                  {track.title}
                </p>
              </div>
              <div className="track-duration shrink-0 pl-2 pr-4 py-[6px] relative z-10">
                <span className="font-body text-[14px] text-white opacity-60 tracking-[1px]">
                  {track.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
