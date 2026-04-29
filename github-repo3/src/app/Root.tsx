import { Outlet } from "react-router";
import { MobileFrame } from "./components/MobileFrame";
import { BottomNav } from "./components/BottomNav";

export function Root() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)" }}>
      <MobileFrame>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
          <BottomNav />
        </div>
      </MobileFrame>
    </div>
  );
}
