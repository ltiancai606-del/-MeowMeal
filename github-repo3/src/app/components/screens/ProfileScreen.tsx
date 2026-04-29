import { useState } from "react";
import { ChevronRight, Plus, Edit2, Shield, Bell, HelpCircle, LogOut, Star, X, Camera } from "lucide-react";

type CatProfile = {
  id: number;
  name: string;
  avatar: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  neutered: boolean;
  allergies: string[];
  healthNeeds: string[];
  meatPreference: string[];
};

type EditForm = {
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  neutered: boolean;
  allergies: string;
  healthNeeds: string;
  meatPreference: string;
  avatarUrl: string;
};

const initialCats: CatProfile[] = [
  {
    id: 1,
    name: "橘橘",
    avatar: "🐱",
    breed: "橘猫",
    age: "3岁",
    weight: "4.2kg",
    gender: "公",
    neutered: true,
    allergies: ["牛肉", "羊肉", "海鲜"],
    healthNeeds: ["护肾", "毛球控制"],
    meatPreference: ["鸡肉", "猪肉", "鸭肉"],
  },
  {
    id: 2,
    name: "小白",
    avatar: "🐈",
    breed: "英短",
    age: "2岁",
    weight: "3.8kg",
    gender: "母",
    neutered: true,
    allergies: [],
    healthNeeds: ["减脂"],
    meatPreference: ["鸡肉", "兔肉", "鱼"],
  },
];

export function ProfileScreen() {
  const [activeCat, setActiveCat] = useState(0);
  const [showAddCat, setShowAddCat] = useState(false);
  const [showEditCat, setShowEditCat] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);

  const cat = initialCats[activeCat];

  const openEdit = () => {
    setEditForm({
      name: cat.name,
      breed: cat.breed,
      age: cat.age,
      weight: cat.weight,
      gender: cat.gender,
      neutered: cat.neutered,
      allergies: cat.allergies.join("、"),
      healthNeeds: cat.healthNeeds.join("、"),
      meatPreference: cat.meatPreference.join("、"),
      avatarUrl: "",
    });
    setShowEditCat(true);
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#FFF8F3" }}>
      {/* Header */}
      <div
        className="px-5 pt-4 pb-6"
        style={{ background: "linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg text-white" style={{ fontWeight: 700 }}>个人中心</h1>
          <button className="p-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
            <Edit2 size={16} color="white" />
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3">
          <div
            className="rounded-2xl flex items-center justify-center"
            style={{ width: "60px", height: "60px", background: "rgba(255,255,255,0.25)", fontSize: "30px" }}
          >
            😊
          </div>
          <div>
            <p className="text-white text-base" style={{ fontWeight: 700 }}>喵主人</p>
            <p className="text-white text-opacity-80 text-xs">已养 2 只猫 · 使用喵膳 48 天</p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} color="#FFD700" fill="#FFD700" />
              <span className="text-white text-opacity-80" style={{ fontSize: "11px" }}>科学喂养达人</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3 py-4">
        {/* Cat Profiles */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: "#1a1a1a", fontWeight: 600 }}>🐾 猫咪档案</span>
            <button
              className="flex items-center gap-1 text-xs"
              style={{ color: "#FF6B35" }}
              onClick={() => setShowAddCat(true)}
            >
              <Plus size={13} />
              添加猫咪
            </button>
          </div>

          {/* Cat selector */}
          <div className="flex gap-2 mb-4">
            {initialCats.map((c, i) => (
              <button
                key={c.id}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl border-2 transition-all"
                style={{
                  borderColor: activeCat === i ? "#FF6B35" : "#F0F0F0",
                  background: activeCat === i ? "#FFF0E8" : "white",
                }}
                onClick={() => setActiveCat(i)}
              >
                <span style={{ fontSize: "20px" }}>{c.avatar}</span>
                <span className="text-sm" style={{ color: activeCat === i ? "#FF6B35" : "#666", fontWeight: activeCat === i ? 700 : 400 }}>
                  {c.name}
                </span>
              </button>
            ))}
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 border-dashed"
              style={{ borderColor: "#FFD4C2", color: "#FF6B35" }}
              onClick={() => setShowAddCat(true)}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Cat detail */}
          <div className="rounded-2xl p-4" style={{ background: "#FFF8F3" }}>
            {/* Basic info */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="rounded-2xl flex items-center justify-center"
                style={{ width: "60px", height: "60px", background: "#FFE0CC", fontSize: "32px" }}
              >
                {cat.avatar}
              </div>
              <div>
                <p className="text-base" style={{ color: "#1a1a1a", fontWeight: 700 }}>{cat.name}</p>
                <p className="text-xs" style={{ color: "#999" }}>{cat.breed} · {cat.gender} · {cat.age}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#E8F5E9", color: "#4CAF50" }}>
                    {cat.neutered ? "已绝育" : "未绝育"}
                  </span>
                  <span className="text-sm" style={{ color: "#FF6B35", fontWeight: 700 }}>{cat.weight}</span>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="space-y-3">
              <div>
                <p className="text-xs mb-2" style={{ color: "#999", fontWeight: 600 }}>⚠️ 过敏源 / 忌口</p>
                {cat.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {cat.allergies.map((a) => (
                      <span key={a} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#FFEBEE", color: "#F44336" }}>
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: "#bbb" }}>暂无过敏源记录</p>
                )}
              </div>

              <div>
                <p className="text-xs mb-2" style={{ color: "#999", fontWeight: 600 }}>💊 健康需求</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.healthNeeds.map((h) => (
                    <span key={h} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#E3F2FD", color: "#2196F3" }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs mb-2" style={{ color: "#999", fontWeight: 600 }}>🍖 肉类偏好</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.meatPreference.map((m) => (
                    <span key={m} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#FFF0E8", color: "#FF6B35" }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="mt-4 w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
              style={{ background: "white", color: "#FF6B35", fontWeight: 600, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
              onClick={openEdit}
            >
              <Edit2 size={14} />
              编辑档案
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <p className="text-sm mb-3" style={{ color: "#1a1a1a", fontWeight: 600 }}>📊 使用统计</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "完成食谱", value: "6", unit: "份", color: "#FF6B35" },
              { label: "累计制作", value: "8.4", unit: "kg", color: "#2196F3" },
              { label: "累计花费", value: "¥2847", unit: "", color: "#9C27B0" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: "#FFF8F3" }}>
                <p className="text-lg" style={{ color: s.color, fontWeight: 700 }}>
                  {s.value}<span className="text-xs">{s.unit}</span>
                </p>
                <p className="text-xs" style={{ color: "#999" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          {[
            { icon: Bell, label: "消息通知", desc: "临期提醒、执行提醒" },
            { icon: Shield, label: "数据安全", desc: "数据备份与隐私设置" },
            { icon: HelpCircle, label: "使用帮助", desc: "常见问题、功能说明" },
          ].map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
              style={{ borderBottom: i < 2 ? "1px solid #F5F5F5" : "none" }}
            >
              <div
                className="rounded-xl flex items-center justify-center"
                style={{ width: "36px", height: "36px", background: "#FFF0E8" }}
              >
                <item.icon size={18} color="#FF6B35" />
              </div>
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#1a1a1a", fontWeight: 500 }}>{item.label}</p>
                <p className="text-xs" style={{ color: "#bbb" }}>{item.desc}</p>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </div>
          ))}
        </div>

        <button
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
          style={{ background: "white", color: "#F44336", fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          <LogOut size={16} />
          退出登录
        </button>

        <div style={{ height: "8px" }} />
      </div>

      {/* Add Cat Sheet */}
      {showAddCat && (
        <div
          className="absolute inset-0 flex items-end z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowAddCat(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl p-5"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "75%" }}
          >
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />
            <h3 className="text-base mb-4" style={{ color: "#1a1a1a", fontWeight: 700 }}>
              ➕ 添加猫咪档案
            </h3>

            <div className="space-y-3">
              {[
                { label: "猫咪名字", placeholder: "给你的猫咪起个名字" },
                { label: "年龄", placeholder: "例如: 2岁" },
                { label: "体重 (kg)", placeholder: "例如: 4.2" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs mb-1 block" style={{ color: "#666" }}>{f.label}</label>
                  <div className="px-4 py-3 rounded-xl" style={{ background: "#F5F5F5" }}>
                    <span className="text-sm" style={{ color: "#bbb" }}>{f.placeholder}</span>
                  </div>
                </div>
              ))}

              <div>
                <label className="text-xs mb-2 block" style={{ color: "#666" }}>性别</label>
                <div className="flex gap-2">
                  {["公", "母"].map((g) => (
                    <button
                      key={g}
                      className="flex-1 py-2.5 rounded-xl text-sm"
                      style={{ background: g === "公" ? "#FF6B35" : "#F5F5F5", color: g === "公" ? "white" : "#666" }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs mb-2 block" style={{ color: "#666" }}>绝育状态</label>
                <div className="flex gap-2">
                  {["已绝育", "未绝育"].map((s) => (
                    <button
                      key={s}
                      className="flex-1 py-2.5 rounded-xl text-sm"
                      style={{ background: s === "已绝育" ? "#E8F5E9" : "#F5F5F5", color: s === "已绝育" ? "#4CAF50" : "#666" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="mt-4 w-full py-3.5 rounded-2xl text-white"
              style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", fontWeight: 600 }}
              onClick={() => setShowAddCat(false)}
            >
              保存档案
            </button>
          </div>
        </div>
      )}

      {/* Edit Cat Sheet */}
      {showEditCat && editForm && (
        <div
          className="absolute inset-0 flex items-end z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowEditCat(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "80%" }}
          >
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base" style={{ color: "#1a1a1a", fontWeight: 700 }}>
                ✏️ 编辑猫咪档案
              </h3>
              <button onClick={() => setShowEditCat(false)}>
                <X size={20} color="#999" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Avatar */}
              <div className="flex justify-center mb-2">
                <label
                  className="relative rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden"
                  style={{ width: "64px", height: "64px", background: "#FFE0CC", fontSize: "36px" }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    style={{ fontSize: 0 }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setEditForm({ ...editForm!, avatarUrl: url });
                      }
                    }}
                  />
                  {editForm.avatarUrl ? (
                    <img
                      src={editForm.avatarUrl}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    cat.avatar
                  )}
                  <div
                    className="absolute inset-0 flex items-end justify-end p-1"
                    style={{ background: "rgba(0,0,0,0)" }}
                  >
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{ width: "20px", height: "20px", background: "#FF6B35", boxShadow: "0 1px 4px rgba(0,0,0,0.25)" }}
                    >
                      <Camera size={11} color="white" />
                    </div>
                  </div>
                </label>
              </div>

              {(
                [
                  { label: "猫咪名字", key: "name" as const, placeholder: "给你的猫咪起个名字" },
                  { label: "品种", key: "breed" as const, placeholder: "例如: 橘猫" },
                  { label: "年龄", key: "age" as const, placeholder: "例如: 3岁" },
                  { label: "体重 (kg)", key: "weight" as const, placeholder: "例如: 4.2kg" },
                ]
              ).map((f) => (
                <div key={f.key}>
                  <label className="text-xs mb-1 block" style={{ color: "#666" }}>{f.label}</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "#F5F5F5", color: "#1a1a1a" }}
                    placeholder={f.placeholder}
                    value={editForm[f.key]}
                    onChange={(e) => setEditForm({ ...editForm, [f.key]: e.target.value })}
                  />
                </div>
              ))}

              <div>
                <label className="text-xs mb-2 block" style={{ color: "#666" }}>性别</label>
                <div className="flex gap-2">
                  {["公", "母"].map((g) => (
                    <button
                      key={g}
                      className="flex-1 py-2.5 rounded-xl text-sm"
                      style={{
                        background: editForm.gender === g ? "#FF6B35" : "#F5F5F5",
                        color: editForm.gender === g ? "white" : "#666",
                        fontWeight: editForm.gender === g ? 600 : 400,
                      }}
                      onClick={() => setEditForm({ ...editForm, gender: g })}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs mb-2 block" style={{ color: "#666" }}>绝育状态</label>
                <div className="flex gap-2">
                  {([{ label: "已绝育", val: true }, { label: "未绝育", val: false }]).map((s) => (
                    <button
                      key={s.label}
                      className="flex-1 py-2.5 rounded-xl text-sm"
                      style={{
                        background: editForm.neutered === s.val ? "#E8F5E9" : "#F5F5F5",
                        color: editForm.neutered === s.val ? "#4CAF50" : "#666",
                        fontWeight: editForm.neutered === s.val ? 600 : 400,
                      }}
                      onClick={() => setEditForm({ ...editForm, neutered: s.val })}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                  ⚠️ 过敏源 / 忌口 <span style={{ color: "#bbb" }}>(用顿号「、」分隔)</span>
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "#FFF0F0", color: "#1a1a1a" }}
                  placeholder="例如: 牛肉、羊肉"
                  value={editForm.allergies}
                  onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                  💊 健康需求 <span style={{ color: "#bbb" }}>(用顿号「、」分隔)</span>
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "#F0F4FF", color: "#1a1a1a" }}
                  placeholder="例如: 护肾、毛球控制"
                  value={editForm.healthNeeds}
                  onChange={(e) => setEditForm({ ...editForm, healthNeeds: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs mb-1 block" style={{ color: "#666" }}>
                  🍖 肉类偏好 <span style={{ color: "#bbb" }}>(用顿号「、」分隔)</span>
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "#FFF8F3", color: "#1a1a1a" }}
                  placeholder="例如: 鸡肉、猪肉"
                  value={editForm.meatPreference}
                  onChange={(e) => setEditForm({ ...editForm, meatPreference: e.target.value })}
                />
              </div>
            </div>

            <button
              className="mt-5 w-full py-3.5 rounded-2xl text-white"
              style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", fontWeight: 600 }}
              onClick={() => setShowEditCat(false)}
            >
              保存修改
            </button>
          </div>
        </div>
      )}
    </div>
  );
}