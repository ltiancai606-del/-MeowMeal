import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, ChevronRight, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MEAT_DATABASE, SUPPLEMENTS, MeatNutrient, Supplement } from '../data/mock';

const getAnimalGroup = (name: string) => {
  if (name.includes('猪')) return '猪肉 (Pork)';
  if (name.includes('牛')) return '牛肉 (Beef)';
  if (name.includes('羊')) return '羊肉 (Lamb)';
  if (name.includes('鹿')) return '鹿肉 (Venison)';
  if (name.includes('鸡')) return '鸡肉 (Chicken)';
  if (name.includes('鸭')) return '鸭肉 (Duck)';
  if (name.includes('兔')) return '兔肉 (Rabbit)';
  if (name.includes('鱼') || name.includes('三文鱼') || name.includes('青占鱼') || name.includes('贝')) return '鱼类与海鲜 (Seafood)';
  return '其他 (Other)';
};

const groupOrder = ['猪肉 (Pork)', '牛肉 (Beef)', '羊肉 (Lamb)', '鹿肉 (Venison)', '鸡肉 (Chicken)', '鸭肉 (Duck)', '兔肉 (Rabbit)', '鱼类与海鲜 (Seafood)', '其他 (Other)'];

const MeatDetailModal = ({ meat, onClose }: { meat: MeatNutrient, onClose: () => void }) => {
  const details = [
    { label: '热量', value: `${meat.kcal} kcal` },
    { label: '骨骼含量', value: `0 g` },
    { label: '碳水化合物', value: `${meat.carbohydrate || 0} g` },
    { label: '水份', value: `70 g` },
    { label: '蛋白质', value: `${meat.protein} g` },
    { label: '胆碱', value: `0 mg` },
    { label: '脂肪', value: `${meat.fat} g` },
    { label: '钙', value: `${meat.calcium} mg` },
    { label: '铁', value: `${meat.iron} mg` },
    { label: '磷', value: `${meat.phosphorus} mg` },
    { label: '锌', value: `${meat.zinc} mg` },
    { label: '铜', value: `0.1 mg` },
    { label: '锰', value: `0.02 mg` },
    { label: '碘', value: `0.4 μg` },
    { label: '镁', value: `20 mg` },
    { label: '钾', value: `200 mg` },
    { label: '钠', value: `50 mg` },
    { label: 'VA', value: `0 IU` },
    { label: 'VB1', value: `0.2 mg` },
    { label: 'VD', value: `0 IU` },
    { label: 'VE', value: `0.5 mg` },
    { label: '牛磺酸', value: `${meat.taurine} mg` },
    { label: 'EPA', value: `0 mg` },
    { label: 'DHA', value: `0 mg` },
    { label: 'EPA&DHA', value: `0 mg` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div className="bg-white w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl p-6 pb-8 max-h-[85vh] flex flex-col shadow-xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-xl">
              🥩
            </div>
            <h3 className="text-xl font-bold text-stone-800">{meat.name}</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 pr-2 -mr-2">
          <div className="space-y-0">
            {details.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-stone-100 last:border-0">
                <span className="text-stone-500 text-sm">{item.label}</span>
                <span className="text-stone-800 font-medium text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-stone-100 text-center shrink-0">
          <span className="text-xs text-stone-400 bg-stone-50 px-4 py-2 rounded-full">以上数据按 100g 生肉为计算单位</span>
        </div>
      </div>
    </div>
  );
};

const SuppDetailModal = ({ supp, onClose }: { supp: Supplement, onClose: () => void }) => {
  const details = [
    { label: '钙', value: `${supp.calcium} mg` },
    { label: '镁', value: `${supp.magnesium} mg` },
    { label: '钾', value: `${supp.potassium} mg` },
    { label: '钠', value: `${supp.sodium} mg` },
    { label: '磷', value: `${supp.phosphorus} mg` },
    { label: '碘', value: `${supp.iodine} μg` },
    { label: 'VD', value: `${supp.vd} IU` },
    { label: 'VA', value: `${supp.va} IU` },
    { label: 'VE', value: `${supp.ve} mg` },
    { label: 'VB1', value: `${supp.vb1} mg` },
    ...(supp.vb2 !== undefined ? [{ label: 'VB2 (核黄素)', value: `${supp.vb2} mg` }] : []),
    ...(supp.vb3 !== undefined ? [{ label: 'VB3 (烟酸)', value: `${supp.vb3} mg` }] : []),
    ...(supp.vb5 !== undefined ? [{ label: 'VB5 (泛酸)', value: `${supp.vb5} mg` }] : []),
    ...(supp.vb6 !== undefined ? [{ label: 'VB6 (吡哆醇)', value: `${supp.vb6} mg` }] : []),
    ...(supp.vb7 !== undefined ? [{ label: 'VB7 (生物素)', value: `${supp.vb7} μg` }] : []),
    ...(supp.vb9 !== undefined ? [{ label: 'VB9 (叶酸)', value: `${supp.vb9} μg` }] : []),
    ...(supp.vb12 !== undefined ? [{ label: 'VB12', value: `${supp.vb12} μg` }] : []),
    ...(supp.choline !== undefined ? [{ label: '胆碱', value: `${supp.choline} mg` }] : []),
    ...(supp.inositol !== undefined ? [{ label: '肌醇', value: `${supp.inositol} mg` }] : []),
    ...(supp.paba !== undefined ? [{ label: 'PABA', value: `${supp.paba} mg` }] : []),
    { label: '锰', value: `${supp.manganese} mg` },
    { label: '牛磺酸', value: `${supp.taurine} mg` },
    { label: '铁', value: `${supp.iron} mg` },
    { label: '锌', value: `${supp.zinc} mg` },
    { label: '铜', value: `${supp.copper} mg` },
    { label: 'EPA&DHA', value: `${supp.epa_dha} mg` },
    { label: 'EPA', value: `${supp.epa} mg` },
    { label: 'DHA', value: `${supp.dha} mg` },
    ...(supp.sodium_alginate !== undefined ? [{ label: '海藻酸钠', value: `${supp.sodium_alginate} mg` }] : []),
  ].filter(item => item.value !== '0 mg' && item.value !== '0 μg' && item.value !== '0 IU');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div className="bg-white w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl p-6 pb-8 max-h-[85vh] flex flex-col shadow-xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div className="flex items-center gap-3">
            {supp.imageUrl ? (
              <img src={supp.imageUrl} alt={supp.name} className="w-10 h-10 rounded-full object-cover border border-stone-100/50" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-xl">
                {supp.type === 'fish_oil' ? '🐟' : supp.type === 'vitamin_e' ? '✨' : supp.type === 'vitamin_b' ? '⚡' : supp.type === 'calcium' ? '🦴' : supp.type === 'taurine' ? '🐂' : supp.type === 'iodine' ? '🧂' : '💊'}
              </div>
            )}
            <h3 className="text-xl font-bold text-stone-800">{supp.name}</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 pr-2 -mr-2">
          <div className="space-y-0">
            {details.length > 0 ? details.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-stone-100 last:border-0">
                <span className="text-stone-500 text-sm">{item.label}</span>
                <span className="text-stone-800 font-medium text-sm">{item.value}</span>
              </div>
            )) : (
              <div className="py-8 text-center text-stone-400 text-sm">暂无详细营养数据</div>
            )}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-stone-100 text-center shrink-0">
          <span className="text-xs text-stone-400 bg-stone-50 px-4 py-2 rounded-full">以上数据以每 {supp.unit} 为计算单位</span>
        </div>
      </div>
    </div>
  );
};

export default function Nutrition() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') === 'supplements' ? 'supplements' : 'ingredients';

  const [activeTab, setActiveTab] = useState<'ingredients' | 'supplements'>(initialType);
  const [selectedMeat, setSelectedMeat] = useState<MeatNutrient | null>(null);
  const [selectedSupp, setSelectedSupp] = useState<Supplement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSuppCategory, setActiveSuppCategory] = useState('all');
  const [activeSidebarGroup, setActiveSidebarGroup] = useState<string>('');

  useEffect(() => {
    setActiveTab(initialType);
  }, [initialType]);

  const categories = [
    { id: 'all', name: '常用', icon: '🥩' },
    { id: 'custom', name: '自定义', icon: '🧩' },
    { id: 'white_meat', name: '白肉', icon: '🍗' },
    { id: 'red_meat', name: '红肉', icon: '🥩' },
    { id: 'heart', name: '肌肉组织', icon: '❤️' },
    { id: 'fish', name: '鱼类', icon: '🐟' },
    { id: 'other', name: '其他', icon: '🍖' },
  ];

  const suppCategories = [
    { id: 'all', name: '全部', icon: '💊' },
    { id: 'fish_oil', name: '鱼油', icon: '🐟' },
    { id: 'vitamin_e', name: 'VE', icon: '✨' },
    { id: 'vitamin_b', name: 'VB', icon: '⚡' },
    { id: 'calcium', name: '钙', icon: '🦴' },
    { id: 'taurine', name: '牛磺酸', icon: '🐂' },
    { id: 'iodine', name: '碘', icon: '🧂' },
  ];

  const filteredMeats = MEAT_DATABASE.filter(meat => {
    const matchesSearch = meat.name.includes(searchQuery);
    const matchesCategory = activeCategory === 'all' || 
                            (activeCategory === 'custom' && false) || // Mock custom logic
                            (activeCategory === 'other' && ['liver', 'other_organ', 'mussel'].includes(meat.category)) ||
                            meat.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedMeats = filteredMeats.reduce((acc, meat) => {
    const group = getAnimalGroup(meat.name);
    if (!acc[group]) acc[group] = [];
    acc[group].push(meat);
    return acc;
  }, {} as Record<string, MeatNutrient[]>);

  const sortedGroups = Object.entries(groupedMeats).sort(([a], [b]) => {
    const indexA = groupOrder.indexOf(a);
    const indexB = groupOrder.indexOf(b);
    return (indexA !== -1 ? indexA : 99) - (indexB !== -1 ? indexB : 99);
  });

  useEffect(() => {
    if (activeTab !== 'ingredients' || sortedGroups.length === 0) return;
    
    const container = document.querySelector('main');
    if (!container) return;

    const handleScroll = () => {
      let currentGroup = sortedGroups[0][0];
      for (const [groupName] of sortedGroups) {
        const anchor = document.getElementById(`group-anchor-${groupName}`);
        if (anchor) {
          const rect = anchor.getBoundingClientRect();
          if (rect.top <= 260) {
            currentGroup = groupName;
          }
        }
      }
      setActiveSidebarGroup(prev => prev !== currentGroup ? currentGroup : prev);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // init

    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeTab, sortedGroups]);

  const filteredSupps = SUPPLEMENTS.filter(supp => {
    const matchesSearch = supp.name.includes(searchQuery);
    const matchesCategory = activeSuppCategory === 'all' || supp.type === activeSuppCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToGroup = (groupName: string) => {
    setActiveSidebarGroup(groupName);
    const anchor = document.getElementById(`group-anchor-${groupName}`);
    const container = document.querySelector('main');
    if (anchor && container) {
      const containerTop = container.getBoundingClientRect().top;
      const anchorTop = anchor.getBoundingClientRect().top;
      const targetY = container.scrollTop + (anchorTop - containerTop) - 200;
      container.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-24">
      <header className="px-4 h-14 flex items-center justify-between bg-white sticky top-0 z-30 shadow-sm shrink-0">
        <Link to="/" className="text-stone-800 hover:text-stone-600 p-1">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-stone-900 absolute left-1/2 -translate-x-1/2">
          {activeTab === 'ingredients' ? '食材数据' : '营养剂数据'}
        </h1>
        <div className="w-8"></div> {/* Spacer for centering */}
      </header>

      <div className="sticky top-14 z-20 bg-stone-50/95 backdrop-blur-md pt-4 px-4 pb-2 border-b border-stone-200/50 shadow-sm shrink-0">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input 
            type="text" 
            placeholder={activeTab === 'ingredients' ? "搜索食材" : "搜索营养剂"}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-stone-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
          />
        </div>

        {activeTab === 'ingredients' && (
          <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide px-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center min-w-[48px] gap-2 relative shrink-0`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${activeCategory === cat.id ? 'bg-cyan-500 text-white shadow-md' : 'bg-white text-stone-600 shadow-sm border border-stone-100'}`}>
                  {cat.icon}
                </div>
                <span className={`text-xs ${activeCategory === cat.id ? 'text-cyan-600 font-medium' : 'text-stone-500'}`}>{cat.name}</span>
                {activeCategory === cat.id && (
                  <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                )}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'supplements' && (
          <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide px-2">
            {suppCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveSuppCategory(cat.id)}
                className={`flex flex-col items-center min-w-[48px] gap-2 relative shrink-0`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${activeSuppCategory === cat.id ? 'bg-cyan-500 text-white shadow-md' : 'bg-white text-stone-600 shadow-sm border border-stone-100'}`}>
                  {cat.icon}
                </div>
                <span className={`text-xs ${activeSuppCategory === cat.id ? 'text-cyan-600 font-medium' : 'text-stone-500'}`}>{cat.name}</span>
                {activeSuppCategory === cat.id && (
                  <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        {activeTab === 'supplements' && (
          <div className="flex justify-center mb-6 mt-2">
            <button className="text-cyan-600 text-sm font-medium flex items-center gap-1 hover:text-cyan-700 bg-cyan-50 px-4 py-2 rounded-full">
              + 添加自定义营养剂
            </button>
          </div>
        )}

        <div className="relative pb-6">
          {activeTab === 'ingredients' ? (
            sortedGroups.length > 0 ? (
              <div className="flex items-start gap-3">
                {/* 侧边栏 */}
                <div className="sticky top-[200px] w-14 shrink-0 flex flex-col gap-1 z-10 max-h-[calc(100vh-240px)] overflow-y-auto scrollbar-hide">
                  {sortedGroups.map(([groupName]) => (
                    <button
                      key={`sidebar-${groupName}`}
                      onClick={() => scrollToGroup(groupName)}
                      className={`text-center px-1 py-2 text-xs font-medium rounded-xl transition-colors shrink-0 ${
                        activeSidebarGroup === groupName 
                          ? 'bg-white text-cyan-600 shadow-sm border border-stone-100' 
                          : 'text-stone-500 hover:bg-stone-100'
                      }`}
                    >
                      {groupName.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* 列表内容 */}
                <div className="flex-1 min-w-0 space-y-6">
                  {sortedGroups.map(([groupName, meats]) => (
                    <div key={groupName} id={`group-anchor-${groupName}`} className="scroll-mt-[200px]">
                      <h3 className="text-sm font-bold text-stone-800 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-cyan-500 rounded-full"></div>
                        {groupName}
                      </h3>
                      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100/50">
                        {meats.map((meat, idx) => (
                          <div 
                            key={meat.id} 
                            onClick={() => setSelectedMeat(meat)}
                            className={`flex justify-between items-center p-4 cursor-pointer hover:bg-stone-50 transition-colors ${idx !== meats.length - 1 ? 'border-b border-stone-50' : ''}`}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                              <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-xl border border-stone-100/50 shrink-0">
                                {categories.find(c => c.id === meat.category)?.icon || '🥩'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-stone-800 text-base truncate">{meat.name}</div>
                                <div className="text-xs text-stone-400 mt-0.5">{meat.kcal} kcal / 100g</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md whitespace-nowrap">详情</span>
                              <ChevronRight className="w-4 h-4 text-stone-300" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-stone-500">没有找到匹配的食材</div>
            )
          ) : (
            filteredSupps.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100/50">
                {filteredSupps.map((supp, idx) => (
                  <div 
                    key={supp.id} 
                    onClick={() => setSelectedSupp(supp)}
                    className={`flex justify-between items-center p-4 cursor-pointer hover:bg-stone-50 transition-colors ${idx !== filteredSupps.length - 1 ? 'border-b border-stone-50' : ''}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                      {supp.imageUrl ? (
                        <img src={supp.imageUrl} alt={supp.name} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-stone-100/50" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-xl border border-stone-100/50 shrink-0">
                          {suppCategories.find(c => c.id === supp.type)?.icon || '💊'}
                        </div>
                      )}
                      <span className="font-bold text-stone-800 text-base truncate">{supp.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md whitespace-nowrap">详情</span>
                      <ChevronRight className="w-4 h-4 text-stone-300" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-stone-500">没有找到匹配的营养剂</div>
            )
          )}
        </div>
      </div>

      {selectedMeat && <MeatDetailModal meat={selectedMeat} onClose={() => setSelectedMeat(null)} />}
      {selectedSupp && <SuppDetailModal supp={selectedSupp} onClose={() => setSelectedSupp(null)} />}
    </div>
  );
}
