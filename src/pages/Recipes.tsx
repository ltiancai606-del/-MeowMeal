import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Activity, PieChart, Info, Settings, Save, BookOpen, Edit2, Copy, Trash2, MoreVertical, Check, X, RefreshCw, Search } from 'lucide-react';
import { MOCK_RECIPES, MOCK_CATS, MEAT_DATABASE, SUPPLEMENTS, Recipe, saveRecipes } from '../data/mock';
import { FULL_NUTRITION_STANDARDS } from '../data/standards';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const formatSafeDate = (dateStr: string | undefined) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '未知时间';
    return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '未知时间';
  }
};

const NUTRITION_STANDARDS = {
  NRC: {
    protein: { min: 50, max: null, label: '蛋白质', unit: 'g' },
    fat: { min: 22.5, max: null, label: '脂肪', unit: 'g' },
    calcium: { min: 0.72, max: null, label: '钙', unit: 'g' },
    phosphorus: { min: 0.64, max: null, label: '磷', unit: 'g' },
    ca_p_ratio: { min: 1.1, max: 1.5, label: '钙磷比', unit: '' },
    iron: { min: 20, max: null, label: '铁', unit: 'mg' },
    zinc: { min: 18.7, max: null, label: '锌', unit: 'mg' },
    taurine: { min: 100, max: null, label: '牛磺酸', unit: 'mg' },
    iodine: { min: 350, max: null, label: '碘', unit: 'μg' },
  },
  AAFCO: {
    protein: { min: 65, max: null, label: '蛋白质', unit: 'g' },
    fat: { min: 22.5, max: null, label: '脂肪', unit: 'g' },
    calcium: { min: 1.5, max: 6.25, label: '钙', unit: 'g' },
    phosphorus: { min: 1.25, max: 4.0, label: '磷', unit: 'g' },
    ca_p_ratio: { min: 1, max: 2, label: '钙磷比', unit: '' },
    iron: { min: 20, max: null, label: '铁', unit: 'mg' },
    zinc: { min: 18.7, max: null, label: '锌', unit: 'mg' },
    taurine: { min: 500, max: null, label: '牛磺酸', unit: 'mg' },
    iodine: { min: 450, max: 2250, label: '碘', unit: 'μg' },
  }
};

const calculateSupplements = (
  ingredients: { meatId: string, weight: number }[],
  standard: 'NRC' | 'AAFCO',
  existingSupplements: { supplementId: string, amount: number | string }[] = []
) => {
  let ingKcal = 0;
  let ingCalcium = 0;
  let ingPhosphorus = 0;
  let ingIron = 0;
  let ingZinc = 0;
  let ingTaurine = 0;
  let ingIodine = 0;
  
  ingredients.forEach(item => {
    const meat = MEAT_DATABASE.find(m => m.id === item.meatId);
    if (meat) {
      ingKcal += (meat.kcal / 100) * item.weight;
      ingCalcium += (meat.calcium / 100) * item.weight;
      ingPhosphorus += (meat.phosphorus / 100) * item.weight;
      ingIron += (meat.iron / 100) * item.weight;
      ingZinc += (meat.zinc / 100) * item.weight;
      ingTaurine += (meat.taurine / 100) * item.weight;
      ingIodine += ((meat.iodine || 0) / 100) * item.weight;
    }
  });

  const multiplier = ingKcal > 0 ? 1000 / ingKcal : 0;
  const standardData = NUTRITION_STANDARDS[standard];
  
  const newSupplements: { supplementId: string, amount: number }[] = [];
  
  const getSuppOfType = (type: string) => {
    const existing = existingSupplements.find(s => {
      const supp = SUPPLEMENTS.find(sup => sup.id === s.supplementId);
      return supp?.type === type;
    });
    if (existing) {
      return SUPPLEMENTS.find(sup => sup.id === existing.supplementId);
    }
    return SUPPLEMENTS.find(sup => sup.type === type);
  };

  const addOrUpdateSupp = (type: string, deficit: number, nutrientKey: keyof typeof SUPPLEMENTS[0]) => {
    if (deficit <= 0) return;
    const supp = getSuppOfType(type);
    if (supp) {
      const amountPerUnit = supp[nutrientKey] as number;
      if (amountPerUnit > 0) {
        let amount = deficit / amountPerUnit;
        if (supp.unit !== 'g') {
          amount = Number((Math.ceil(Number(amount.toFixed(4)) * 10) / 10).toFixed(1));
        } else {
          amount = Number(amount.toFixed(2));
        }
        if (amount > 0) {
          newSupplements.push({ supplementId: supp.id, amount });
        }
      }
    }
  };

  // 1. Calcium (Target Ca:P ratio = 1.2)
  const targetCalcium = ingPhosphorus * 1.2;
  if (targetCalcium > ingCalcium) {
    const deficitCa = targetCalcium - ingCalcium;
    addOrUpdateSupp('calcium', deficitCa, 'calcium');
  }

  // 2. Iron
  const currentIronPer1000 = ingIron * multiplier;
  if (standardData.iron && standardData.iron.min !== null && currentIronPer1000 < standardData.iron.min) {
    const deficitIronPer1000 = standardData.iron.min - currentIronPer1000;
    const deficitIron = deficitIronPer1000 / multiplier;
    addOrUpdateSupp('iron', deficitIron, 'iron');
  }

  // 3. Zinc
  const currentZincPer1000 = ingZinc * multiplier;
  if (standardData.zinc && standardData.zinc.min !== null && currentZincPer1000 < standardData.zinc.min) {
    const deficitZincPer1000 = standardData.zinc.min - currentZincPer1000;
    const deficitZinc = deficitZincPer1000 / multiplier;
    addOrUpdateSupp('zinc', deficitZinc, 'zinc');
  }

  // 4. Taurine
  const currentTaurinePer1000 = ingTaurine * multiplier;
  if (standardData.taurine && standardData.taurine.min !== null && currentTaurinePer1000 < standardData.taurine.min) {
    const deficitTaurinePer1000 = standardData.taurine.min - currentTaurinePer1000;
    const deficitTaurine = deficitTaurinePer1000 / multiplier;
    addOrUpdateSupp('taurine', deficitTaurine, 'taurine');
  }

  // 5. Iodine
  const currentIodinePer1000 = ingIodine * multiplier;
  if (standardData.iodine && standardData.iodine.min !== null && currentIodinePer1000 < standardData.iodine.min) {
    const deficitIodinePer1000 = standardData.iodine.min - currentIodinePer1000;
    const deficitIodine = deficitIodinePer1000 / multiplier;
    addOrUpdateSupp('iodine', deficitIodine, 'iodine');
  }
  
  const addDefaultSupp = (type: string, amountPer1000Kcal: number) => {
    const supp = getSuppOfType(type);
    if (supp) {
      let amount = amountPer1000Kcal / multiplier;
      if (supp.unit !== 'g') {
        amount = Number((Math.ceil(Number(amount.toFixed(4)) * 10) / 10).toFixed(1));
      } else {
        amount = Number(amount.toFixed(2));
      }
      if (amount > 0) {
        newSupplements.push({ supplementId: supp.id, amount });
      }
    }
  };

  addDefaultSupp('fish_oil', 1);
  addDefaultSupp('vitamin_e', 0.5);
  addDefaultSupp('vitamin_b', 0.5);

  const coveredTypes = ['calcium', 'iron', 'zinc', 'taurine', 'fish_oil', 'vitamin_e', 'vitamin_b', 'iodine'];
  existingSupplements.forEach(s => {
    const supp = SUPPLEMENTS.find(sup => sup.id === s.supplementId);
    if (supp && !coveredTypes.includes(supp.type)) {
      if (!newSupplements.find(ns => ns.supplementId === s.supplementId)) {
        newSupplements.push({
          supplementId: s.supplementId,
          amount: typeof s.amount === 'string' ? (parseFloat(s.amount) || 0) : s.amount
        });
      }
    }
  });

  return newSupplements;
};

function RecipeList() {
  return (
    <div className="p-4 space-y-4 bg-stone-50 min-h-full">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-stone-900">食谱管理</h1>
        <Link to="/recipes/create" className="bg-emerald-600 text-white p-2 rounded-full shadow-sm hover:bg-emerald-700">
          <Plus className="w-5 h-5" />
        </Link>
      </header>

      {MOCK_RECIPES.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <BookOpen className="w-16 h-16 mb-4 text-stone-200" />
          <p className="text-stone-500 font-medium mb-1">暂无食谱</p>
          <p className="text-sm mb-6">为你的猫咪定制第一份健康食谱吧</p>
          <Link to="/recipes/create" className="bg-emerald-600 text-white px-6 py-2 rounded-full shadow-sm hover:bg-emerald-700 font-medium">
            去定制
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {[...MOCK_RECIPES].reverse().map(recipe => {
            const cats = recipe.catIds.map(id => MOCK_CATS.find(c => c.id === id)?.name).join(', ');
            return (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                className="block bg-white rounded-2xl p-4 shadow-sm border border-stone-100 hover:border-emerald-200 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-stone-800">{recipe.name}</h2>
                  {recipe.isActive && (
                    <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      <Activity className="w-3 h-3" />
                      执行中
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-500 mb-4">适用猫咪: {cats}</p>
                
                {(recipe.startDate || recipe.endDate) && (
                  <div className="text-xs text-stone-500 mb-4 bg-stone-50 p-2 rounded-lg space-y-1">
                    {recipe.startDate && <p>开始执行: {formatSafeDate(recipe.startDate)}</p>}
                    {recipe.endDate && <p>结束执行: {formatSafeDate(recipe.endDate)}</p>}
                  </div>
                )}
                
                <div className="flex justify-between items-center text-xs text-stone-400">
                  <span>{recipe.standard} 标准 · {recipe.mode === 'by_need' ? '按需定制' : '按库存反推'}</span>
                  <span className="flex items-center gap-1">
                    查看详情 <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CreateOrEditRecipe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const existingRecipe = isEditing ? MOCK_RECIPES.find(r => r.id === id) : null;

  const [name, setName] = useState(existingRecipe?.name || '');
  const [selectedCats, setSelectedCats] = useState<string[]>(existingRecipe?.catIds || []);
  const [standard, setStandard] = useState<'NRC' | 'AAFCO'>(existingRecipe?.standard || 'NRC');
  const [mode, setMode] = useState<'by_need' | 'by_inventory'>(existingRecipe?.mode || 'by_need');
  const [error, setError] = useState('');
  
  // Calculate daily amount and days from existing recipe if editing
  const initialDays = existingRecipe?.days?.toString() || '7';
  let initialDailyAmount = '150';
  if (existingRecipe) {
    const totalWeight = existingRecipe.ingredients.reduce((sum, item) => sum + item.weight, 0);
    initialDailyAmount = Math.round(totalWeight / existingRecipe.days).toString();
  }
  
  const [dailyAmount, setDailyAmount] = useState(initialDailyAmount);
  const [days, setDays] = useState(initialDays);

  const handleToggleCat = (catId: string) => {
    setSelectedCats(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleSave = () => {
    setError('');
    if (!name.trim()) {
      setError('请输入食谱名称');
      return;
    }
    if (selectedCats.length === 0) {
      setError('请至少选择一只猫咪');
      return;
    }

    const totalDays = parseInt(days) || 7;
    const daily = parseInt(dailyAmount) || 150;
    const totalWeight = totalDays * daily;

    const defaultIngredients = [
      { meatId: 'm3', weight: Math.round(totalWeight * 0.5) }, // 鸡胸肉 50%
      { meatId: 'm1', weight: Math.round(totalWeight * 0.2) }, // 猪里脊 20%
      { meatId: 'm5', weight: Math.round(totalWeight * 0.1) }, // 三文鱼 10%
      { meatId: 'm6', weight: Math.round(totalWeight * 0.05) }, // 鸡肝 5%
      { meatId: 'm9', weight: Math.round(totalWeight * 0.05) }, // 猪腰 5%
      { meatId: 'm10', weight: Math.round(totalWeight * 0.05) }, // 青口贝 5%
      { meatId: 'm7', weight: Math.round(totalWeight * 0.05) }, // 猪心 5%
    ];

    const finalIngredients = existingRecipe?.ingredients || defaultIngredients;
    const finalSupplements = existingRecipe?.supplements || calculateSupplements(finalIngredients, standard as 'NRC' | 'AAFCO');

    const recipeData: Recipe = {
      id: isEditing ? existingRecipe!.id : `r${Date.now()}`,
      name: name.trim(),
      catIds: selectedCats,
      standard,
      mode,
      days: totalDays,
      ingredients: finalIngredients,
      supplements: finalSupplements as any,
      createdAt: existingRecipe?.createdAt || new Date().toISOString().split('T')[0],
      isActive: existingRecipe ? existingRecipe.isActive : false,
      executedDays: existingRecipe ? existingRecipe.executedDays : 0,
      startDate: existingRecipe?.startDate,
      endDate: existingRecipe?.endDate,
    };

    if (isEditing) {
      const index = MOCK_RECIPES.findIndex(r => r.id === id);
      if (index > -1) {
        MOCK_RECIPES[index] = recipeData;
      }
    } else {
      MOCK_RECIPES.push(recipeData);
    }
    
    saveRecipes();
    navigate(`/recipes/${recipeData.id}`);
  };

  return (
    <div className="p-4 space-y-4 bg-stone-50 min-h-full pb-24">
      <header className="mb-6 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-stone-500 hover:text-stone-700">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-2xl font-bold text-stone-900">{isEditing ? '编辑食谱' : '定制新食谱'}</h1>
      </header>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">食谱名称 <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="例如: Mimi的减脂餐" 
            className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">目标猫咪 (可多选) <span className="text-red-500">*</span></label>
          {MOCK_CATS.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {MOCK_CATS.map(cat => (
                <label key={cat.id} className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer transition-colors ${selectedCats.includes(cat.id) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-200 hover:bg-stone-50'}`}>
                  <input 
                    type="checkbox" 
                    checked={selectedCats.includes(cat.id)}
                    onChange={() => handleToggleCat(cat.id)}
                    className="hidden" 
                  />
                  <span className="text-sm font-medium">{cat.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-sm text-stone-500 bg-stone-50 p-3 rounded-xl">
              暂无猫咪档案，<Link to="/profile/cats/new" className="text-emerald-600 font-medium">去添加</Link>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">营养标准</label>
          <div className="flex gap-2">
            <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-xl cursor-pointer transition-colors ${standard === 'NRC' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-200 hover:bg-stone-50'}`}>
              <input type="radio" name="standard" value="NRC" checked={standard === 'NRC'} onChange={() => setStandard('NRC')} className="hidden" />
              <span className="text-sm font-medium">NRC</span>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-xl cursor-pointer transition-colors ${standard === 'AAFCO' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-200 hover:bg-stone-50'}`}>
              <input type="radio" name="standard" value="AAFCO" checked={standard === 'AAFCO'} onChange={() => setStandard('AAFCO')} className="hidden" />
              <span className="text-sm font-medium">AAFCO</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">生成模式</label>
          <div className="space-y-2">
            <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${mode === 'by_need' ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 hover:bg-stone-50'}`}>
              <input type="radio" name="mode" value="by_need" checked={mode === 'by_need'} onChange={() => setMode('by_need')} className="text-emerald-600 focus:ring-emerald-500" />
              <div>
                <p className={`text-sm font-medium ${mode === 'by_need' ? 'text-emerald-900' : 'text-stone-900'}`}>按需定总量</p>
                <p className={`text-xs mt-0.5 ${mode === 'by_need' ? 'text-emerald-700' : 'text-stone-500'}`}>输入每日喂食量和天数，自动计算总需求</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${mode === 'by_inventory' ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 hover:bg-stone-50'}`}>
              <input type="radio" name="mode" value="by_inventory" checked={mode === 'by_inventory'} onChange={() => setMode('by_inventory')} className="text-emerald-600 focus:ring-emerald-500" />
              <div>
                <p className={`text-sm font-medium ${mode === 'by_inventory' ? 'text-emerald-900' : 'text-stone-900'}`}>按库存反推</p>
                <p className={`text-xs mt-0.5 ${mode === 'by_inventory' ? 'text-emerald-700' : 'text-stone-500'}`}>优先消耗冰箱临期食材生成食谱</p>
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">每日喂食量 (g)</label>
            <input 
              type="number" 
              value={dailyAmount}
              onChange={e => setDailyAmount(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">制作天数</label>
            <input 
              type="number" 
              value={days}
              onChange={e => setDays(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>
        </div>

        <button onClick={handleSave} className="w-full mt-6 bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
          <Save className="w-5 h-5" />
          保存食谱
        </button>
      </div>
    </div>
  );
}

const MacroTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 shadow-lg border border-stone-100 rounded-lg text-xs z-50">
        <p className="font-bold text-stone-800 mb-1">{data.name}</p>
        <p className="text-stone-600">重量: {Number(data.value || 0).toFixed(1)}g</p>
        <p className="text-stone-600">ME占比: {Number(data.me || 0).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const IngredientTooltip = ({ active, payload, totalWeight }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = totalWeight > 0 ? (data.value / totalWeight) * 100 : 0;
    return (
      <div className="bg-white p-2 shadow-lg border border-stone-100 rounded-lg text-xs z-50">
        <p className="font-bold text-stone-800 mb-1">{data.name}</p>
        <p className="text-stone-600">重量: {Number(data.value || 0).toFixed(1)}g</p>
        <p className="text-stone-600">占比: {percentage.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [, setForceRender] = useState(0);
  const recipe = MOCK_RECIPES.find(r => r.id === id);

  const [showSettings, setShowSettings] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFullNutritionModal, setShowFullNutritionModal] = useState(false);
  const [copyName, setCopyName] = useState('');

  const [isEditingRecipe, setIsEditingRecipe] = useState(false);
  const [editedIngredients, setEditedIngredients] = useState<{meatId: string, weight: number | string}[]>([]);
  const [showIngredientPicker, setShowIngredientPicker] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [pickerSelectedIds, setPickerSelectedIds] = useState<string[]>([]);
  const [pickerCategoryFilter, setPickerCategoryFilter] = useState<string>('all');

  const [pickerSearchQuery, setPickerSearchQuery] = useState('');
  const [pickerActiveSidebarGroup, setPickerActiveSidebarGroup] = useState<string>('');

  const [editedSupplements, setEditedSupplements] = useState<{supplementId: string, amount: number | string}[]>([]);
  const [showSupplementPicker, setShowSupplementPicker] = useState(false);
  const [replacingSupplementIndex, setReplacingSupplementIndex] = useState<number | null>(null);
  const [pickerSelectedSupplementIds, setPickerSelectedSupplementIds] = useState<string[]>([]);
  const [pickerSupplementSearchQuery, setPickerSupplementSearchQuery] = useState('');

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

  const filteredPickerMeats = MEAT_DATABASE.filter(m => {
    const matchesSearch = m.name.includes(pickerSearchQuery);
    const matchesCategory = pickerCategoryFilter === 'all' || 
                            (pickerCategoryFilter === 'other_offal' && !['red_meat', 'white_meat', 'fish', 'liver', 'heart', 'mussel'].includes(m.category)) ||
                            m.category === pickerCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const groupedPickerMeats = filteredPickerMeats.reduce((acc, meat) => {
    const group = getAnimalGroup(meat.name);
    if (!acc[group]) acc[group] = [];
    acc[group].push(meat);
    return acc;
  }, {} as Record<string, typeof MEAT_DATABASE>);

  const sortedPickerGroups = Object.entries(groupedPickerMeats).sort(([a], [b]) => {
    const indexA = groupOrder.indexOf(a);
    const indexB = groupOrder.indexOf(b);
    return (indexA !== -1 ? indexA : 99) - (indexB !== -1 ? indexB : 99);
  });

  useEffect(() => {
    if (!showIngredientPicker || sortedPickerGroups.length === 0) return;
    
    const container = document.getElementById('picker-scroll-container');
    if (!container) return;

    const handleScroll = () => {
      let currentGroup = sortedPickerGroups[0][0];
      for (const [groupName] of sortedPickerGroups) {
        const anchor = document.getElementById(`picker-group-anchor-${groupName}`);
        if (anchor) {
          const rect = anchor.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          if (rect.top - containerRect.top <= 60) {
            currentGroup = groupName;
          }
        }
      }
      setPickerActiveSidebarGroup(prev => prev !== currentGroup ? currentGroup : prev);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // init

    return () => container.removeEventListener('scroll', handleScroll);
  }, [showIngredientPicker, sortedPickerGroups]);

  const scrollToPickerGroup = (groupName: string) => {
    setPickerActiveSidebarGroup(groupName);
    const anchor = document.getElementById(`picker-group-anchor-${groupName}`);
    const container = document.getElementById('picker-scroll-container');
    if (anchor && container) {
      const containerTop = container.getBoundingClientRect().top;
      const anchorTop = anchor.getBoundingClientRect().top;
      const targetY = container.scrollTop + (anchorTop - containerTop) - 20;
      container.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  if (!recipe) return <div>Not found</div>;

  const handleCopy = () => {
    if (!copyName.trim()) {
      alert('请输入新食谱名称');
      return;
    }
    const newRecipe = {
      ...recipe,
      id: `r${Date.now()}`,
      name: copyName.trim(),
      isActive: false,
      createdAt: new Date().toISOString().split('T')[0],
      executedDays: 0,
      startDate: undefined,
      endDate: undefined,
    };
    MOCK_RECIPES.push(newRecipe);
    saveRecipes();
    setShowCopyModal(false);
    navigate(`/recipes/${newRecipe.id}`);
  };

  const handleDelete = () => {
    setShowSettings(false);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const index = MOCK_RECIPES.findIndex(r => r.id === recipe.id);
    if (index > -1) {
      MOCK_RECIPES.splice(index, 1);
      saveRecipes();
      navigate('/recipes');
    }
  };

  const handleEdit = () => {
    setShowSettings(false);
    navigate(`/recipes/edit/${recipe.id}`);
  };

  const handleEditRecipe = () => {
    setEditedIngredients(recipe.ingredients.map(i => ({ ...i })));
    setEditedSupplements(recipe.supplements.map(s => ({ ...s })));
    setIsEditingRecipe(true);
  };

  const handleCancelEditRecipe = () => {
    setIsEditingRecipe(false);
  };

  const handleSaveRecipe = () => {
    const validIngredients = editedIngredients.map(i => ({
      meatId: i.meatId,
      weight: typeof i.weight === 'string' ? (parseFloat(i.weight) || 0) : i.weight
    })).filter(i => i.weight > 0);
    
    recipe.ingredients = validIngredients;
    
    const validSupplements = editedSupplements.map(s => ({
      supplementId: s.supplementId,
      amount: typeof s.amount === 'string' ? (parseFloat(s.amount) || 0) : s.amount
    })).filter(s => s.amount > 0);

    recipe.supplements = validSupplements;
    
    saveRecipes();
    setForceRender(prev => prev + 1);
    setIsEditingRecipe(false);
  };

  const openReplacePicker = (index: number, category: string) => {
    setReplacingIndex(index);
    setPickerCategoryFilter(category);
    setPickerSelectedIds([editedIngredients[index].meatId]);
    setPickerSearchQuery('');
    setShowIngredientPicker(true);
  };

  const openAddPicker = () => {
    setReplacingIndex(null);
    setPickerCategoryFilter('all');
    setPickerSelectedIds([]);
    setPickerSearchQuery('');
    setShowIngredientPicker(true);
  };

  const removeIngredient = (index: number) => {
    const newArr = [...editedIngredients];
    newArr.splice(index, 1);
    setEditedIngredients(newArr);
  };

  const handleConfirmPicker = () => {
    if (replacingIndex !== null) {
      if (pickerSelectedIds.length > 0) {
        const newArr = [...editedIngredients];
        newArr[replacingIndex] = { ...newArr[replacingIndex], meatId: pickerSelectedIds[0] };
        setEditedIngredients(newArr);
      }
    } else {
      const newIngredients = pickerSelectedIds.map(id => ({ meatId: id, weight: '' }));
      setEditedIngredients([...editedIngredients, ...newIngredients]);
    }
    setShowIngredientPicker(false);
  };

  const togglePickerSelection = (id: string) => {
    setPickerSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const openReplaceSupplementPicker = (index: number) => {
    setReplacingSupplementIndex(index);
    setPickerSelectedSupplementIds([editedSupplements[index].supplementId]);
    setPickerSupplementSearchQuery('');
    setShowSupplementPicker(true);
  };

  const openAddSupplementPicker = () => {
    setReplacingSupplementIndex(null);
    setPickerSelectedSupplementIds([]);
    setPickerSupplementSearchQuery('');
    setShowSupplementPicker(true);
  };

  const removeSupplement = (index: number) => {
    const newArr = [...editedSupplements];
    newArr.splice(index, 1);
    setEditedSupplements(newArr);
  };

  const handleConfirmSupplementPicker = () => {
    if (replacingSupplementIndex !== null) {
      if (pickerSelectedSupplementIds.length > 0) {
        const newArr = [...editedSupplements];
        newArr[replacingSupplementIndex] = { ...newArr[replacingSupplementIndex], supplementId: pickerSelectedSupplementIds[0] };
        setEditedSupplements(newArr);
      }
    } else {
      const newSupplements = pickerSelectedSupplementIds.map(id => ({ supplementId: id, amount: '' }));
      setEditedSupplements([...editedSupplements, ...newSupplements]);
    }
    setShowSupplementPicker(false);
  };

  const toggleSupplementPickerSelection = (id: string) => {
    setPickerSelectedSupplementIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const currentIngredients = isEditingRecipe ? editedIngredients : recipe.ingredients;
  
  const parsedIngredients = currentIngredients.map(i => ({
    ...i,
    weight: typeof i.weight === 'string' ? (parseFloat(i.weight) || 0) : i.weight
  }));

  const currentSupplements = isEditingRecipe 
    ? editedSupplements 
    : recipe.supplements;

  const parsedSupplements = currentSupplements.map(s => ({
    ...s,
    amount: typeof s.amount === 'string' ? (parseFloat(s.amount) || 0) : s.amount
  }));

  const handleAutoCalculateSupplements = () => {
    const currentSupps = isEditingRecipe ? [...editedSupplements] : recipe.supplements.map(s => ({ ...s }));
    const newSupplements = calculateSupplements(parsedIngredients, (recipe.standard as 'NRC' | 'AAFCO') || 'NRC', currentSupps);
    setEditedSupplements(newSupplements);
    setIsEditingRecipe(true);
  };

  const totalWeight = parsedIngredients.reduce((sum, item) => sum + item.weight, 0);
  
  // Calculate macros
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarb = 0;
  let totalKcal = 0;
  
  let totalCalcium = 0;
  let totalPhosphorus = 0;
  let totalIron = 0;
  let totalZinc = 0;
  let totalTaurine = 0;
  let totalMagnesium = 0;
  let totalPotassium = 0;
  let totalSodium = 0;
  let totalIodine = 0;
  let totalVd = 0;
  let totalVa = 0;
  let totalVe = 0;
  let totalVb1 = 0;
  let totalVb2 = 0;
  let totalVb3 = 0;
  let totalVb5 = 0;
  let totalVb6 = 0;
  let totalVb7 = 0;
  let totalVb9 = 0;
  let totalVb12 = 0;
  let totalCholine = 0;
  let totalCopper = 0;
  let totalManganese = 0;
  let totalEpa = 0;
  let totalDha = 0;
  let totalEpaDha = 0;
  
  const categoryData: Record<string, number> = {};

  parsedIngredients.forEach(item => {
    const meat = MEAT_DATABASE.find(m => m.id === item.meatId);
    if (meat) {
      totalProtein += (meat.protein / 100) * item.weight;
      totalFat += (meat.fat / 100) * item.weight;
      totalCarb += ((meat.carbohydrate || 0) / 100) * item.weight;
      totalKcal += (meat.kcal / 100) * item.weight;
      
      totalCalcium += (meat.calcium / 100) * item.weight;
      totalPhosphorus += (meat.phosphorus / 100) * item.weight;
      totalIron += (meat.iron / 100) * item.weight;
      totalZinc += (meat.zinc / 100) * item.weight;
      totalTaurine += (meat.taurine / 100) * item.weight;
      
      totalMagnesium += ((meat.magnesium || 0) / 100) * item.weight;
      totalSodium += ((meat.sodium || 0) / 100) * item.weight;
      totalIodine += ((meat.iodine || 0) / 100) * item.weight;
      totalVd += ((meat.vd || 0) / 100) * item.weight;
      totalVa += ((meat.va || 0) / 100) * item.weight;
      totalVe += ((meat.ve || 0) / 100) * item.weight;
      totalVb1 += ((meat.vb1 || 0) / 100) * item.weight;
      totalVb2 += ((meat.vb2 || 0) / 100) * item.weight;
      totalVb3 += ((meat.vb3 || 0) / 100) * item.weight;
      totalVb5 += ((meat.vb5 || 0) / 100) * item.weight;
      totalVb6 += ((meat.vb6 || 0) / 100) * item.weight;
      totalVb7 += ((meat.vb7 || 0) / 100) * item.weight;
      totalVb9 += ((meat.vb9 || 0) / 100) * item.weight;
      totalVb12 += ((meat.vb12 || 0) / 100) * item.weight;
      totalPotassium += ((meat.potassium || 0) / 100) * item.weight;
      totalCholine += ((meat.choline || 0) / 100) * item.weight;
      totalCopper += ((meat.copper || 0) / 100) * item.weight;
      totalManganese += ((meat.manganese || 0) / 100) * item.weight;
      totalEpa += ((meat.epa || 0) / 100) * item.weight;
      totalDha += ((meat.dha || 0) / 100) * item.weight;
      totalEpaDha += ((meat.epa_dha || 0) / 100) * item.weight;
      
      categoryData[meat.category] = (categoryData[meat.category] || 0) + item.weight;
    }
  });

  parsedSupplements.forEach(item => {
    const supp = SUPPLEMENTS.find(s => s.id === item.supplementId);
    if (supp) {
      totalCalcium += (supp.calcium || 0) * item.amount;
      totalPhosphorus += (supp.phosphorus || 0) * item.amount;
      totalIron += (supp.iron || 0) * item.amount;
      totalZinc += (supp.zinc || 0) * item.amount;
      totalTaurine += (supp.taurine || 0) * item.amount;
      totalMagnesium += (supp.magnesium || 0) * item.amount;
      totalPotassium += (supp.potassium || 0) * item.amount;
      totalSodium += (supp.sodium || 0) * item.amount;
      totalIodine += (supp.iodine || 0) * item.amount;
      totalVd += (supp.vd || 0) * item.amount;
      totalVa += (supp.va || 0) * item.amount;
      totalVe += (supp.ve || 0) * item.amount;
      totalVb1 += (supp.vb1 || 0) * item.amount;
      totalVb2 += (supp.vb2 || 0) * item.amount;
      totalVb3 += (supp.vb3 || 0) * item.amount;
      totalVb5 += (supp.vb5 || 0) * item.amount;
      totalVb6 += (supp.vb6 || 0) * item.amount;
      totalVb7 += (supp.vb7 || 0) * item.amount;
      totalVb9 += (supp.vb9 || 0) * item.amount;
      totalVb12 += (supp.vb12 || 0) * item.amount;
      totalCholine += (supp.choline || 0) * item.amount;
      totalCopper += (supp.copper || 0) * item.amount;
      totalManganese += (supp.manganese || 0) * item.amount;
      totalEpa += (supp.epa || 0) * item.amount;
      totalDha += (supp.dha || 0) * item.amount;
      totalEpaDha += (supp.epa_dha || 0) * item.amount;
    }
  });

  const proteinKcal = totalProtein * 3.5;
  const fatKcal = totalFat * 8.5;
  const carbKcal = totalCarb * 3.5;
  const totalCalculatedKcal = proteinKcal + fatKcal + carbKcal;

  const proteinME = totalCalculatedKcal > 0 ? (proteinKcal / totalCalculatedKcal) * 100 : 0;
  const fatME = totalCalculatedKcal > 0 ? (fatKcal / totalCalculatedKcal) * 100 : 0;
  const carbME = totalCalculatedKcal > 0 ? (carbKcal / totalCalculatedKcal) * 100 : 0;

  const macroData = [
    { name: '蛋白质', value: totalProtein, me: proteinME },
    { name: '脂肪', value: totalFat, me: fatME },
    { name: '碳水', value: totalCarb, me: carbME },
  ];

  const handleToggleActive = () => {
    const now = new Date().toISOString();
    if (!recipe.isActive) {
      MOCK_RECIPES.forEach(r => {
        if (r.isActive) {
          r.isActive = false;
          r.endDate = now;
        }
      });
      recipe.isActive = true;
      recipe.startDate = now;
      recipe.endDate = undefined;
    } else {
      recipe.isActive = false;
      recipe.endDate = now;
    }
    saveRecipes();
    setForceRender(prev => prev + 1);
  };

  const catData = Object.entries(categoryData).map(([name, value]) => ({
    name: name === 'red_meat' ? '红肉' : 
          name === 'white_meat' ? '白肉' : 
          name === 'fish' ? '鱼类' : 
          name === 'liver' ? '肝脏' :
          name === 'heart' ? '心脏' :
          name === 'mussel' ? '青口贝' : '内脏',
    value
  }));

  const multiplier = totalKcal > 0 ? 1000 / totalKcal : 0;
  const currentNutrients = {
    protein: totalProtein * multiplier,
    fat: totalFat * multiplier,
    calcium: (totalCalcium / 1000) * multiplier,
    phosphorus: (totalPhosphorus / 1000) * multiplier,
    ca_p_ratio: totalPhosphorus > 0 ? totalCalcium / totalPhosphorus : 0,
    iron: totalIron * multiplier,
    zinc: totalZinc * multiplier,
    taurine: totalTaurine * multiplier,
    magnesium: (totalMagnesium / 1000) * multiplier,
    potassium: (totalPotassium / 1000) * multiplier,
    sodium: (totalSodium / 1000) * multiplier,
    iodine: totalIodine * multiplier,
    vitamin_d: totalVd * multiplier,
    vitamin_a: totalVa * multiplier,
    vitamin_e: totalVe * multiplier,
    vb1: totalVb1 * multiplier,
    vb2: totalVb2 * multiplier,
    vb3: totalVb3 * multiplier,
    vb5: totalVb5 * multiplier,
    vb6: totalVb6 * multiplier,
    vb7: totalVb7 * multiplier,
    vb9: totalVb9 * multiplier,
    vb12: totalVb12 * multiplier,
    choline: totalCholine * multiplier,
    copper: totalCopper * multiplier,
    manganese: totalManganese * multiplier,
    epa: totalEpa * multiplier,
    dha: totalDha * multiplier,
    epa_dha: totalEpaDha * multiplier,
  };

  const standardData = NUTRITION_STANDARDS[recipe.standard || 'NRC'];
  const nutrientKeys = Object.keys(standardData) as Array<keyof typeof standardData>;

  const getComplianceStatus = (key: keyof typeof standardData, value: number) => {
    const std = standardData[key];
    if (std.min !== null && value < std.min) return 'low';
    if (std.max !== null && value > std.max) return 'high';
    return 'ok';
  };

  return (
    <div className="p-4 space-y-4 bg-stone-50 min-h-full pb-24">
      <header className="mb-6 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <Link to="/recipes" className="text-stone-500 hover:text-stone-700">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">食谱详情</h1>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showSettings && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-stone-100 py-2 z-50">
                <button onClick={handleEdit} className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2">
                  <Edit2 className="w-4 h-4" /> 编辑食谱
                </button>
                <button onClick={() => { setCopyName(`${recipe.name} (副本)`); setShowCopyModal(true); setShowSettings(false); }} className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2">
                  <Copy className="w-4 h-4" /> 复制食谱
                </button>
                <div className="h-px bg-stone-100 my-1"></div>
                <button onClick={handleDelete} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> 删除食谱
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {showCopyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-stone-900 mb-4">复制食谱</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">新食谱名称</label>
              <input
                type="text"
                value={copyName}
                onChange={e => setCopyName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCopy();
                  if (e.key === 'Escape') setShowCopyModal(false);
                }}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCopyModal(false)}
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleCopy}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-stone-900 mb-2">删除食谱</h3>
            <p className="text-stone-600 mb-6">确定要删除食谱"{recipe.name}"吗？此操作无法撤销。</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                取消
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {showFullNutritionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-stone-100 shrink-0">
              <h3 className="text-lg font-bold text-stone-900">所有营养素情况 ({recipe.standard || 'NRC'} 标准)</h3>
              <button onClick={() => setShowFullNutritionModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-6">
              {Object.entries(
                Object.entries(FULL_NUTRITION_STANDARDS[(recipe.standard as 'NRC' | 'AAFCO') || 'NRC']).reduce((acc, [key, std]) => {
                  if (!acc[std.category]) acc[std.category] = [];
                  acc[std.category].push({ key, ...std });
                  return acc;
                }, {} as Record<string, any[]>)
              ).map(([category, items]) => {
                const visibleItems = items.filter(item => {
                  const currentVal = (currentNutrients as any)[item.key] || 0;
                  const coreNutrients = ['protein', 'fat', 'calcium', 'phosphorus', 'ca_p_ratio', 'iron', 'zinc', 'taurine'];
                  const hasMeatData = coreNutrients.includes(item.key);
                  return hasMeatData || currentVal > 0;
                });

                if (visibleItems.length === 0) return null;

                return (
                <div key={category}>
                  <h4 className="font-bold text-stone-800 mb-3 text-sm bg-stone-50 p-2 rounded-lg">{category}</h4>
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-stone-500 border-b border-stone-100">
                      <tr>
                        <th className="py-2 font-medium w-1/3">营养素</th>
                        <th className="py-2 font-medium">当前</th>
                        <th className="py-2 font-medium">推荐</th>
                        <th className="py-2 font-medium text-center">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {visibleItems.map(item => {
                        const currentVal = (currentNutrients as any)[item.key] || 0;
                        let status = 'ok';
                        if (item.min !== null && currentVal < item.min) status = 'low';
                        if (item.max !== null && currentVal > item.max) status = 'high';
                        
                        return (
                          <tr key={item.key}>
                            <td className="py-2.5 text-stone-800 font-medium">{item.label}</td>
                            <td className="py-2.5 text-stone-600">
                              {currentVal.toFixed(item.key === 'ca_p_ratio' ? 2 : 1)} {item.unit}
                            </td>
                            <td className="py-2.5 text-stone-500 text-xs">
                              {item.min !== null ? `≥ ${item.min}` : ''}
                              {item.min !== null && item.max !== null ? ' ~ ' : ''}
                              {item.max !== null ? `≤ ${item.max}` : ''}
                              {` ${item.unit}`}
                            </td>
                            <td className="py-2.5 text-center">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                status === 'ok' ? 'bg-emerald-100 text-emerald-600' :
                                status === 'low' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-red-100 text-red-600'
                              }`}>
                                {status === 'ok' ? '✓' : status === 'low' ? '↓' : '↑'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )})}
            </div>
          </div>
        </div>
      )}

      {(recipe.startDate || recipe.endDate) && (
        <div className="text-sm text-stone-500 mb-4 bg-stone-50 p-3 rounded-xl space-y-1 border border-stone-100">
          {recipe.startDate && <p>开始执行: {formatSafeDate(recipe.startDate)}</p>}
          {recipe.endDate && <p>结束执行: {formatSafeDate(recipe.endDate)}</p>}
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-lg font-bold text-stone-800">{recipe.name}</h2>
          {recipe.isActive && (
            <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full shrink-0">
              <Activity className="w-3 h-3" />
              执行中
            </span>
          )}
        </div>
        <p className="text-sm text-stone-500 mb-4">
          总重量: {totalWeight}g · 周期: {recipe.days}天
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-40">
            <h3 className="text-xs font-semibold text-center text-stone-600 mb-2">宏量营养素</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<MacroTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-40">
            <h3 className="text-xs font-semibold text-center text-stone-600 mb-2">食材配比</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={catData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {catData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<IngredientTooltip totalWeight={totalWeight} />} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-stone-800">营养达标情况 ({recipe.standard || 'NRC'} 标准)</h3>
          <button 
            onClick={() => setShowFullNutritionModal(true)}
            className="text-emerald-600 text-sm font-medium hover:text-emerald-700 flex items-center gap-1"
          >
            更多 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-stone-500 bg-stone-50">
              <tr>
                <th className="px-3 py-2 rounded-l-lg font-medium">营养素</th>
                <th className="px-3 py-2 font-medium">当前含量</th>
                <th className="px-3 py-2 font-medium">推荐含量</th>
                <th className="px-3 py-2 rounded-r-lg font-medium text-center">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {nutrientKeys.map(key => {
                const std = standardData[key];
                const currentVal = currentNutrients[key];
                const status = getComplianceStatus(key, currentVal);
                
                return (
                  <tr key={key}>
                    <td className="px-3 py-2.5 text-stone-800 font-medium">{std.label}</td>
                    <td className="px-3 py-2.5 text-stone-600">
                      {currentVal.toFixed(key === 'ca_p_ratio' ? 2 : 1)} {std.unit}
                    </td>
                    <td className="px-3 py-2.5 text-stone-500 text-xs">
                      {std.min !== null ? `≥ ${std.min}` : ''}
                      {std.min !== null && std.max !== null ? ' ~ ' : ''}
                      {std.max !== null ? `≤ ${std.max}` : ''}
                      {` ${std.unit}`}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        status === 'ok' ? 'bg-emerald-100 text-emerald-600' :
                        status === 'low' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {status === 'ok' ? '✓' : status === 'low' ? '↓' : '↑'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-stone-400 mt-3 text-center">* 含量基于每 1000 kcal 代谢能 (ME) 计算</p>
        </div>
      </div>

      {showIngredientPicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowIngredientPicker(false)}>
          <div className="bg-white w-full sm:w-[500px] rounded-t-3xl sm:rounded-3xl p-6 pb-8 max-h-[85vh] flex flex-col shadow-xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xl font-bold text-stone-800">
                {replacingIndex !== null ? '替换食材' : '添加食材'}
              </h3>
              <button onClick={() => setShowIngredientPicker(false)} className="p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-4 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input 
                type="text" 
                placeholder="搜索食材"
                value={pickerSearchQuery}
                onChange={e => setPickerSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
            </div>
            
            <div className="flex overflow-x-auto gap-4 pb-2 mb-4 scrollbar-hide px-1 shrink-0">
              {[
                { id: 'all', name: '常用', icon: '🥩' },
                { id: 'white_meat', name: '白肉', icon: '🍗' },
                { id: 'red_meat', name: '红肉', icon: '🥩' },
                { id: 'heart', name: '肌肉组织', icon: '❤️' },
                { id: 'fish', name: '鱼类', icon: '🐟' },
                { id: 'liver', name: '肝脏', icon: '🩸' },
                { id: 'mussel', name: '青口贝', icon: '🦪' },
                { id: 'other_offal', name: '其他内脏', icon: '🍖' },
              ].map(c => (
                <button 
                  key={c.id}
                  onClick={() => setPickerCategoryFilter(c.id)}
                  className={`flex flex-col items-center min-w-[48px] gap-2 relative shrink-0`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${pickerCategoryFilter === c.id ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-stone-600 shadow-sm border border-stone-100'}`}>
                    {c.icon}
                  </div>
                  <span className={`text-xs ${pickerCategoryFilter === c.id ? 'text-emerald-600 font-medium' : 'text-stone-500'}`}>{c.name}</span>
                  {pickerCategoryFilter === c.id && (
                    <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-0 flex gap-3">
              {sortedPickerGroups.length > 0 && (
                <div className="w-14 shrink-0 flex flex-col gap-1 overflow-y-auto scrollbar-hide py-2">
                  {sortedPickerGroups.map(([groupName]) => (
                    <button
                      key={`picker-sidebar-${groupName}`}
                      onClick={() => scrollToPickerGroup(groupName)}
                      className={`text-center px-1 py-2 text-xs font-medium rounded-xl transition-colors shrink-0 ${
                        pickerActiveSidebarGroup === groupName 
                          ? 'bg-white text-emerald-600 shadow-sm border border-stone-100' 
                          : 'text-stone-500 hover:bg-stone-100'
                      }`}
                    >
                      {groupName.split(' ')[0]}
                    </button>
                  ))}
                </div>
              )}

              <div id="picker-scroll-container" className="flex-1 overflow-y-auto min-h-0 bg-white rounded-2xl shadow-sm border border-stone-100/50 relative">
                {sortedPickerGroups.length > 0 ? (
                  <div className="space-y-4 p-2">
                    {sortedPickerGroups.map(([groupName, meats]) => (
                      <div key={groupName} id={`picker-group-anchor-${groupName}`}>
                        <h4 className="text-xs font-bold text-stone-500 mb-2 px-2 sticky top-0 bg-white/90 backdrop-blur py-1 z-10">{groupName}</h4>
                        <div className="space-y-1">
                          {meats.map((meat) => {
                            const icon = [
                              { id: 'white_meat', icon: '🍗' },
                              { id: 'red_meat', icon: '🥩' },
                              { id: 'fish', icon: '🐟' },
                              { id: 'liver', icon: '🩸' },
                              { id: 'heart', icon: '❤️' },
                              { id: 'mussel', icon: '🦪' },
                              { id: 'other_offal', icon: '🍖' },
                            ].find(c => c.id === meat.category)?.icon || '🥩';

                            return (
                              <label key={meat.id} className="flex justify-between items-center p-3 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                                  <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-xl border border-stone-100/50 shrink-0">
                                    {icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-bold text-stone-800 text-base truncate">{meat.name}</div>
                                    <div className="text-xs text-stone-400 mt-0.5">{meat.kcal} kcal / 100g</div>
                                  </div>
                                </div>
                                <div className="flex items-center shrink-0">
                                  {replacingIndex !== null ? (
                                    <input 
                                      type="radio" 
                                      name="meat_picker" 
                                      checked={pickerSelectedIds.includes(meat.id)} 
                                      onChange={() => setPickerSelectedIds([meat.id])} 
                                      className="text-emerald-600 focus:ring-emerald-500 w-5 h-5 border-stone-300"
                                    />
                                  ) : (
                                    <input 
                                      type="checkbox" 
                                      checked={pickerSelectedIds.includes(meat.id)} 
                                      onChange={() => togglePickerSelection(meat.id)} 
                                      className="text-emerald-600 focus:ring-emerald-500 rounded w-5 h-5 border-stone-300"
                                    />
                                  )}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-stone-500 text-sm">没有找到匹配的食材</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stone-100 shrink-0">
              <button 
                onClick={() => setShowIngredientPicker(false)}
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmPicker}
                disabled={pickerSelectedIds.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-stone-800">食材清单</h3>
        </div>
        
        {isEditingRecipe ? (
          <div className="space-y-3">
            {editedIngredients.map((item, idx) => {
              const meat = MEAT_DATABASE.find(m => m.id === item.meatId);
              if (!meat) return null;
              return (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-stone-50 last:border-0 gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-stone-800 text-sm">{meat.name}</p>
                    <p className="text-xs text-stone-500">
                      {meat.category === 'red_meat' ? '红肉' : 
                       meat.category === 'white_meat' ? '白肉' : 
                       meat.category === 'fish' ? '鱼类' : 
                       meat.category === 'liver' ? '肝脏' :
                       meat.category === 'heart' ? '心脏' :
                       meat.category === 'mussel' ? '青口贝' : '内脏'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={item.weight} 
                      onChange={e => {
                        const newArr = [...editedIngredients];
                        newArr[idx] = { ...newArr[idx], weight: e.target.value };
                        setEditedIngredients(newArr);
                      }}
                      className="w-16 px-2 py-1 text-right border border-stone-200 rounded focus:outline-none focus:border-emerald-500"
                      placeholder="重量"
                    />
                    <span className="text-sm text-stone-500">g</span>
                    <button onClick={() => openReplacePicker(idx, meat.category)} className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeIngredient(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            <button onClick={openAddPicker} className="w-full py-2 border-2 border-dashed border-stone-200 rounded-xl text-stone-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" /> 添加食材
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recipe.ingredients.map((item, idx) => {
              const meat = MEAT_DATABASE.find(m => m.id === item.meatId);
              if (!meat) return null;
              return (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-stone-50 last:border-0">
                  <div>
                    <p className="font-medium text-stone-800 text-sm">{meat.name}</p>
                    <p className="text-xs text-stone-500">
                      {meat.category === 'red_meat' ? '红肉' : 
                       meat.category === 'white_meat' ? '白肉' : 
                       meat.category === 'fish' ? '鱼类' : 
                       meat.category === 'liver' ? '肝脏' :
                       meat.category === 'heart' ? '心脏' :
                       meat.category === 'mussel' ? '青口贝' : '内脏'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-stone-900">{item.weight}g</p>
                    <p className="text-xs text-stone-400">{((item.weight / totalWeight) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showSupplementPicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowSupplementPicker(false)}>
          <div className="bg-white w-full sm:w-[500px] rounded-t-3xl sm:rounded-3xl p-6 pb-8 max-h-[85vh] flex flex-col shadow-xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xl font-bold text-stone-800">
                {replacingSupplementIndex !== null ? '替换营养剂' : '添加营养剂'}
              </h3>
              <button onClick={() => setShowSupplementPicker(false)} className="p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-4 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input 
                type="text" 
                placeholder="搜索营养剂"
                value={pickerSupplementSearchQuery}
                onChange={e => setPickerSupplementSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 bg-white rounded-2xl shadow-sm border border-stone-100/50">
              {SUPPLEMENTS.filter(s => {
                // Search filter
                if (!s.name.includes(pickerSupplementSearchQuery)) return false;
                
                // Duplicate type filter (only when adding, not replacing)
                if (replacingSupplementIndex === null) {
                  const existingTypes = editedSupplements.map(es => {
                    const supp = SUPPLEMENTS.find(sup => sup.id === es.supplementId);
                    return supp ? supp.type : null;
                  }).filter(Boolean);
                  
                  // If we are already selecting this item, keep it visible
                  if (pickerSelectedSupplementIds.includes(s.id)) return true;
                  
                  // Hide if a supplement of this type is already in the recipe
                  if (existingTypes.includes(s.type)) return false;
                  
                  // Hide if a supplement of this type is already selected in the picker
                  const selectedTypesInPicker = pickerSelectedSupplementIds.map(id => {
                     const supp = SUPPLEMENTS.find(sup => sup.id === id);
                     return supp ? supp.type : null;
                  }).filter(Boolean);
                  if (selectedTypesInPicker.includes(s.type)) return false;
                }
                return true;
              }).map((supp, idx, arr) => (
                <label key={supp.id} className={`flex justify-between items-center p-4 cursor-pointer hover:bg-stone-50 transition-colors ${idx !== arr.length - 1 ? 'border-b border-stone-50' : ''}`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-xl border border-stone-100/50 shrink-0">
                      💊
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-stone-800 text-base truncate">{supp.name}</div>
                      <div className="text-xs text-stone-400 mt-0.5">{supp.brand || '通用'}</div>
                      {supp.type === 'calcium' && (
                        <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          添加钙粉时，请注意调整用量以满足钙磷比 (推荐 1.2 左右)
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center shrink-0">
                    {replacingSupplementIndex !== null ? (
                      <input 
                        type="radio" 
                        name="supp_picker" 
                        checked={pickerSelectedSupplementIds.includes(supp.id)} 
                        onChange={() => setPickerSelectedSupplementIds([supp.id])} 
                        className="text-emerald-600 focus:ring-emerald-500 w-5 h-5 border-stone-300"
                      />
                    ) : (
                      <input 
                        type="checkbox" 
                        checked={pickerSelectedSupplementIds.includes(supp.id)} 
                        onChange={() => toggleSupplementPickerSelection(supp.id)} 
                        className="text-emerald-600 focus:ring-emerald-500 rounded w-5 h-5 border-stone-300"
                      />
                    )}
                  </div>
                </label>
              ))}
              {SUPPLEMENTS.filter(s => s.name.includes(pickerSupplementSearchQuery)).length === 0 && (
                <div className="p-8 text-center text-stone-500 text-sm">没有找到匹配的营养剂</div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stone-100 shrink-0">
              <button 
                onClick={() => setShowSupplementPicker(false)}
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmSupplementPicker}
                disabled={pickerSelectedSupplementIds.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-stone-800">营养剂清单</h3>
          {isEditingRecipe && (
            <button onClick={handleAutoCalculateSupplements} className="text-xs text-emerald-600 bg-emerald-50 font-medium px-2 py-1 hover:bg-emerald-100 rounded flex items-center gap-1">
              <Activity className="w-3 h-3" /> 智能计算
            </button>
          )}
        </div>
        
        {isEditingRecipe ? (
          <div className="space-y-3">
            {editedSupplements.map((item, idx) => {
              const supp = SUPPLEMENTS.find(s => s.id === item.supplementId);
              if (!supp) return null;
              return (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-stone-50 last:border-0 gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-stone-800 text-sm">{supp.name}</p>
                    <p className="text-xs text-stone-500">{supp.brand || '通用'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={item.amount} 
                      onChange={e => {
                        const newArr = [...editedSupplements];
                        newArr[idx] = { ...newArr[idx], amount: e.target.value };
                        setEditedSupplements(newArr);
                      }}
                      className="w-16 px-2 py-1 text-right border border-stone-200 rounded focus:outline-none focus:border-emerald-500"
                      placeholder="用量"
                    />
                    <span className="text-sm text-stone-500 w-8">{supp.unit}</span>
                    <button onClick={() => openReplaceSupplementPicker(idx)} className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeSupplement(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            <button onClick={openAddSupplementPicker} className="w-full py-2 border-2 border-dashed border-stone-200 rounded-xl text-stone-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" /> 添加营养剂
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recipe.supplements.map((item, idx) => {
              const supp = SUPPLEMENTS.find(s => s.id === item.supplementId);
              if (!supp) return null;
              return (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-stone-50 last:border-0">
                  <p className="font-medium text-stone-800 text-sm pr-4">{supp.name}</p>
                  <p className="font-semibold text-stone-900 whitespace-nowrap">{item.amount}{supp.unit}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 space-y-3">
        {isEditingRecipe ? (
          <div className="flex gap-3">
            <button onClick={handleCancelEditRecipe} className="w-1/3 bg-white text-stone-600 border border-stone-200 px-4 py-3 rounded-xl font-medium shadow-sm hover:bg-stone-50 transition-colors flex items-center justify-center">
              取消
            </button>
            <button onClick={handleSaveRecipe} className="w-2/3 text-white px-4 py-3 rounded-xl font-medium shadow-lg transition-colors flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-5 h-5" />
              保存修改
            </button>
          </div>
        ) : (
          <>
            <button onClick={handleEditRecipe} className="w-full bg-white text-emerald-600 border border-emerald-600 px-4 py-3 rounded-xl font-medium shadow-sm hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
              <Edit2 className="w-5 h-5" />
              编辑食谱
            </button>
            <button onClick={handleToggleActive} className={`w-full text-white px-4 py-3 rounded-xl font-medium shadow-lg transition-colors flex items-center justify-center gap-2 ${recipe.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-stone-900 hover:bg-stone-800'}`}>
              <Activity className="w-5 h-5" />
              {recipe.isActive ? '停止执行' : '开始执行食谱'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Recipes() {
  return (
    <Routes>
      <Route path="/" element={<RecipeList />} />
      <Route path="/create" element={<CreateOrEditRecipe />} />
      <Route path="/edit/:id" element={<CreateOrEditRecipe />} />
      <Route path="/:id" element={<RecipeDetail />} />
    </Routes>
  );
}
