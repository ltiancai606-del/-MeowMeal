import { useNavigate } from "react-router";
import { Plus, Search, CheckCircle, Clock, Play, ChevronRight } from "lucide-react";

const recipes = [
  {
    id: 1,
    name: "橘橘小白均衡营养餐",
    cats: ["橘橘", "小白"],
    standard: "NRC",
    status: "执行中",
    statusColor: "#4CAF50",
    statusBg: "#E8F5E9",
    days: 21,
    executedDays: 12,
    totalWeight: "1400g",
    protein: 58,
    fat: 32,
    createdAt: "2024-01-15",
    ingredients: ["鸡胸肉", "猪心", "鸡肝", "青口贝"],
  },
  {
    id: 2,
    name: "橘橘高蛋白增肌食谱",
    cats: ["橘橘"],
    standard: "AAFCO",
    status: "已完成",
    statusColor: "#9C27B0",
    statusBg: "#F3E5F5",
    days: 21,
    executedDays: 21,
    totalWeight: "700g",
    protein: 62,
    fat: 28,
    createdAt: "2023-12-20",
    ingredients: ["鸡胸肉", "鸭心", "牛肝", "三文鱼"],
  },
  {
    id: 3,
    name: "小白减脂低热量食谱",
    cats: ["小白"],
    standard: "NRC",
    status: "草稿",
    statusColor: "#999",
    statusBg: "#F5F5F5",
    days: 28,
    executedDays: 0,
    totalWeight: "560g",
    protein: 65,
    fat: 22,
    createdAt: "2024-01-18",
    ingredients: ["鸡胸肉", "兔腿肉", "鸡心", "鳕鱼"],
  },
];

export function RecipeScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#FFF8F3" }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg" style={{ color: "#1a1a1a", fontWeight: 700 }}>
            🍽️ 食谱管理
          </h1>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm"
            style={{ background: "#FF6B35", fontWeight: 600 }}
            onClick={() => navigate("/recipe/create")}
          >
            <Plus size={16} />
            新建食谱
          </button>
        </div>
        {/* Search */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{ background: "#F5F5F5" }}
        >
          <Search size={16} color="#999" />
          <span className="text-sm" style={{ color: "#bbb" }}>搜索食谱...</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {["全部", "执行中", "已完成", "草稿"].map((tab, i) => (
          <button
            key={tab}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm"
            style={{
              background: i === 0 ? "#FF6B35" : "white",
              color: i === 0 ? "white" : "#666",
              boxShadow: i === 0 ? "none" : "0 1px 4px rgba(0,0,0,0.08)",
              fontWeight: i === 0 ? 600 : 400,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Recipe Cards */}
      <div className="px-4 space-y-3 pb-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-2xl p-4 cursor-pointer"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            onClick={() => navigate(`/recipe/${recipe.id}`)}
          >
            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 mr-2">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: recipe.statusBg, color: recipe.statusColor, fontWeight: 600 }}
                  >
                    {recipe.status}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "#EEF2FF", color: "#5C6BC0" }}
                  >
                    {recipe.standard}
                  </span>
                </div>
                <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>
                  {recipe.name}
                </p>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </div>

            {/* Cat tags */}
            <div className="flex gap-1.5 mb-3">
              {recipe.cats.map((cat) => (
                <span
                  key={cat}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "#FFF0E8", color: "#FF6B35" }}
                >
                  🐱 {cat}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-3 mb-3">
              <div className="flex items-center gap-1">
                <Clock size={12} color="#999" />
                <span className="text-xs" style={{ color: "#999" }}>{recipe.days} 天周期</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={12} color="#4CAF50" />
                <span className="text-xs" style={{ color: "#999" }}>已执行 {recipe.executedDays} 天</span>
              </div>
              <span className="text-xs" style={{ color: "#999" }}>总量 {recipe.totalWeight}</span>
            </div>

            {/* Ingredient tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {recipe.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="text-xs px-2 py-0.5 rounded-lg"
                  style={{ background: "#F5F5F5", color: "#666" }}
                >
                  {ing}
                </span>
              ))}
            </div>

            {/* Nutrition bar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: "#999" }}>营养比例</span>
                <span className="text-xs" style={{ color: "#999" }}>
                  蛋白 {recipe.protein}% · 脂肪 {recipe.fat}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden flex" style={{ background: "#F0F0F0" }}>
                <div style={{ width: `${recipe.protein}%`, background: "#FF6B35" }} />
                <div style={{ width: `${recipe.fat}%`, background: "#FFB74D" }} />
                <div style={{ flex: 1, background: "#4CAF50" }} />
              </div>
              <div className="flex gap-4 mt-1">
                {[
                  { label: "蛋白质", color: "#FF6B35" },
                  { label: "脂肪", color: "#FFB74D" },
                  { label: "碳水", color: "#4CAF50" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1">
                    <div className="rounded-full" style={{ width: "6px", height: "6px", background: item.color }} />
                    <span style={{ fontSize: "10px", color: "#999" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {recipe.status === "草稿" && (
              <button
                className="mt-3 w-full py-2 rounded-xl text-sm flex items-center justify-center gap-1.5"
                style={{ background: "#FF6B35", color: "white", fontWeight: 600 }}
                onClick={(e) => { e.stopPropagation(); navigate(`/recipe/${recipe.id}`); }}
              >
                <Play size={14} />
                开始执行
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
