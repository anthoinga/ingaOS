interface SpacerProps {
  height?: number;
}

export function Spacer({ height = 19 }: SpacerProps) {
  return (
    <div
      className="shrink-0 w-full"
      style={{ height: `${height}px` }}
      aria-hidden="true"
    />
  );
}
