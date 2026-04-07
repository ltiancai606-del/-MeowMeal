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
        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer flex justify-between items-center"
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
                className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    "p-3 text-sm rounded-lg cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors",
                    value === meat.id ? "bg-emerald-50 text-emerald-700 font-medium" : "text-stone-700"
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
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const navigate = useNavigate();

  const confirmDelete = () => {
    if (itemToDelete) {
      const index = MOCK_INVENTORY.findIndex(item => item.id === itemToDelete);
      if (index > -1) {
        MOCK_INVENTORY.splice(index, 1);
        saveInventory();
        setForceRender(prev => prev + 1);
      }
      setItemToDelete(null);
    }
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item.id);
    setEditFormData({ ...item });
  };

  const handleSaveEdit = () => {
    if (editingItem && editFormData) {
      const index = MOCK_INVENTORY.findIndex(i => i.id === editingItem);
      if (index > -1) {
        MOCK_INVENTORY[index] = { ...editFormData };
        saveInventory();
        setForceRender(prev => prev + 1);
      }
      setEditingItem(null);
      setEditFormData(null);
    }
  };

  return (
    <div className="p-4 space-y-4 bg-stone-50 min-h-full pb-24">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-stone-900">冰箱库存</h1>
        <button 
          onClick={() => setShowAddOptions(true)}
          className="bg-emerald-600 text-white p-2 rounded-full shadow-sm hover:bg-emerald-700"
        >
          <Camera className="w-5 h-5" />
        </button>
      </header>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input 
            type="text" 
            placeholder="搜索食材..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button className="p-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_INVENTORY.map(item => {
          const meat = MEAT_DATABASE.find(m => m.id === item.meatId);
          if (!meat) return null;
          
          let daysLeft = 999;
          let formattedExpiryDate = '未知';
          
          try {
            const expiryDateObj = new Date(item.expiryDate);
            if (!isNaN(expiryDateObj.getTime())) {
              daysLeft = differenceInDays(expiryDateObj, new Date());
              formattedExpiryDate = format(expiryDateObj, 'yyyy-MM-dd');
            }
          } catch (e) {
            // Ignore invalid date
          }

          let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
          let statusText = '正常';
          
          if (daysLeft < 0) {
            statusColor = 'text-red-600 bg-red-50 border-red-200';
            statusText = '已过期';
          } else if (daysLeft <= 30) {
            statusColor = 'text-amber-600 bg-amber-50 border-amber-200';
            statusText = '临期';
          }

          return (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold border", statusColor)}>
                {meat.category === 'red_meat' ? '红肉' : 
                 meat.category === 'white_meat' ? '白肉' : 
                 meat.category === 'fish' ? '鱼类' : 
                 meat.category === 'liver' ? '肝脏' :
                 meat.category === 'heart' ? '心脏' :
                 meat.category === 'mussel' ? '青口贝' : '内脏'}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-stone-800">{meat.name}</h3>
                  <span className="text-sm font-medium text-stone-900">{item.weight}g</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-stone-500">
                    到期: {formattedExpiryDate}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full", statusColor)}>
                      {statusText}
                    </span>
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-1 text-stone-400 hover:text-emerald-600 rounded-full hover:bg-emerald-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-stone-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50 sm:items-center sm:justify-center">
          <div className="bg-white w-full sm:w-96 rounded-t-2xl sm:rounded-2xl p-4 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">添加食材</h3>
              <button 
                onClick={() => setShowAddOptions(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => {
                  setShowAddOptions(false);
                  navigate('/inventory/upload');
                }}
                className="w-full flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">拍照上传</div>
                  <div className="text-xs opacity-80">智能识别小票或包装信息</div>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  setShowAddOptions(false);
                  navigate('/inventory/manual');
                }}
                className="w-full flex items-center gap-3 p-4 bg-stone-50 text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">手动录入</div>
                  <div className="text-xs opacity-80">手动选择食材并填写信息</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {editingItem && editFormData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">编辑食材</h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">食材种类</label>
                <SearchableMeatSelect 
                  value={editFormData.meatId}
                  onChange={(val) => setEditFormData({...editFormData, meatId: val})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">重量 (g)</label>
                  <input 
                    type="number" 
                    value={editFormData.weight}
                    onChange={(e) => setEditFormData({...editFormData, weight: parseFloat(e.target.value) || 0})}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">价格 (元)</label>
                  <input 
                    type="number" 
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({...editFormData, price: parseFloat(e.target.value) || 0})}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">生产日期</label>
                  <input 
                    type="date" 
                    value={editFormData.productionDate}
                    onChange={(e) => setEditFormData({...editFormData, productionDate: e.target.value})}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">过期日期</label>
                  <input 
                    type="date" 
                    value={editFormData.expiryDate}
                    onChange={(e) => setEditFormData({...editFormData, expiryDate: e.target.value})}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setEditingItem(null)}
                className="flex-1 p-3 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex-1 p-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-stone-900 mb-2">确认删除</h3>
            <p className="text-stone-500 mb-6">确定要删除这个食材吗？此操作无法撤销。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
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
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium w-full hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 text-sm"
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
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">价格 (元)</label>
                <input 
                  type="number" 
                  value={item.price}
                  onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                  placeholder="例如: 25.5"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">过期日期</label>
                <input 
                  type="date" 
                  value={item.expiryDate}
                  onChange={(e) => handleUpdateItem(index, 'expiryDate', e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4">
        <button 
          onClick={handleSave}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors mt-4"
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
