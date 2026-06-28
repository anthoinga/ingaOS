import type { Track, NowPlaying } from '@/app/types';

export const tracks: Track[] = [
  { id: 1, title: "I'm in Your Mind", duration: '2:02' },
  { id: 2, title: "I'm Not In Your Mind", duration: '5:51' },
  { id: 3, title: 'Cellophane', duration: '1:34' },
  { id: 4, title: "I'm In Your Mind Fuzz", duration: '6:32' },
  { id: 5, title: 'Empty', duration: '2:23' },
  { id: 6, title: 'Hot Water', duration: '2:30' },
  { id: 7, title: 'Am I In Heaven?', duration: '1:30' },
  { id: 8, title: 'Slow Jam 1', duration: '4:30' },
  { id: 9, title: 'Satan Speeds Up', duration: '3:40' },
  { id: 10, title: 'Her & I (Slow Jam 2)', duration: '1:09' },
];

export const nowPlaying: NowPlaying = {
  albumName: "I'm In Your Mind Fuzz",
  artistName: 'King Gizzard & The Liz...',
  albumArt: '/images/album-cover.png',
  currentTime: '0:00',
  remainingTime: '-2:30',
  tracks,
  gradientColor: '#3FC56E',
};
