import { useState } from "react";
import { Search, Plus, Camera, Filter, Clock, ChevronRight, AlertTriangle } from "lucide-react";

type StatusKey = "normal" | "expiring" | "expired" | "low";

const statusConfig: Record<StatusKey, { label: string; color: string; bg: string }> = {
  normal: { label: "正常", color: "#4CAF50", bg: "#E8F5E9" },
  expiring: { label: "临期", color: "#FF9800", bg: "#FFF3E0" },
  expired: { label: "已过期", color: "#F44336", bg: "#FFEBEE" },
  low: { label: "库存不足", color: "#9C27B0", bg: "#F3E5F5" },
};

const inventory = [
  {
    id: 1, category: "白肉", name: "鸡胸肉", part: "胸部",
    weight: 800, unit: "g", price: 32.5,
    purchaseDate: "2024-01-10", expiryDate: "2024-02-10",
    status: "normal" as StatusKey, daysLeft: 21,
  },
  {
    id: 2, category: "红肉", name: "猪腿肉", part: "后腿",
    weight: 500, unit: "g", price: 28.0,
    purchaseDate: "2024-01-08", expiryDate: "2024-02-05",
    status: "expiring" as StatusKey, daysLeft: 7,
  },
  {
    id: 3, category: "白肉", name: "鸡胸肉", part: "胸部",
    weight: 500, unit: "g", price: 20.0,
    purchaseDate: "2024-01-05", expiryDate: "2024-01-28",
    status: "expiring" as StatusKey, daysLeft: 3,
  },
  {
    id: 4, category: "心脏", name: "猪心", part: "整颗",
    weight: 300, unit: "g", price: 15.0,
    purchaseDate: "2024-01-12", expiryDate: "2024-02-15",
    status: "normal" as StatusKey, daysLeft: 26,
  },
  {
    id: 5, category: "肝脏", name: "鸡肝", part: "整块",
    weight: 200, unit: "g", price: 8.0,
    purchaseDate: "2024-01-15", expiryDate: "2024-01-20",
    status: "expired" as StatusKey, daysLeft: -5,
  },
  {
    id: 6, category: "鱼类", name: "三文鱼", part: "鱼腹",
    weight: 200, unit: "g", price: 65.0,
    purchaseDate: "2024-01-14", expiryDate: "2024-02-20",
    status: "normal" as StatusKey, daysLeft: 31,
  },
  {
    id: 7, category: "贝类", name: "青口贝", part: "整只",
    weight: 100, unit: "g", price: 12.0,
    purchaseDate: "2024-01-13", expiryDate: "2024-02-12",
    status: "normal" as StatusKey, daysLeft: 23,
  },
  {
    id: 8, category: "心脏", name: "鸡心", part: "整颗",
    weight: 150, unit: "g", price: 9.0,
    purchaseDate: "2024-01-11", expiryDate: "2024-02-08",
    status: "low" as StatusKey, daysLeft: 19,
  },
];

const categoryColors: Record<string, string> = {
  "白肉": "#FF6B35",
  "红肉": "#E53935",
  "心脏": "#9C27B0",
  "肝脏": "#8B4513",
  "鱼类": "#2196F3",
  "贝类": "#009688",
  "其他内脏": "#795548",
};

export function FridgeScreen() {
  const [activeFilter, setActiveFilter] = useState<"all" | StatusKey>("all");
  const [showOCR, setShowOCR] = useState(false);

  const filtered = activeFilter === "all"
    ? inventory
    : inventory.filter((i) => i.status === activeFilter);

  const counts = {
    normal: inventory.filter((i) => i.status === "normal").length,
    expiring: inventory.filter((i) => i.status === "expiring").length,
    expired: inventory.filter((i) => i.status === "expired").length,
    low: inventory.filter((i) => i.status === "low").length,
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "#FFF8F3" }}>
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg" style={{ color: "#1a1a1a", fontWeight: 700 }}>
            🧊 冰箱库存
          </h1>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
              style={{ background: "#E3F2FD", color: "#2196F3", fontWeight: 600 }}
              onClick={() => setShowOCR(true)}
            >
              <Camera size={15} />
              OCR 入库
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
              style={{ background: "#FF6B35", color: "white", fontWeight: 600 }}
            >
              <Plus size={15} />
              手动添加
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{ background: "#F5F5F5" }}>
          <Search size={16} color="#999" />
          <span className="text-sm" style={{ color: "#bbb" }}>搜索食材...</span>
          <button className="ml-auto">
            <Filter size={16} color="#999" />
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="px-4 py-3">
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-xl text-center"
            style={{
              background: activeFilter === "all" ? "#FF6B35" : "white",
              color: activeFilter === "all" ? "white" : "#666",
              fontWeight: activeFilter === "all" ? 700 : 400,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
            onClick={() => setActiveFilter("all")}
          >
            <p className="text-sm">{inventory.length}</p>
            <p style={{ fontSize: "9px" }}>全部</p>
          </button>
          {(Object.entries(counts) as [StatusKey, number][]).map(([key, count]) => (
            <button
              key={key}
              className="flex-1 py-2 rounded-xl text-center"
              style={{
                background: activeFilter === key ? statusConfig[key].color : "white",
                color: activeFilter === key ? "white" : statusConfig[key].color,
                fontWeight: activeFilter === key ? 700 : 400,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
              onClick={() => setActiveFilter(key)}
            >
              <p className="text-sm">{count}</p>
              <p style={{ fontSize: "9px" }}>{statusConfig[key].label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Warning Banner */}
      {(counts.expiring > 0 || counts.expired > 0) && (
        <div className="mx-4 mb-2 rounded-2xl p-3 flex items-center gap-2" style={{ background: "#FFF3E0" }}>
          <AlertTriangle size={16} color="#FF9800" />
          <p className="text-xs flex-1" style={{ color: "#E65100" }}>
            {counts.expiring} 种食材即将过期，{counts.expired} 种已过期，请尽快处理
          </p>
        </div>
      )}

      {/* Inventory List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-4">
        {filtered.map((item) => {
          const sc = statusConfig[item.status];
          const catColor = categoryColors[item.category] || "#999";
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              {/* Category dot */}
              <div
                className="rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ width: "44px", height: "44px", background: `${catColor}18` }}
              >
                <div
                  className="rounded-full"
                  style={{ width: "12px", height: "12px", background: catColor }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                    {item.name}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: sc.bg, color: sc.color, fontWeight: 600 }}
                  >
                    {sc.label}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "#999" }}>
                  {item.category} · {item.part}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs" style={{ color: "#666" }}>库存 {item.weight}g</span>
                  <span className="text-xs" style={{ color: "#999" }}>¥{item.price}</span>
                  <div className="flex items-center gap-1">
                    <Clock size={10} color={item.daysLeft < 7 ? "#F44336" : "#999"} />
                    <span
                      className="text-xs"
                      style={{ color: item.daysLeft < 7 ? "#F44336" : "#999" }}
                    >
                      {item.daysLeft < 0
                        ? `过期 ${Math.abs(item.daysLeft)} 天`
                        : `还剩 ${item.daysLeft} 天`}
                    </span>
                  </div>
                </div>
              </div>

              <ChevronRight size={16} color="#ccc" />
            </div>
          );
        })}
      </div>

      {/* OCR Modal */}
      {showOCR && (
        <div
          className="absolute inset-0 flex items-end z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowOCR(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />
            <h3 className="text-base mb-2" style={{ color: "#1a1a1a", fontWeight: 700 }}>
              📸 OCR 智能入库
            </h3>
            <p className="text-xs mb-4" style={{ color: "#999" }}>
              上传购物小票或截图，系统将自动识别食材信息并入库
            </p>

            <div
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-8 mb-4 cursor-pointer"
              style={{ borderColor: "#FFD4C2" }}
            >
              <Camera size={36} color="#FF6B35" />
              <p className="text-sm mt-2" style={{ color: "#FF6B35", fontWeight: 600 }}>点击拍照或上传图片</p>
              <p className="text-xs mt-1" style={{ color: "#bbb" }}>支持 JPG、PNG 格式</p>
            </div>

            {/* OCR Preview */}
            <div className="rounded-2xl p-3 mb-4" style={{ background: "#F5F5F5" }}>
              <p className="text-xs mb-2" style={{ color: "#999", fontWeight: 600 }}>识别预览（示例）</p>
              <div className="space-y-1.5">
                {[
                  { field: "品类", value: "鸡胸肉（白肉）" },
                  { field: "重量", value: "500g" },
                  { field: "价格", value: "¥22.50" },
                  { field: "生产日期", value: "2024-01-15" },
                  { field: "截止日期", value: "2024-02-15" },
                ].map((f) => (
                  <div key={f.field} className="flex justify-between">
                    <span className="text-xs" style={{ color: "#999" }}>{f.field}</span>
                    <span className="text-xs" style={{ color: "#1a1a1a", fontWeight: 600 }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="w-full py-3.5 rounded-2xl text-white"
              style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", fontWeight: 600 }}
              onClick={() => setShowOCR(false)}
            >
              确认入库
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
