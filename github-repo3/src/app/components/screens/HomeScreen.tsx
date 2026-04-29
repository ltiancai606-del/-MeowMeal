import { useNavigate } from "react-router";
import {
  Bell,
  ChevronRight,
  AlertTriangle,
  Plus,
  Thermometer,
  Flame,
  TrendingUp,
  Calendar,
} from "lucide-react";

const cats = [
  { id: 1, name: "橘橘", avatar: "🐱", weight: "4.2kg", age: "3岁", status: "已绝育" },
  { id: 2, name: "小白", avatar: "🐈", weight: "3.8kg", age: "2岁", status: "已绝育" },
];

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#FFF8F3" }}>
      {/* Header */}
      <div
        className="px-5 pt-4 pb-6"
        style={{
          background: "linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white text-opacity-80 text-sm">早上好 👋</p>
            <h1 className="text-white text-xl" style={{ fontWeight: 700 }}>
              喵膳 MeowMeal
            </h1>
          </div>
          <button className="relative p-2 rounded-full bg-white bg-opacity-20">
            <Bell size={20} color="white" />
            <span
              className="absolute top-1 right-1 rounded-full bg-red-400"
              style={{ width: "8px", height: "8px" }}
            />
          </button>
        </div>

        {/* Active Recipe Card */}
        <div
          className="rounded-2xl p-4 cursor-pointer"
          style={{ background: "rgba(255,255,255,0.95)" }}
          onClick={() => navigate("/recipe/1")}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="rounded-lg flex items-center justify-center"
                style={{ width: "32px", height: "32px", background: "#FFF0E8" }}
              >
                <Flame size={18} color="#FF6B35" />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#999" }}>执行中食谱</p>
                <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                  橘橘小白的均衡营养餐
                </p>
              </div>
            </div>
            <ChevronRight size={16} color="#ccc" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1 rounded-xl p-2.5" style={{ background: "#FFF8F3" }}>
              <p className="text-xs" style={{ color: "#999" }}>已执行</p>
              <p className="text-base" style={{ color: "#FF6B35", fontWeight: 700 }}>
                12 天
              </p>
            </div>
            <div className="flex-1 rounded-xl p-2.5" style={{ background: "#FFF8F3" }}>
              <p className="text-xs" style={{ color: "#999" }}>周期</p>
              <p className="text-base" style={{ color: "#1a1a1a", fontWeight: 700 }}>
                21 天
              </p>
            </div>
            <div className="flex-1 rounded-xl p-2.5" style={{ background: "#FFF8F3" }}>
              <p className="text-xs" style={{ color: "#999" }}>剩余</p>
              <p className="text-base" style={{ color: "#1a1a1a", fontWeight: 700 }}>
                9 天
              </p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-xs" style={{ color: "#999" }}>进度</span>
              <span className="text-xs" style={{ color: "#FF6B35", fontWeight: 600 }}>57%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "#F0F0F0" }}>
              <div
                className="h-1.5 rounded-full"
                style={{ width: "57%", background: "linear-gradient(90deg, #FF6B35, #FFB74D)" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Fridge Card */}
        <div
          className="bg-white rounded-2xl p-4 cursor-pointer"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          onClick={() => navigate("/fridge")}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="rounded-xl flex items-center justify-center"
                style={{ width: "36px", height: "36px", background: "#E8F4FD" }}
              >
                <Thermometer size={18} color="#2196F3" />
              </div>
              <span className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                冰箱库存
              </span>
            </div>
            <ChevronRight size={16} color="#ccc" />
          </div>
          <div className="flex gap-2">
            {[
              { label: "正常", count: 12, color: "#4CAF50", bg: "#E8F5E9" },
              { label: "临期", count: 3, color: "#FF9800", bg: "#FFF3E0" },
              { label: "已过期", count: 1, color: "#F44336", bg: "#FFEBEE" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex-1 rounded-xl p-2.5 text-center"
                style={{ background: item.bg }}
              >
                <p className="text-lg" style={{ color: item.color, fontWeight: 700 }}>
                  {item.count}
                </p>
                <p className="text-xs" style={{ color: item.color }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div
            className="mt-3 rounded-xl p-3 flex items-center gap-2"
            style={{ background: "#FFF3E0" }}
          >
            <AlertTriangle size={14} color="#FF9800" />
            <p className="text-xs" style={{ color: "#E65100" }}>
              鸡胸肉 500g 将于 3 天后过期，请及时使用
            </p>
          </div>
        </div>

        {/* Pet Cards */}
        <div
          className="bg-white rounded-2xl p-4"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>
              🐾 我的猫咪
            </span>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-1 text-xs"
              style={{ color: "#FF6B35" }}
            >
              <Plus size={12} />
              添加
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {cats.map((cat) => (
              <div
                key={cat.id}
                className="flex-shrink-0 rounded-2xl p-3 text-center cursor-pointer"
                style={{ background: "#FFF8F3", width: "100px" }}
                onClick={() => navigate("/profile")}
              >
                <div
                  className="rounded-2xl flex items-center justify-center mx-auto mb-2"
                  style={{ width: "52px", height: "52px", background: "#FFE0CC", fontSize: "28px" }}
                >
                  {cat.avatar}
                </div>
                <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                  {cat.name}
                </p>
                <p className="text-xs" style={{ color: "#999" }}>{cat.weight}</p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                  style={{ background: "#E8F5E9", color: "#4CAF50" }}
                >
                  {cat.status}
                </span>
              </div>
            ))}
            <button
              className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed"
              style={{ width: "100px", height: "120px", borderColor: "#FFD4C2", color: "#FF6B35" }}
              onClick={() => navigate("/profile")}
            >
              <Plus size={24} />
              <span className="text-xs mt-1">添加猫咪</span>
            </button>
          </div>
        </div>

        {/* Bill Card */}
        <div
          className="bg-white rounded-2xl p-4 cursor-pointer"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="rounded-xl flex items-center justify-center"
                style={{ width: "36px", height: "36px", background: "#F3E5F5" }}
              >
                <TrendingUp size={18} color="#9C27B0" />
              </div>
              <span className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                消费统计
              </span>
            </div>
            <ChevronRight size={16} color="#ccc" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs" style={{ color: "#999" }}>本月花费</p>
              <p className="text-xl" style={{ color: "#9C27B0", fontWeight: 700 }}>
                ¥ 342.50
              </p>
            </div>
            <div className="flex-1">
              <p className="text-xs" style={{ color: "#999" }}>累计花费</p>
              <p className="text-xl" style={{ color: "#1a1a1a", fontWeight: 700 }}>
                ¥ 2,847.00
              </p>
            </div>
          </div>
          <div className="flex gap-1 mt-3">
            {[60, 45, 80, 35, 90, 55, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{ height: "32px", display: "flex", alignItems: "flex-end" }}>
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: `${h}%`,
                    background: i === 6 ? "#9C27B0" : "#E1BEE7",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {["周一", "周二", "周三", "周四", "周五", "周六", "今天"].map((d) => (
              <span key={d} className="text-xs" style={{ color: "#bbb", flex: 1, textAlign: "center", fontSize: "9px" }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Nutrients Card */}
        <div
          className="bg-white rounded-2xl p-4"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="rounded-xl flex items-center justify-center"
                style={{ width: "36px", height: "36px", background: "#E8F5E9" }}
              >
                <Calendar size={18} color="#4CAF50" />
              </div>
              <span className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                营养快览
              </span>
            </div>
            <button
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: "#FFF0E8", color: "#FF6B35" }}
              onClick={() => navigate("/recipe/1")}
            >
              查看详情
            </button>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "蛋白质", value: 58, target: 55, unit: "%", color: "#FF6B35" },
              { label: "脂肪", value: 32, target: 35, unit: "%", color: "#FFB74D" },
              { label: "碳水", value: 4, target: 5, unit: "%", color: "#4CAF50" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: "#666" }}>{item.label}</span>
                  <span className="text-xs" style={{ color: item.color, fontWeight: 600 }}>
                    {item.value}{item.unit} / 目标 {item.target}{item.unit}
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "#F5F5F5" }}>
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${(item.value / item.target) * 100}%`, background: item.color, maxWidth: "100%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: "12px" }} />
      </div>
    </div>
  );
}
