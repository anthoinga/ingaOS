'use client';

import { SplitFlapAudioProvider } from '@/app/components/split-flap-text';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SplitFlapAudioProvider>
      {children}
    </SplitFlapAudioProvider>
  );
}
