import { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div
      className="relative bg-white overflow-hidden shadow-2xl"
      style={{
        width: "390px",
        height: "844px",
        borderRadius: "44px",
        boxShadow: "0 30px 80px rgba(0,0,0,0.25), 0 0 0 2px #1a1a2e, 0 0 0 6px #16213e",
      }}
    >
      {/* Status bar */}
      <div
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
        style={{ height: "44px", background: "transparent" }}
      >
        <span className="text-xs font-semibold" style={{ color: "#1a1a2e" }}>9:41</span>
        <div
          className="absolute left-1/2 transform -translate-x-1/2 bg-black rounded-full"
          style={{ width: "120px", height: "34px", top: "4px" }}
        />
        <div className="flex items-center gap-1">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0" y="3" width="3" height="9" rx="1" fill="#1a1a2e"/>
            <rect x="4.5" y="2" width="3" height="10" rx="1" fill="#1a1a2e"/>
            <rect x="9" y="0" width="3" height="12" rx="1" fill="#1a1a2e"/>
            <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#1a1a2e" opacity="0.3"/>
          </svg>
          <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
            <path d="M7.5 2.5C9.8 2.5 11.9 3.5 13.3 5.1L14.5 3.9C12.8 2 10.3 1 7.5 1C4.7 1 2.2 2 0.5 3.9L1.7 5.1C3.1 3.5 5.2 2.5 7.5 2.5Z" fill="#1a1a2e"/>
            <path d="M7.5 5.5C9 5.5 10.4 6.1 11.4 7.1L12.6 5.9C11.3 4.6 9.5 3.8 7.5 3.8C5.5 3.8 3.7 4.6 2.4 5.9L3.6 7.1C4.6 6.1 6 5.5 7.5 5.5Z" fill="#1a1a2e"/>
            <circle cx="7.5" cy="10" r="1.5" fill="#1a1a2e"/>
          </svg>
          <div className="flex items-center">
            <div className="border border-black rounded-sm" style={{ width: "22px", height: "12px", padding: "1px" }}>
              <div className="bg-black rounded-sm" style={{ width: "16px", height: "8px" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0" style={{ paddingTop: "44px" }}>
        {children}
      </div>
    </div>
  );
}
