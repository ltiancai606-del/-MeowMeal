import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Camera, Search, Filter, ChevronRight, Trash2, X, Edit2, Loader2 } from 'lucide-react';
import { MOCK_INVENTORY, MEAT_DATABASE, saveInventory } from '../data/mock';
import { format, differenceInDays } from 'date-fns';
import { cn } from '../lib/utils';
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

function SearchableMeatSelect({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedMeat = MEAT_DATABASE.find(m => m.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMeats = MEAT_DATABASE.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedMeat ? 'text-stone-900' : 'text-stone-400'}>
          {selectedMeat ? selectedMeat.name : '请选择食材...'}
        </span>
        <ChevronRight className={cn("w-4 h-4 transition-transform text-stone-400", isOpen ? "rotate-90" : "rotate-90")} style={{ transform: isOpen ? 'rotate(-90deg)' : 'rotate(90deg)' }} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg max-h-60 flex flex-col">
          <div className="p-2 border-b border-stone-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20"
                placeholder="搜索食材关键字..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          <div className="p-1 overflow-y-auto flex-1">
            {filteredMeats.length === 0 ? (
              <div className="p-3 text-sm text-stone-500 text-center">未找到匹配食材</div>
            ) : (
              filteredMeats.map(meat => (
                <div
                  key={meat.id}
                  className={cn(
                    "p-3 text-sm rounded-lg cursor-pointer hover:bg-[#FFFAF5] hover:text-orange-600 transition-colors",
                    value === meat.id ? "bg-[#FFFAF5] text-orange-600 font-medium" : "text-stone-700"
                  )}
                  onClick={() => {
                    onChange(meat.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {meat.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InventoryList() {
  const [, setForceRender] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const normalItems = MOCK_INVENTORY.filter(i => differenceInDays(new Date(i.expiryDate), new Date()) > 30);
  const expiringItems = MOCK_INVENTORY.filter(i => differenceInDays(new Date(i.expiryDate), new Date()) >= 0 && differenceInDays(new Date(i.expiryDate), new Date()) <= 30);
  const expiredItems = MOCK_INVENTORY.filter(i => differenceInDays(new Date(i.expiryDate), new Date()) < 0);

  const getFilteredItems = () => {
    switch (activeTab) {
      case 'normal': return normalItems;
      case 'expiring': return expiringItems;
      case 'expired': return expiredItems;
      default: return MOCK_INVENTORY;
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-full bg-stone-50 flex flex-col pt-12 pb-24 px-5">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-stone-800">
          <span className="text-blue-500 bg-blue-50 p-1.5 rounded-xl">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6M4 6l4-4h8l4 4M10 10v6M14 10v6"></path></svg>
          </span> 
          冰箱库存
        </h1>
        <div className="flex gap-2 text-sm font-medium">
          <button 
            onClick={() => navigate('/inventory/upload')}
            className="bg-blue-50 text-blue-500 px-3 py-2 rounded-full hover:bg-blue-100 flex items-center gap-1 transition-colors"
          >
            <Camera className="w-4 h-4" /> OCR 入库
          </button>
          <button 
            onClick={() => navigate('/inventory/manual')}
            className="bg-[#FF7B4A] text-white px-3 py-2 rounded-full hover:bg-orange-600 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" /> 手动添加
          </button>
        </div>
      </header>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-stone-400" />
        </div>
        <input 
          type="text" 
          placeholder="搜索食材..." 
          className="w-full bg-white border border-stone-100 rounded-2xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20"
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          <Filter className="h-4 w-4 text-stone-400 cursor-pointer hover:text-stone-600" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-4 snap-x">
        <button 
          onClick={() => setActiveTab('all')}
          className={cn(
            "shrink-0 snap-center px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[64px] border transition-colors",
            activeTab === 'all' ? "bg-[#FF7B4A] border-orange-500 text-white" : "bg-white border-stone-100 text-stone-500"
          )}
        >
          <span className="text-xl font-bold mb-0.5">{MOCK_INVENTORY.length}</span>
          <span className="text-[10px] font-medium opacity-90">全部</span>
        </button>
        <button 
          onClick={() => setActiveTab('normal')}
          className={cn(
            "shrink-0 snap-center px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[64px] border transition-colors",
            activeTab === 'normal' ? "bg-[#FFFAF5] border-emerald-200 text-[#FF7B4A]" : "bg-white border-stone-100 text-stone-500 hover:bg-stone-50"
          )}
        >
          <span className={cn("text-xl font-bold mb-0.5", activeTab !== 'normal' && "text-emerald-500")}>{normalItems.length}</span>
          <span className={cn("text-[10px] font-medium", activeTab !== 'normal' && "text-emerald-500")}>正常</span>
        </button>
        <button 
          onClick={() => setActiveTab('expiring')}
          className={cn(
            "shrink-0 snap-center px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[64px] border transition-colors",
            activeTab === 'expiring' ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-white border-stone-100 text-stone-500 hover:bg-stone-50"
          )}
        >
          <span className={cn("text-xl font-bold mb-0.5", activeTab !== 'expiring' && "text-amber-500")}>{expiringItems.length}</span>
          <span className={cn("text-[10px] font-medium", activeTab !== 'expiring' && "text-amber-500")}>临期</span>
        </button>
        <button 
          onClick={() => setActiveTab('expired')}
          className={cn(
            "shrink-0 snap-center px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[64px] border transition-colors",
            activeTab === 'expired' ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-white border-stone-100 text-stone-500 hover:bg-stone-50"
          )}
        >
          <span className={cn("text-xl font-bold mb-0.5", activeTab !== 'expired' && "text-rose-500")}>{expiredItems.length}</span>
          <span className={cn("text-[10px] font-medium", activeTab !== 'expired' && "text-rose-500")}>已过期</span>
        </button>
        <button className="shrink-0 snap-center bg-white border border-stone-100 px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[64px] text-purple-500 hover:bg-stone-50 transition-colors">
          <span className="text-xl font-bold mb-0.5">1</span>
          <span className="text-[10px] font-medium">库存不足</span>
        </button>
      </div>

      {(expiringItems.length > 0 || expiredItems.length > 0) && (
        <div className="bg-amber-50 rounded-xl p-3 mb-6 flex items-center gap-2 border border-amber-100">
          <span className="text-amber-500 text-sm">⚠️</span>
          <p className="text-xs text-amber-700 font-medium tracking-wide">
            {expiringItems.length > 0 && `${expiringItems.length} 种食材即将过期，`}
            {expiredItems.length > 0 && `${expiredItems.length} 种已过期，`}请尽快处理
          </p>
        </div>
      )}

      <div className="space-y-4">
        {filteredItems.map(item => {
          const meat = MEAT_DATABASE.find(m => m.id === item.meatId);
          if (!meat) return null;
          
          let daysLeft = 999;
          try {
            const expiryDateObj = new Date(item.expiryDate);
            if (!isNaN(expiryDateObj.getTime())) {
              daysLeft = differenceInDays(expiryDateObj, new Date());
            }
          } catch (e) {}

          let statusTag = null;
          let iconBg = "bg-stone-100";
          let iconDot = "bg-stone-400";
          
          if (daysLeft < 0) {
            statusTag = <span className="text-[10px] bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded font-medium border border-rose-100">已过期</span>;
            iconBg = "bg-rose-50";
            iconDot = "bg-rose-600";
          } else if (daysLeft <= 30) {
            statusTag = <span className="text-[10px] bg-amber-50 text-amber-500 px-1.5 py-0.5 rounded font-medium border border-amber-100">临期</span>;
            iconBg = "bg-orange-50";
            iconDot = "bg-[#FF7B4A]";
          } else {
            statusTag = <span className="text-[10px] border border-emerald-200 text-emerald-500 px-1.5 py-0.5 rounded font-medium">正常</span>;
            iconBg = "bg-[#FFFAF5]";
            iconDot = "bg-[#FFFAF5]0";
          }

          if(meat.name.includes('猪心') || meat.name.includes('牛心') || meat.name.includes('内脏')) {
            iconBg = "bg-purple-50";
            iconDot = "bg-purple-500";
          }

          if(meat.name.includes('鱼') || meat.name.includes('贝')) {
             iconBg = "bg-blue-50";
             iconDot = "bg-blue-500";
          }
          if(meat.name.includes('鸡肝') || meat.name.includes('猪肝')) {
             iconBg = "bg-stone-100";
             iconDot = "bg-stone-600";
          }

          let emoji = '🥩';
          switch(meat.category) {
            case 'white_meat': emoji = '🍗'; break;
            case 'red_meat': emoji = '🥩'; break;
            case 'heart': emoji = '❤️'; break;
            case 'fish': emoji = '🐟'; break;
            case 'other': emoji = '🍖'; break;
          }

          return (
            <div key={item.id} className="bg-white rounded-3xl p-5 shadow-sm border border-stone-50 flex items-center gap-4 transition-colors hover:bg-stone-50 cursor-pointer" onClick={() => navigate('/inventory/manual')}>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-2xl", iconBg)}>
                {emoji}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-stone-800">{meat.name}</h3>
                  {statusTag}
                </div>
                <div className="text-[11px] text-stone-500 mb-2">
                   {meat.category === 'red_meat' ? '红肉' : meat.category === 'white_meat' ? '白肉' : meat.category === 'fish' ? '鱼类' : '内脏'} · {meat.name.split('·')[1] || '无'}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-stone-400 font-medium">
                  <span>库存 {item.weight}g</span>
                  <span>¥{item.price}</span>
                  <span className="flex items-center gap-0.5">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    还剩 {Math.max(0, daysLeft)} 天
                  </span>
                </div>
              </div>
              
              <ChevronRight className="w-5 h-5 text-stone-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UploadReceipt() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          
          const meatNames = MEAT_DATABASE.map(m => m.name).join('、');
          
          const response = await ai.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            contents: {
              parts: [
                {
                  inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                  },
                },
                {
                  text: `请作为一位专业的生鲜标签解析助手，仔细识别图片中的食材信息（如超市小票、生鲜包装标签等），并返回JSON格式。

关键规则：
1. 重量单位转换：
   - 1kg = 1000克
   - 1斤 = 500克
   - 1两 = 50克
   - 最终输出的 weight 必须是克(g)为单位的数字。
2. 价格：提取总价或单价，输出为数字。
3. 日期格式：
   - 提取生产日期 (productionDate) 和保质期/过期日期 (expiryDate)。
   - 格式必须为 YYYY-MM-DD。如果只有月日，请结合当前年份推断。
4. 食材名称标准化：
   - 必须从以下标准食材库中选择最匹配的名称：${meatNames}。
   - 别名转换：猪腰/羊腰 -> 猪腰/猪肾 或 羊肾，猪蛋/羊蛋 -> 猪睾丸，猪肚 -> 猪胃。
   - 去除多余的品牌名或修饰词（如"冷鲜"、"散装"、"特价"等）。
5. 多物品识别：同一张图片中可能包含多个食材标签，请提取所有食材。

返回一个包含 items 数组的 JSON，每个 item 包含：meatName(食材种类名称，必须是标准食材库中的名称), weight(重量，克), price(价格), productionDate(生产日期), expiryDate(过期日期)。如果某些字段无法识别，请留空或设为null。`,
                },
              ],
            },
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        meatName: { type: Type.STRING },
                        weight: { type: Type.NUMBER },
                        price: { type: Type.NUMBER },
                        productionDate: { type: Type.STRING },
                        expiryDate: { type: Type.STRING },
                      },
                    },
                  },
                },
              },
            },
          });

          const jsonStr = response.text?.trim() || '{}';
          const result = JSON.parse(jsonStr);
          
          const items = (result.items || []).map((item: any) => {
            let meatId = MEAT_DATABASE[0].id;
            if (item.meatName) {
              // Try exact match first
              let meat = MEAT_DATABASE.find(m => m.name === item.meatName);
              // Try partial match
              if (!meat) {
                meat = MEAT_DATABASE.find(m => 
                  m.name.includes(item.meatName) || item.meatName.includes(m.name)
                );
              }
              if (meat) meatId = meat.id;
            }
            return {
              meatId,
              weight: item.weight?.toString() || '',
              price: item.price?.toString() || '',
              productionDate: item.productionDate || format(new Date(), 'yyyy-MM-dd'),
              expiryDate: item.expiryDate || format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
            };
          });

          navigate('/inventory/manual', {
            state: {
              items: items.length > 0 ? items : undefined
            }
          });
        } catch (error) {
          console.error('API Error:', error);
          alert('识别失败，请重试或手动录入');
          setIsUploading(false);
        }
      };
    } catch (error) {
      console.error('File Error:', error);
      alert('读取文件失败');
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 bg-stone-50 min-h-full">
      <header className="mb-6 flex items-center gap-2">
        <Link to="/inventory" className="text-stone-500 hover:text-stone-700">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </Link>
        <h1 className="text-2xl font-bold text-stone-900">智能入库</h1>
      </header>
      
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200 border-dashed text-center">
        <div className="w-16 h-16 bg-[#FFFAF5] text-[#FF7B4A] border border-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-semibold text-stone-800 mb-2">拍照或上传小票</h2>
        <p className="text-sm text-stone-500 mb-6">
          支持自动识别肉类、部位、重量、价格及日期
        </p>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-[#FF7B4A] text-white px-6 py-3 rounded-xl font-medium w-full hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              识别中...
            </>
          ) : (
            '选择图片'
          )}
        </button>
      </div>
    </div>
  );
}

function ManualEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any || {};

  const initialItems = state.items && state.items.length > 0 ? state.items : [{
    id: `temp-${Date.now()}`,
    meatId: state.meatId || MEAT_DATABASE[0].id,
    weight: state.weight || '',
    price: state.price || '',
    productionDate: state.productionDate || format(new Date(), 'yyyy-MM-dd'),
    expiryDate: state.expiryDate || format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  }];

  const [items, setItems] = useState(initialItems);

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, {
      id: `temp-${Date.now()}`,
      meatId: MEAT_DATABASE[0].id,
      weight: '',
      price: '',
      productionDate: format(new Date(), 'yyyy-MM-dd'),
      expiryDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
    }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSave = () => {
    for (const item of items) {
      if (!item.weight || !item.price) {
        alert('请填写所有食材的重量和价格');
        return;
      }
    }

    const newInventoryItems = items.map((item: any, index: number) => ({
      id: `i${Date.now()}-${index}`,
      meatId: item.meatId,
      weight: parseFloat(item.weight),
      price: parseFloat(item.price),
      productionDate: item.productionDate,
      expiryDate: item.expiryDate,
      status: 'normal' as const
    }));

    MOCK_INVENTORY.push(...newInventoryItems);
    saveInventory();
    navigate('/inventory');
  };

  return (
    <div className="p-4 space-y-4 bg-stone-50 min-h-full pb-24">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/inventory" className="text-stone-500 hover:text-stone-700">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">手动录入</h1>
        </div>
        <button 
          onClick={handleAddItem}
          className="text-[#FF7B4A] hover:text-orange-600 font-medium flex items-center gap-1 text-sm"
        >
          <Plus className="w-4 h-4" />
          添加食材
        </button>
      </header>
      
      <div className="space-y-6">
        {items.map((item: any, index: number) => (
          <div key={item.id || index} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 space-y-4 relative">
            {items.length > 1 && (
              <button 
                onClick={() => handleRemoveItem(index)}
                className="absolute top-4 right-4 text-stone-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">食材种类 {index + 1}</label>
              <SearchableMeatSelect 
                value={item.meatId}
                onChange={(val) => handleUpdateItem(index, 'meatId', val)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">重量 (g)</label>
                <input 
                  type="number" 
                  value={item.weight}
                  onChange={(e) => handleUpdateItem(index, 'weight', e.target.value)}
                  placeholder="例如: 500"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">价格 (元)</label>
                <input 
                  type="number" 
                  value={item.price}
                  onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                  placeholder="例如: 25.5"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">生产日期</label>
                <input 
                  type="date" 
                  value={item.productionDate}
                  onChange={(e) => handleUpdateItem(index, 'productionDate', e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">过期日期</label>
                <input 
                  type="date" 
                  value={item.expiryDate}
                  onChange={(e) => handleUpdateItem(index, 'expiryDate', e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4">
        <button 
          onClick={handleSave}
          className="w-full bg-[#FF7B4A] text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors mt-4"
        >
          保存入库 ({items.length}件)
        </button>
      </div>
    </div>
  );
}

export default function Inventory() {
  return (
    <Routes>
      <Route path="/" element={<InventoryList />} />
      <Route path="/upload" element={<UploadReceipt />} />
      <Route path="/manual" element={<ManualEntry />} />
    </Routes>
  );
}
