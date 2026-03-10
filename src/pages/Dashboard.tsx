import { Link } from 'react-router-dom';
import { ChevronRight, AlertCircle, Plus, Activity, Wallet, Info } from 'lucide-react';
import { MOCK_CATS, MOCK_RECIPES, MOCK_INVENTORY } from '../data/mock';

export default function Dashboard() {
  const activeRecipe = MOCK_RECIPES.find(r => r.isActive);
  const expiringItems = MOCK_INVENTORY.filter(i => i.status === 'expiring' || i.status === 'expired');

  return (
    <div className="p-4 space-y-4 bg-stone-50 min-h-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">喵膳 MeowMeal</h1>
        <p className="text-sm text-stone-500">科学自制食谱管家</p>
      </header>

      {/* Active Recipe Card */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            执行中食谱
          </h2>
          <Link to="/recipes" className="text-stone-400 hover:text-stone-600">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        {activeRecipe ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-stone-800">{activeRecipe.name}</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                已执行 {activeRecipe.executedDays} 天
              </span>
            </div>
            <p className="text-xs text-stone-500">
              包含 {activeRecipe.ingredients.length} 种食材, {activeRecipe.supplements.length} 种补剂
            </p>
          </div>
        ) : (
          <div className="text-center py-4 text-stone-400 text-sm">
            暂无执行中的食谱
          </div>
        )}
      </section>

      {/* Inventory Card */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            冰箱提醒
          </h2>
          <Link to="/inventory" className="text-stone-400 hover:text-stone-600">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        {expiringItems.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-stone-600">
              有 <span className="font-bold text-amber-600">{expiringItems.length}</span> 份食材即将过期或已过期
            </p>
          </div>
        ) : (
          <div className="text-center py-4 text-stone-400 text-sm">
            冰箱状态良好
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-4">
        {/* Pets Card */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold">我的猫咪</h2>
            <Link to="/profile" className="text-stone-400 hover:text-stone-600">
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex -space-x-2 overflow-hidden">
            {MOCK_CATS.map(cat => (
              cat.avatarUrl ? (
                <img
                  key={cat.id}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src={cat.avatarUrl}
                  alt={cat.name}
                />
              ) : (
                <div key={cat.id} className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  {cat.name.substring(0, 2).toUpperCase()}
                </div>
              )
            ))}
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white bg-stone-100 text-stone-400">
              <Plus className="w-4 h-4" />
            </div>
          </div>
        </section>

        {/* Bills Card */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-1">
              <Wallet className="w-4 h-4 text-blue-500" />
              账单
            </h2>
          </div>
          <p className="text-2xl font-bold text-stone-800">
            <span className="text-sm font-normal text-stone-500">¥</span> 0.00
          </p>
          <p className="text-[10px] text-stone-400 mt-1">本月累计花费</p>
        </section>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Ingredients Info Card */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-1">
              <span className="text-xl">🥩</span>
              食材库
            </h2>
            <Link to="/nutrition?type=ingredients" className="text-stone-400 hover:text-stone-600">
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-[10px] text-stone-500 mt-1">
            查看肉类、内脏等详细营养数据
          </p>
        </section>

        {/* Supplements Info Card */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-1">
              <span className="text-xl">💊</span>
              营养剂库
            </h2>
            <Link to="/nutrition?type=supplements" className="text-stone-400 hover:text-stone-600">
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-[10px] text-stone-500 mt-1">
            查看钙粉、鱼油等补剂数据
          </p>
        </section>
      </div>
    </div>
  );
}
