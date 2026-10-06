import type { CSSProperties, ReactNode } from "react";

export function DeviceFrame({
  width,
  children,
}: {
  width: number;
  children: ReactNode;
}) {
  const screen: CSSProperties = { width, height: (width * 16) / 9 };
  return (
    <div className="rounded-device border border-border bg-device-frame p-2.5 shadow-device">
      <div
        className="relative overflow-hidden rounded-device-inner bg-black"
        style={screen}
      >
        {children}
      </div>
    </div>
  );
}
