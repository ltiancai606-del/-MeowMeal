import { useNavigate } from "react-router";
import { ArrowLeft, Play, RefreshCw, ChevronDown, Info } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";

const macroData = [
  { name: "蛋白质", value: 58, grams: 812, color: "#FF6B35" },
  { name: "脂肪", value: 32, grams: 448, color: "#FFB74D" },
  { name: "碳水", value: 4, grams: 56, color: "#4CAF50" },
  { name: "水分", value: 6, grams: 84, color: "#64B5F6" },
];

const categoryData = [
  { name: "白肉（鸡胸）", value: 35, grams: 490, color: "#FF6B35" },
  { name: "红肉（猪腿）", value: 25, grams: 350, color: "#E53935" },
  { name: "心脏", value: 15, grams: 210, color: "#9C27B0" },
  { name: "肝脏", value: 10, grams: 140, color: "#8B4513" },
  { name: "鱼类", value: 9, grams: 126, color: "#2196F3" },
  { name: "青口贝", value: 5, grams: 70, color: "#009688" },
  { name: "其他内脏", value: 1, grams: 14, color: "#795548" },
];

const ingredients = [
  { category: "白肉", name: "鸡胸肉", weight: "490g", unit: "g", status: "正常" },
  { category: "红肉", name: "猪腿肉", weight: "350g", unit: "g", status: "正常" },
  { category: "心脏", name: "猪心", weight: "140g", unit: "g", status: "正常" },
  { category: "心脏", name: "鸡心", weight: "70g", unit: "g", status: "正常" },
  { category: "肝脏", name: "鸡肝", weight: "140g", unit: "g", status: "临期" },
  { category: "鱼类", name: "三文鱼", weight: "126g", unit: "g", status: "正常" },
  { category: "贝类", name: "青口贝", weight: "70g", unit: "g", status: "正常" },
];

const supplements = [
  { name: "柠檬酸钙 (NowFoods)", amount: "1.2g", purpose: "补充钙质" },
  { name: "碘化钾", amount: "0.08g", purpose: "补充碘元素" },
  { name: "维生素E", amount: "0.5g", purpose: "抗氧化" },
];

const nutrients = [
  { name: "蛋白质", current: 58.2, recommended: "45-65%", status: "pass" },
  { name: "脂肪", current: 32.1, recommended: "30-50%", status: "pass" },
  { name: "碳水化合物", current: 4.2, recommended: "<10%", status: "pass" },
  { name: "牛磺酸", current: 0.08, recommended: "0.1%", status: "warn" },
  { name: "维生素A", current: 1.2, recommended: "1.0-2.0%", status: "pass" },
  { name: "钙", current: 0.6, recommended: "0.6-1.0%", status: "pass" },
  { name: "磷", current: 0.5, recommended: "0.5-0.8%", status: "pass" },
  { name: "钾", current: 0.3, recommended: "0.4%+", status: "fail" },
];

const statusConfig = {
  pass: { label: "达标", color: "#4CAF50", bg: "#E8F5E9" },
  warn: { label: "偏低", color: "#FF9800", bg: "#FFF3E0" },
  fail: { label: "不足", color: "#F44336", bg: "#FFEBEE" },
};

export function RecipeDetailScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "ingredients" | "nutrients">("overview");
  const [standard, setStandard] = useState<"NRC" | "AAFCO">("NRC");

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#FFF8F3" }}>
      {/* Header */}
      <div
        className="px-4 pt-3 pb-4"
        style={{ background: "linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate("/recipe")}
            className="p-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <ArrowLeft size={18} color="white" />
          </button>
          <div className="flex-1">
            <p className="text-white text-opacity-80 text-xs">执行中 · NRC 标准 · 第 12 天</p>
            <h2 className="text-white text-base" style={{ fontWeight: 700 }}>
              橘橘小白均衡营养餐
            </h2>
          </div>
          <button
            className="p-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <RefreshCw size={16} color="white" />
          </button>
        </div>

        {/* Cat tags */}
        <div className="flex gap-2 mb-3">
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
            🐱 橘橘 4.2kg
          </span>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
            🐈 小白 3.8kg
          </span>
        </div>

        {/* Quick stats */}
        <div className="flex gap-2">
          {[
            { label: "每日总量", value: "133g/只" },
            { label: "周期", value: "21天" },
            { label: "制作总量", value: "1400g" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-xl py-2 px-3 text-center"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              <p className="text-xs text-white text-opacity-80">{s.label}</p>
              <p className="text-sm text-white" style={{ fontWeight: 700 }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white border-b" style={{ borderColor: "#F0F0F0" }}>
        {[
          { key: "overview", label: "营养总览" },
          { key: "ingredients", label: "食材清单" },
          { key: "nutrients", label: "达标分析" },
        ].map((tab) => (
          <button
            key={tab.key}
            className="flex-1 py-3 text-sm relative"
            style={{
              color: activeTab === tab.key ? "#FF6B35" : "#999",
              fontWeight: activeTab === tab.key ? 600 : 400,
            }}
            onClick={() => setActiveTab(tab.key as any)}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full"
                style={{ width: "32px", height: "3px", background: "#FF6B35" }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Macro Pie Chart */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p className="text-sm mb-3" style={{ color: "#1a1a1a", fontWeight: 600 }}>三大营养素占比</p>
              <div className="flex items-center">
                <div style={{ width: "140px", height: "140px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={macroData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}%`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 ml-4 space-y-2">
                  {macroData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full" style={{ width: "8px", height: "8px", background: item.color }} />
                        <span className="text-xs" style={{ color: "#666" }}>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs" style={{ color: "#1a1a1a", fontWeight: 600 }}>{item.value}%</span>
                        <span className="text-xs ml-1" style={{ color: "#999" }}>({item.grams}g)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p className="text-sm mb-3" style={{ color: "#1a1a1a", fontWeight: 600 }}>食材品类占比</p>
              <div className="flex items-center">
                <div style={{ width: "140px", height: "140px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" outerRadius={65} paddingAngle={2} dataKey="value">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any, name: any) => [`${value}%`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 ml-3 space-y-1.5">
                  {categoryData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="rounded-sm" style={{ width: "6px", height: "6px", background: item.color }} />
                        <span style={{ fontSize: "10px", color: "#666" }}>{item.name}</span>
                      </div>
                      <span style={{ fontSize: "10px", color: "#999" }}>{item.grams}g</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Supplements */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p className="text-sm mb-3" style={{ color: "#1a1a1a", fontWeight: 600 }}>💊 补剂清单</p>
              <div className="space-y-2">
                {supplements.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                    style={{ borderColor: "#F5F5F5" }}
                  >
                    <div>
                      <p className="text-xs" style={{ color: "#1a1a1a", fontWeight: 500 }}>{s.name}</p>
                      <p className="text-xs" style={{ color: "#999" }}>{s.purpose}</p>
                    </div>
                    <span className="text-sm" style={{ color: "#FF6B35", fontWeight: 700 }}>{s.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Ingredients Tab */}
        {activeTab === "ingredients" && (
          <>
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>食材清单（总量 1400g）</p>
                <button className="text-xs flex items-center gap-1" style={{ color: "#FF6B35" }}>
                  <RefreshCw size={12} />
                  替换食材
                </button>
              </div>
              <div className="space-y-2">
                {ingredients.map((ing) => (
                  <div
                    key={`${ing.category}-${ing.name}`}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                    style={{ background: "#FFF8F3" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background:
                            ing.category === "白肉" ? "#FF6B35" :
                            ing.category === "红肉" ? "#E53935" :
                            ing.category === "心脏" ? "#9C27B0" :
                            ing.category === "肝脏" ? "#8B4513" :
                            ing.category === "鱼类" ? "#2196F3" : "#009688"
                        }}
                      />
                      <div>
                        <p className="text-xs" style={{ color: "#1a1a1a", fontWeight: 500 }}>{ing.name}</p>
                        <p style={{ fontSize: "10px", color: "#999" }}>{ing.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ing.status === "临期" && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "#FFF3E0", color: "#FF9800" }}>
                          临期
                        </span>
                      )}
                      <span className="text-sm" style={{ color: "#FF6B35", fontWeight: 700 }}>{ing.weight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ratio check */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Info size={14} color="#FF9800" />
                <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>比例校验</p>
              </div>
              <div className="space-y-2">
                {[
                  { label: "红肉占比", value: 25, range: "20-30%", ok: true },
                  { label: "鱼类占比", value: 9, range: "8-10%", ok: true },
                  { label: "青口贝占比", value: 5, range: "5%", ok: true },
                  { label: "肝脏占比", value: 10, range: "5-10%", ok: true },
                  { label: "心脏占比", value: 15, range: "5-20%", ok: true },
                  { label: "其他内脏", value: 1, range: "5%", ok: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#666" }}>{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: "#999" }}>推荐 {item.range}</span>
                      <span className="text-xs" style={{ color: item.ok ? "#4CAF50" : "#F44336", fontWeight: 600 }}>
                        当前 {item.value}% {item.ok ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Nutrients Tab */}
        {activeTab === "nutrients" && (
          <>
            {/* Standard selector */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>营养达标分析</p>
                <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "#F0F0F0" }}>
                  {(["NRC", "AAFCO"] as const).map((s) => (
                    <button
                      key={s}
                      className="px-3 py-1.5 text-xs"
                      style={{
                        background: standard === s ? "#FF6B35" : "white",
                        color: standard === s ? "white" : "#666",
                        fontWeight: standard === s ? 600 : 400,
                      }}
                      onClick={() => setStandard(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-3 mb-4">
                {Object.entries(statusConfig).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: val.color }} />
                    <span className="text-xs" style={{ color: "#999" }}>{val.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                {nutrients.map((n) => {
                  const config = statusConfig[n.status as keyof typeof statusConfig];
                  return (
                    <div
                      key={n.name}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                      style={{ background: "#F9F9F9" }}
                    >
                      <div className="flex-1">
                        <p className="text-xs" style={{ color: "#1a1a1a", fontWeight: 500 }}>{n.name}</p>
                        <p style={{ fontSize: "10px", color: "#999" }}>推荐: {n.recommended}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                          {n.current}%
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: config.bg, color: config.color, fontWeight: 600 }}
                        >
                          {config.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Execute Button */}
        <button
          className="w-full py-3.5 rounded-2xl text-white flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", fontWeight: 600 }}
        >
          <Play size={18} />
          执行食谱（扣减冰箱库存）
        </button>

        <div style={{ height: "8px" }} />
      </div>
    </div>
  );
}
