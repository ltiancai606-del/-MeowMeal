import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Zap, Package } from "lucide-react";

const steps = ["选择猫咪", "定制设置", "生成预览", "确认保存"];

const cats = [
  { id: 1, name: "橘橘", avatar: "🐱", weight: 4.2, age: "3岁" },
  { id: 2, name: "小白", avatar: "🐈", weight: 3.8, age: "2岁" },
];

const meatTypes = [
  { id: "red", label: "红肉", ratio: "20-30%", examples: "猪腿、牛肉", color: "#E53935" },
  { id: "white", label: "白肉", ratio: "30-45%", examples: "鸡胸、鸭胸", color: "#FF6B35" },
  { id: "fish", label: "鱼类", ratio: "8-10%", examples: "三文鱼、鳕鱼", color: "#2196F3" },
  { id: "mussel", label: "青口贝", ratio: "5%", examples: "青口贝", color: "#009688" },
  { id: "liver", label: "肝脏", ratio: "5-10%", examples: "鸡肝、鸭肝", color: "#8B4513" },
  { id: "heart", label: "心脏", ratio: "5-20%", examples: "猪心、鸡心", color: "#9C27B0" },
  { id: "organ", label: "其他内脏", ratio: "5%", examples: "肾脏、胃", color: "#795548" },
];

const previewIngredients = [
  { category: "白肉", name: "鸡胸肉", weight: 490, color: "#FF6B35" },
  { category: "红肉", name: "猪腿肉", weight: 350, color: "#E53935" },
  { category: "心脏", name: "猪心", weight: 140, color: "#9C27B0" },
  { category: "心脏", name: "鸡心", weight: 70, color: "#9C27B0" },
  { category: "肝脏", name: "鸡肝", weight: 140, color: "#8B4513" },
  { category: "鱼类", name: "三文鱼", weight: 126, color: "#2196F3" },
  { category: "贝类", name: "青口贝", weight: 70, color: "#009688" },
];

export function RecipeCreateScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedCats, setSelectedCats] = useState<number[]>([1, 2]);
  const [mode, setMode] = useState<"demand" | "inventory">("demand");
  const [standard, setStandard] = useState<"NRC" | "AAFCO">("NRC");
  const [dailyGrams, setDailyGrams] = useState(133);
  const [days, setDays] = useState(21);

  const toggleCat = (id: number) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "#FFF8F3" }}>
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => (step === 0 ? navigate("/recipe") : setStep((s) => s - 1))}
            className="p-1.5 rounded-full"
            style={{ background: "#F5F5F5" }}
          >
            <ArrowLeft size={18} color="#333" />
          </button>
          <h2 className="flex-1 text-base" style={{ color: "#1a1a1a", fontWeight: 700 }}>
            新建食谱
          </h2>
          <span className="text-sm" style={{ color: "#999" }}>
            {step + 1}/{steps.length}
          </span>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <div
              key={s}
              className="flex-1 h-1 rounded-full"
              style={{ background: i <= step ? "#FF6B35" : "#F0F0F0" }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          {steps.map((s, i) => (
            <span
              key={s}
              style={{
                fontSize: "9px",
                color: i <= step ? "#FF6B35" : "#bbb",
                fontWeight: i === step ? 700 : 400,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Step 0: Select Cats */}
        {step === 0 && (
          <>
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p className="text-sm mb-3" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                选择喂食猫咪（可多选）
              </p>
              <div className="space-y-3">
                {cats.map((cat) => {
                  const selected = selectedCats.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer border-2 transition-all"
                      style={{
                        borderColor: selected ? "#FF6B35" : "#F0F0F0",
                        background: selected ? "#FFF0E8" : "white",
                      }}
                      onClick={() => toggleCat(cat.id)}
                    >
                      <div
                        className="rounded-2xl flex items-center justify-center"
                        style={{ width: "48px", height: "48px", background: "#FFE0CC", fontSize: "26px" }}
                      >
                        {cat.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>{cat.name}</p>
                        <p className="text-xs" style={{ color: "#999" }}>
                          体重 {cat.weight}kg · {cat.age} · 已绝育
                        </p>
                        <p className="text-xs" style={{ color: "#FF9800" }}>
                          📊 推荐每日 {Math.round(cat.weight * 30)}g
                        </p>
                      </div>
                      <div
                        className="rounded-full flex items-center justify-center"
                        style={{
                          width: "24px",
                          height: "24px",
                          background: selected ? "#FF6B35" : "#F0F0F0",
                        }}
                      >
                        {selected && <Check size={14} color="white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p className="text-sm mb-3" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                营养标准
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(["NRC", "AAFCO"] as const).map((s) => (
                  <button
                    key={s}
                    className="p-3 rounded-2xl border-2 text-left transition-all"
                    style={{
                      borderColor: standard === s ? "#FF6B35" : "#F0F0F0",
                      background: standard === s ? "#FFF0E8" : "white",
                    }}
                    onClick={() => setStandard(s)}
                  >
                    <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>{s}</p>
                    <p className="text-xs mt-1" style={{ color: "#999" }}>
                      {s === "NRC" ? "美国国家研究委员会\n猫咪营养标准" : "美国饲料管理员协会\n国际通用标准"}
                    </p>
                    {standard === s && (
                      <div
                        className="mt-2 text-xs px-2 py-0.5 rounded-full inline-block"
                        style={{ background: "#FF6B35", color: "white" }}
                      >
                        已选择
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 1: Mode & Settings */}
        {step === 1 && (
          <>
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p className="text-sm mb-3" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                制作模式
              </p>
              <div className="space-y-3">
                {[
                  {
                    key: "demand",
                    icon: Zap,
                    label: "按需定总量",
                    desc: "输入每日喂食量，系统自动计算总量和食材配比",
                    color: "#FF6B35",
                    bg: "#FFF0E8",
                  },
                  {
                    key: "inventory",
                    icon: Package,
                    label: "按库存反推",
                    desc: "优先使用冰箱库存食材，智能分配用量",
                    color: "#2196F3",
                    bg: "#E3F2FD",
                  },
                ].map((m) => (
                  <div
                    key={m.key}
                    className="flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all"
                    style={{
                      borderColor: mode === m.key ? m.color : "#F0F0F0",
                      background: mode === m.key ? m.bg : "white",
                    }}
                    onClick={() => setMode(m.key as any)}
                  >
                    <div
                      className="rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ width: "40px", height: "40px", background: m.bg }}
                    >
                      <m.icon size={20} color={m.color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>{m.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#999" }}>{m.desc}</p>
                    </div>
                    <div
                      className="rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        width: "20px",
                        height: "20px",
                        background: mode === m.key ? m.color : "#F0F0F0",
                      }}
                    >
                      {mode === m.key && <Check size={12} color="white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {mode === "demand" && (
              <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <p className="text-sm mb-4" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                  喂食参数设置
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm" style={{ color: "#666" }}>每只每日喂食量</label>
                      <span className="text-sm" style={{ color: "#FF6B35", fontWeight: 700 }}>
                        {dailyGrams}g / 只
                      </span>
                    </div>
                    <input
                      type="range"
                      min={80}
                      max={200}
                      value={dailyGrams}
                      onChange={(e) => setDailyGrams(Number(e.target.value))}
                      className="w-full"
                      style={{ accentColor: "#FF6B35" }}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs" style={{ color: "#bbb" }}>80g</span>
                      <span className="text-xs" style={{ color: "#bbb" }}>200g</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm" style={{ color: "#666" }}>喂食周期</label>
                      <span className="text-sm" style={{ color: "#FF6B35", fontWeight: 700 }}>
                        {days} 天
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {[14, 21, 28].map((d) => (
                        <button
                          key={d}
                          className="flex-1 py-2 rounded-xl text-sm"
                          style={{
                            background: days === d ? "#FF6B35" : "#F5F5F5",
                            color: days === d ? "white" : "#666",
                            fontWeight: days === d ? 600 : 400,
                          }}
                          onClick={() => setDays(d)}
                        >
                          {d} 天
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl p-3" style={{ background: "#FFF0E8" }}>
                    <p className="text-xs" style={{ color: "#FF6B35", fontWeight: 600 }}>计算结果预览</p>
                    <div className="flex gap-4 mt-1.5">
                      <div>
                        <p className="text-xs" style={{ color: "#999" }}>单猫总量</p>
                        <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 700 }}>
                          {dailyGrams * days}g
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "#999" }}>制作总量</p>
                        <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 700 }}>
                          {dailyGrams * days * selectedCats.length}g（{selectedCats.length} 只）
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mode === "inventory" && (
              <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <p className="text-sm mb-3" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                  冰箱可用库存
                </p>
                <div className="space-y-2">
                  {[
                    { name: "鸡胸肉", stock: "800g", expiry: "2024-02-10", color: "#4CAF50" },
                    { name: "猪腿肉", stock: "500g", expiry: "2024-02-05", color: "#FF9800" },
                    { name: "猪心", stock: "300g", expiry: "2024-02-15", color: "#4CAF50" },
                    { name: "鸡肝", stock: "200g", expiry: "2024-01-25", color: "#F44336" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                      style={{ background: "#F9F9F9" }}
                    >
                      <span className="text-xs" style={{ color: "#1a1a1a", fontWeight: 500 }}>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "#999" }}>库存 {item.stock}</span>
                        <span className="text-xs" style={{ color: item.color }}>
                          {item.expiry}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p className="text-sm mb-3" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                过敏源排除
              </p>
              <div className="flex flex-wrap gap-2">
                {["牛肉", "羊肉", "海鲜"].map((a) => (
                  <span
                    key={a}
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{ background: "#FFEBEE", color: "#F44336", fontWeight: 600 }}
                  >
                    ✕ {a}（橘橘过敏）
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 2: Preview */}
        {step === 2 && (
          <>
            <div
              className="rounded-2xl p-4"
              style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", boxShadow: "0 4px 20px rgba(255,107,53,0.3)" }}
            >
              <p className="text-white text-opacity-80 text-xs mb-1">AI 生成食谱</p>
              <p className="text-white text-base" style={{ fontWeight: 700 }}>橘橘小白均衡营养餐</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>
                  🐱 橘橘
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>
                  🐈 小白
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>
                  NRC 标准
                </span>
              </div>
              <div className="flex gap-3 mt-3">
                <div className="text-center">
                  <p className="text-white text-opacity-70" style={{ fontSize: "10px" }}>每只每日</p>
                  <p className="text-white text-sm" style={{ fontWeight: 700 }}>133g</p>
                </div>
                <div className="text-center">
                  <p className="text-white text-opacity-70" style={{ fontSize: "10px" }}>周期</p>
                  <p className="text-white text-sm" style={{ fontWeight: 700 }}>21天</p>
                </div>
                <div className="text-center">
                  <p className="text-white text-opacity-70" style={{ fontSize: "10px" }}>制作总量</p>
                  <p className="text-white text-sm" style={{ fontWeight: 700 }}>1400g</p>
                </div>
              </div>
            </div>

            {/* Generated Ingredients */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>生成食材清单</p>
                <span className="text-xs" style={{ color: "#FF6B35" }}>点击可替换食材 →</span>
              </div>
              <div className="space-y-2">
                {previewIngredients.map((ing) => (
                  <div
                    key={`${ing.category}-${ing.name}`}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer"
                    style={{ background: "#FFF8F3" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: ing.color }} />
                      <div>
                        <p className="text-xs" style={{ color: "#1a1a1a", fontWeight: 500 }}>
                          {ing.category} · {ing.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: "#FF6B35", fontWeight: 700 }}>{ing.weight}g</span>
                      <ChevronRight size={12} color="#ccc" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition quick view */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p className="text-sm mb-3" style={{ color: "#1a1a1a", fontWeight: 600 }}>营养素预估</p>
              <div className="space-y-2">
                {[
                  { label: "蛋白质", value: 58, status: "pass" },
                  { label: "脂肪", value: 32, status: "pass" },
                  { label: "碳水", value: 4, status: "pass" },
                  { label: "牛磺酸", value: 0.08, status: "warn" },
                ].map((n) => {
                  const config = { pass: { color: "#4CAF50", label: "达标" }, warn: { color: "#FF9800", label: "偏低" } };
                  const c = config[n.status as keyof typeof config];
                  return (
                    <div key={n.label} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#666" }}>{n.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "#1a1a1a", fontWeight: 600 }}>{n.value}%</span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: n.status === "pass" ? "#E8F5E9" : "#FFF3E0", color: c.color }}>
                          {c.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <>
            <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div
                className="rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ width: "64px", height: "64px", background: "#E8F5E9" }}
              >
                <Check size={32} color="#4CAF50" />
              </div>
              <p className="text-base" style={{ color: "#1a1a1a", fontWeight: 700 }}>食谱已生成！</p>
              <p className="text-xs mt-1" style={{ color: "#999" }}>
                "橘橘小白均衡营养餐" 已保存，可随时执行
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p className="text-sm mb-3" style={{ color: "#1a1a1a", fontWeight: 600 }}>食谱摘要</p>
              <div className="space-y-2.5">
                {[
                  { label: "食谱名称", value: "橘橘小白均衡营养餐" },
                  { label: "目标猫咪", value: "橘橘、小白（2只）" },
                  { label: "营养标准", value: "NRC" },
                  { label: "制作模式", value: "按需定总量" },
                  { label: "每日喂量", value: "133g / 只" },
                  { label: "喂食周期", value: "21 天" },
                  { label: "制作总量", value: "1400g" },
                  { label: "食材种类", value: "7 种" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-xs" style={{ color: "#999" }}>{item.label}</span>
                    <span className="text-xs" style={{ color: "#1a1a1a", fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="w-full py-3.5 rounded-2xl text-white"
              style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", fontWeight: 600 }}
              onClick={() => navigate("/recipe")}
            >
              🎉 立即执行食谱
            </button>
            <button
              className="w-full py-3 rounded-2xl text-sm"
              style={{ background: "white", color: "#FF6B35", fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              onClick={() => navigate("/recipe")}
            >
              稍后执行，返回列表
            </button>
          </>
        )}
      </div>

      {/* Bottom Button */}
      {step < 3 && (
        <div className="px-4 py-3 bg-white" style={{ borderTop: "1px solid #F0F0F0" }}>
          <button
            className="w-full py-3.5 rounded-2xl text-white flex items-center justify-center gap-2"
            style={{
              background:
                step === 0 && selectedCats.length === 0
                  ? "#E0E0E0"
                  : "linear-gradient(135deg, #FF6B35, #FF8C5A)",
              fontWeight: 600,
              cursor: step === 0 && selectedCats.length === 0 ? "not-allowed" : "pointer",
            }}
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && selectedCats.length === 0}
          >
            {step === 2 ? "生成食谱" : "下一步"}
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
