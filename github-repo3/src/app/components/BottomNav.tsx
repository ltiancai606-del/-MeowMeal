import { useNavigate, useLocation } from "react-router";
import { Home, BookOpen, Package, User } from "lucide-react";

const navItems = [
  { icon: Home, label: "首页", path: "/" },
  { icon: BookOpen, label: "食谱", path: "/recipe" },
  { icon: Package, label: "冰箱", path: "/fridge" },
  { icon: User, label: "我的", path: "/profile" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="flex items-center justify-around bg-white border-t"
      style={{
        borderColor: "#f0f0f0",
        paddingBottom: "20px",
        paddingTop: "8px",
        height: "72px",
      }}
    >
      {navItems.map(({ icon: Icon, label, path }) => {
        const isActive =
          path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-1 min-w-0"
            style={{ flex: 1 }}
          >
            <Icon
              size={22}
              style={{ color: isActive ? "#FF6B35" : "#999" }}
              strokeWidth={isActive ? 2.5 : 1.8}
            />
            <span
              className="text-xs"
              style={{
                color: isActive ? "#FF6B35" : "#999",
                fontSize: "11px",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
