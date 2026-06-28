'use client';

import type { NowPlaying } from '@/app/types';
import { MusicPlayer } from './MusicPlayer';
import { TrackList } from './TrackList';
import { Spacer } from '@/app/components/layout/Spacer';
import { SPACING } from '@/app/data/constants';
import { useSpotify } from '@/app/hooks/useSpotify';
import { useMemo } from 'react';

interface SpotifyWidgetProps {
  nowPlaying: NowPlaying;
}

export function SpotifyWidget({ nowPlaying: fallbackData }: SpotifyWidgetProps) {
  const { track, loading } = useSpotify();

  // Convert Spotify API data to NowPlaying format
  const nowPlaying = useMemo((): NowPlaying => {
    if (loading || !track || !track.isPlaying || track.error) {
      // Use fallback data
      return fallbackData;
    }

    // Format duration
    const durationMs = track.duration || 0;
    const progressMs = track.progress || 0;
    const remainingMs = durationMs - progressMs;

    const formatTime = (ms: number) => {
      const seconds = Math.floor(ms / 1000);
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return {
      albumName: track.album || 'Unknown Album',
      artistName: track.artist || 'Unknown Artist',
      albumArt: track.albumImageUrl || fallbackData.albumArt,
      currentTime: formatTime(progressMs),
      remainingTime: `-${formatTime(remainingMs)}`,
      tracks: fallbackData.tracks, // Use fallback tracks for now
      gradientColor: '#1DB954', // Spotify green
    };
  }, [track, loading, fallbackData]);
  return (
    <div
      className="widget w-full shrink-0 overflow-clip rounded-[12px] flex flex-col"
      style={{ height: 'fit-content' }}
    >
      <div
        className="content bg-[#e8e8e8] flex flex-col h-full w-full"
        style={{
          paddingLeft: `${SPACING.tilePaddingX}px`,
          paddingRight: `${SPACING.tilePaddingX}px`,
          paddingTop: `${SPACING.tilePaddingY}px`,
        }}
      >
        <div className="header flex items-center justify-center pt-3 w-full">
          <p className="font-mono font-medium text-[16px] text-[#3d3d3d] uppercase text-center">
            Listening to
          </p>
        </div>

        <div
          className="player flex flex-col overflow-clip rounded-[12px] mt-[23px] mb-[19px] w-full max-w-[424px]"
          style={{
            height: 'fit-content',
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%),
              linear-gradient(90deg, ${nowPlaying.gradientColor} 0%, ${nowPlaying.gradientColor} 100%)
            `,
          }}
        >
          <MusicPlayer nowPlaying={nowPlaying} />
          <TrackList tracks={nowPlaying.tracks} />
        </div>

        <Spacer />
      </div>
    </div>
  );
}
