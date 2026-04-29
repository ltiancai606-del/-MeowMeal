import { Link } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import { MOCK_CATS, MOCK_RECIPES, MOCK_INVENTORY } from '../data/mock';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const activeRecipe = MOCK_RECIPES.find(r => r.isActive);
  
  const normalItems = MOCK_INVENTORY.filter(i => i.status === 'normal');
  const expiringItems = MOCK_INVENTORY.filter(i => i.status === 'expiring');
  const expiredItems = MOCK_INVENTORY.filter(i => i.status === 'expired');

  return (
    <div className="min-h-full bg-transparent flex flex-col">
      {/* Top Section with Orange Background */}
      <div className="bg-[#FF7B4A] pt-12 pb-20 px-5 shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/90 text-sm font-medium mb-1">早上好 👋</p>
            <h1 className="text-2xl font-bold text-white tracking-wide">喵膳 MeowMeal</h1>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-[#ff9e7a]">
            {/* Avatar Placeholder */}
            <div className="w-full h-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-500 font-bold text-xs">主</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Recipe Card overlapping the bottom edge */}
      <div className="px-5 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl p-5 shadow-lg shadow-orange-500/10 border border-stone-50">
          <Link to="/recipes" className="block">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-orange-500 bg-orange-50 p-1.5 rounded-xl">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
                </span>
                <span className="text-sm font-medium text-stone-500">执行中食谱</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>
            
            {activeRecipe ? (
              <>
                <h2 className="text-lg font-bold text-stone-800 mb-4">{activeRecipe.name}</h2>
                
                <div className="flex justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-stone-400 mb-1">已执行</span>
                    <span className="text-lg font-bold text-orange-500">{activeRecipe.executedDays} <span className="text-sm font-normal text-stone-400">天</span></span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-stone-400 mb-1">周期</span>
                    <span className="text-lg font-bold text-stone-800">21 <span className="text-sm font-normal text-stone-400">天</span></span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-stone-400 mb-1">剩余</span>
                    <span className="text-lg font-bold text-stone-800">{21 - activeRecipe.executedDays} <span className="text-sm font-normal text-stone-400">天</span></span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-stone-400">进度</span>
                    <span className="text-orange-500 font-medium">{Math.floor((activeRecipe.executedDays / 21) * 100)}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(activeRecipe.executedDays / 21) * 100}%` }}></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-stone-400 text-sm">
                暂无执行中的食谱
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pt-6 px-5 pb-6 space-y-6 flex-1 bg-transparent">
        
        {/* Inventory Section */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-stone-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold flex items-center gap-2 text-stone-800">
              <span className="bg-blue-50 text-blue-500 p-1.5 rounded-xl">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6M4 6l4-4h8l4 4M10 10v6M14 10v6"></path></svg>
              </span>
              冰箱库存
            </h2>
            <Link to="/inventory" className="text-stone-400 hover:text-stone-600">
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[#FFFAF5] rounded-2xl py-3 flex flex-col items-center">
              <span className="text-xl font-bold text-[#FF7B4A] mb-0.5">{normalItems.length}</span>
              <span className="text-[10px] text-[#FF7B4A]/80 font-medium">正常</span>
            </div>
            <div className="bg-amber-50 rounded-2xl py-3 flex flex-col items-center">
              <span className="text-xl font-bold text-amber-500 mb-0.5">{expiringItems.length}</span>
              <span className="text-[10px] text-amber-600/80 font-medium">临期</span>
            </div>
            <div className="bg-rose-50 rounded-2xl py-3 flex flex-col items-center">
              <span className="text-xl font-bold text-rose-500 mb-0.5">{expiredItems.length}</span>
              <span className="text-[10px] text-rose-600/80 font-medium">已过期</span>
            </div>
          </div>

          {(expiringItems.length > 0 || expiredItems.length > 0) && (
            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 flex items-center gap-2">
              <span className="text-amber-500">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
              </span>
              <p className="text-xs text-amber-600 font-medium">
                有 {expiringItems.length + expiredItems.length} 种食材状态异常, 请及时处理
              </p>
            </div>
          )}
        </section>

        {/* My Pets Section */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-stone-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold flex items-center gap-2 text-stone-800">
              <span className="bg-stone-100 text-stone-500 p-1.5 rounded-xl">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.48C21 17.9 16.97 21 12 21s-9-3.1-9-7.52c0-1.24.43-2.41 1-3.48 0 0-1.82-6.42-.42-7 1.39-.58 4.64.26 6.42 2.26.65-.17 1.33-.26 2-.26z"></path><path d="M9 14v.01"></path><path d="M15 14v.01"></path></svg>
              </span>
              我的猫咪
            </h2>
            <Link to="/profile" className="text-xs text-stone-400 hover:text-stone-600 font-medium flex items-center gap-1">
              <Plus className="w-3 h-3" />
              添加
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
            {MOCK_CATS.map(cat => (
              <div key={cat.id} className="snap-center shrink-0 w-[100px] bg-stone-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-stone-100">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-2 overflow-hidden shadow-sm">
                   {cat.avatarUrl ? (
                    <img src={cat.avatarUrl} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🐱</span>
                  )}
                </div>
                <h3 className="font-bold text-stone-800 mb-0.5">{cat.name}</h3>
                <p className="text-[10px] text-stone-400 mb-1">{cat.weight}kg</p>
                <div className={cn(
                  "text-[9px] px-2 py-0.5 rounded-full font-medium",
                  cat.isNeutered ? "bg-emerald-100 text-emerald-600" : "bg-stone-200 text-stone-500"
                )}>
                  {cat.isNeutered ? '已绝育' : '未绝育'}
                </div>
              </div>
            ))}
            
            <Link to="/profile" className="snap-center shrink-0 w-[100px] rounded-2xl p-3 flex flex-col items-center justify-center border-2 border-dashed border-orange-200 bg-orange-50/50 hover:bg-orange-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-2">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-orange-500">添加猫咪</span>
            </Link>
          </div>
        </section>

        {/* Nutrition Info Cards */}
        <section className="bg-white rounded-3xl shadow-sm border border-stone-50 overflow-hidden">
          <Link to="/nutrition?type=ingredients" className="flex items-center justify-between p-4 bg-white hover:bg-stone-50 transition-colors border-b border-stone-50 group">
            <div className="flex items-center gap-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF7B4A] flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
              </div>
              <div className="z-10">
                <p className="text-sm font-bold text-stone-800">食材营养库</p>
                <p className="text-[10px] text-stone-400 mt-0.5">查看各类肉类、内脏数据</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-[#FF7B4A] group-hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </Link>
          <Link to="/nutrition?type=supplements" className="flex items-center justify-between p-4 bg-white hover:bg-stone-50 transition-colors group">
            <div className="flex items-center gap-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF7B4A] flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3a4 4 0 0 0 4-4V6a2 2 0 0 1 4 0v1.5a2.5 2.5 0 0 0 5 0V6a2 2 0 0 1 4 0v7a1 1 0 0 1-1 1h-3a4 4 0 0 0-4 4v1a2 2 0 0 1-4 0v-1h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-8M7 19h10"></path></svg>
              </div>
              <div className="z-10">
                <p className="text-sm font-bold text-stone-800">营养剂库</p>
                <p className="text-[10px] text-stone-400 mt-0.5">查询常见补剂用量</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-[#FF7B4A] group-hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </Link>
        </section>

      </div>
    </div>
  );
}
