import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Plus, Camera, Search, Filter, ChevronRight, Trash2, X, Edit2 } from 'lucide-react';
import { MOCK_INVENTORY, MEAT_DATABASE, saveInventory } from '../data/mock';
import { format, differenceInDays } from 'date-fns';
import { cn } from '../lib/utils';
import { useState } from 'react';

function InventoryList() {
  const [, setForceRender] = useState(0);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
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
          
          const daysLeft = differenceInDays(new Date(item.expiryDate), new Date());
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
                    到期: {format(new Date(item.expiryDate), 'yyyy-MM-dd')}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full", statusColor)}>
                      {statusText}
                    </span>
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
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium w-full hover:bg-emerald-700 transition-colors">
          选择图片
        </button>
      </div>
    </div>
  );
}

function ManualEntry() {
  const navigate = useNavigate();
  const [meatId, setMeatId] = useState(MEAT_DATABASE[0].id);
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [productionDate, setProductionDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [expiryDate, setExpiryDate] = useState(format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));

  const handleSave = () => {
    if (!weight || !price) {
      alert('请填写重量和价格');
      return;
    }

    const newItem = {
      id: `i${Date.now()}`,
      meatId,
      weight: parseFloat(weight),
      price: parseFloat(price),
      productionDate,
      expiryDate,
      status: 'normal' as const
    };

    MOCK_INVENTORY.push(newItem);
    saveInventory();
    navigate('/inventory');
  };

  return (
    <div className="p-4 space-y-4 bg-stone-50 min-h-full pb-24">
      <header className="mb-6 flex items-center gap-2">
        <Link to="/inventory" className="text-stone-500 hover:text-stone-700">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </Link>
        <h1 className="text-2xl font-bold text-stone-900">手动录入</h1>
      </header>
      
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">食材种类</label>
          <select 
            value={meatId}
            onChange={(e) => setMeatId(e.target.value)}
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {MEAT_DATABASE.map(meat => (
              <option key={meat.id} value={meat.id}>{meat.name}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">重量 (g)</label>
            <input 
              type="number" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="例如: 500"
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">价格 (元)</label>
            <input 
              type="number" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
              value={productionDate}
              onChange={(e) => setProductionDate(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">过期日期</label>
            <input 
              type="date" 
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors mt-4"
        >
          保存入库
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
