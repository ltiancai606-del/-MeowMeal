import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronRight, Plus, Save } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { MOCK_CATS, MOCK_USER } from '../data/mock';
import { cn } from '../lib/utils';

function ProfileHome() {
  const [selectedCatId, setSelectedCatId] = useState(MOCK_CATS.length > 0 ? MOCK_CATS[0].id : null);
  const selectedCat = MOCK_CATS.find(c => c.id === selectedCatId) || MOCK_CATS[0];

  return (
    <div className="min-h-full bg-transparent flex flex-col">
      {/* Top Section with Orange Background */}
      <div className="bg-[#FF7B4A] pt-12 pb-8 px-5 shrink-0 relative">
        <header className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-white">个人中心</h1>
          <Link to="/profile/settings" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
          </Link>
        </header>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/30 backdrop-blur-sm">
            {MOCK_USER.avatarUrl ? (
              <img src={MOCK_USER.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">😊</span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-1">{MOCK_USER.nickname}</h2>
            <p className="text-xs text-white/80 mb-0.5">已养 {MOCK_CATS.length} 只猫 · 使用喵膳 48 天</p>
            <p className="text-xs font-medium text-amber-200">⭐ 科学喂养达人</p>
          </div>
        </div>
      </div>

      <div className="pt-6 px-5 pb-6 space-y-6 flex-1 bg-transparent">
        
        {/* Cat Profiles Card */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-stone-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-stone-800 flex items-center gap-2">
              <span className="text-stone-400">🐾</span> 
              猫咪档案
            </h3>
            <Link to="/profile/cats/new" className="text-orange-500 text-[11px] font-medium flex items-center gap-0.5">
              <Plus className="w-3 h-3" /> 添加猫咪
            </Link>
          </div>
          
          <div className="flex gap-2 mb-5">
            {MOCK_CATS.map(cat => {
              const isSelected = selectedCatId === cat.id;
              return (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-2xl flex items-center gap-1.5 text-sm font-medium transition-all",
                    isSelected 
                      ? "bg-white border-2 border-orange-500 text-orange-600 shadow-sm" 
                      : "bg-stone-50 border-2 border-transparent text-stone-500 hover:bg-stone-100"
                  )}
                >
                  {cat.avatarUrl ? (
                    <img src={cat.avatarUrl} alt={cat.name} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <span>🐱</span>
                  )}
                  {cat.name}
                </button>
              )
            })}
            <Link to="/profile/cats/new" className="px-4 py-2 rounded-2xl flex items-center justify-center text-orange-400 border-2 border-dashed border-orange-200 bg-orange-50/50 hover:bg-orange-50 transition-colors">
              <Plus className="w-4 h-4" />
            </Link>
          </div>

          {selectedCat && (
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {selectedCat.avatarUrl ? (
                    <img src={selectedCat.avatarUrl} alt={selectedCat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🐱</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 text-base">{selectedCat.name}</h4>
                  <p className="text-xs text-stone-500 mb-1">
                    橘猫 · 公 · {selectedCat.age || '?'}岁
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      selectedCat.neutered ? "bg-emerald-100 text-emerald-600" : "bg-stone-200 text-stone-500"
                    )}>
                      {selectedCat.neutered ? '已绝育' : '未绝育'}
                    </span>
                    <span className="text-orange-600 font-bold text-xs">{selectedCat.weight || '?'}kg</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {selectedCat.allergies && selectedCat.allergies.length > 0 && (
                  <div>
                    <h5 className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mb-1.5">
                      <span className="text-amber-500">⚠️</span> 过敏源/忌口
                    </h5>
                    <div className="flex gap-2 flex-wrap">
                      {selectedCat.allergies.map((item, idx) => (
                        <span key={idx} className="bg-rose-50 text-rose-500 text-[11px] px-2.5 py-1 rounded-full font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedCat.dietNeeds && selectedCat.dietNeeds.length > 0 && (
                  <div>
                    <h5 className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mb-1.5">
                      <span className="text-blue-500">💊</span> 健康需求
                    </h5>
                    <div className="flex gap-2 flex-wrap">
                      {selectedCat.dietNeeds.map((item, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-500 text-[11px] px-2.5 py-1 rounded-full font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h5 className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mb-1.5">
                    <span className="text-orange-700">🍖</span> 肉类偏好
                  </h5>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-orange-50 text-orange-600 text-[11px] px-2.5 py-1 rounded-full font-medium">鸡肉</span>
                    <span className="bg-orange-50 text-orange-600 text-[11px] px-2.5 py-1 rounded-full font-medium">猪肉</span>
                    <span className="bg-orange-50 text-orange-600 text-[11px] px-2.5 py-1 rounded-full font-medium">鸭肉</span>
                  </div>
                </div>
              </div>

              <Link 
                to={`/profile/cats/${selectedCat.id}`}
                className="mt-5 w-full bg-white border border-stone-200 text-orange-500 py-2.5 rounded-xl text-xs font-medium hover:bg-stone-50 transition-colors flex justify-center items-center gap-1"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                编辑档案
              </Link>
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-stone-50">
          <h3 className="font-bold text-stone-800 flex items-center gap-2 mb-4">
            <span className="text-stone-400">📊</span> 
            使用统计
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#FFFAF5] rounded-2xl py-4 flex flex-col items-center justify-center border border-orange-50">
              <span className="text-lg font-bold text-orange-500">6<span className="text-xs font-medium text-orange-400">份</span></span>
              <span className="text-[10px] text-stone-400 mt-1">完成食谱</span>
            </div>
            <div className="bg-blue-50/50 rounded-2xl py-4 flex flex-col items-center justify-center border border-blue-50">
              <span className="text-lg font-bold text-blue-500">8.4<span className="text-xs font-medium text-blue-400">kg</span></span>
              <span className="text-[10px] text-stone-400 mt-1">累计制作</span>
            </div>
            <div className="bg-purple-50/50 rounded-2xl py-4 flex flex-col items-center justify-center border border-purple-50">
              <span className="text-lg font-bold text-purple-600"><span className="text-xs font-medium text-purple-400">¥</span>2847</span>
              <span className="text-[10px] text-stone-400 mt-1">累计花费</span>
            </div>
          </div>
        </section>

        {/* Menu List */}
        <section className="bg-white rounded-3xl shadow-sm border border-stone-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-white hover:bg-stone-50 transition-colors border-b border-stone-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">消息通知</p>
                <p className="text-[10px] text-stone-400">临期提醒、执行提醒</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-300" />
          </div>
          <div className="flex items-center justify-between p-4 bg-white hover:bg-stone-50 transition-colors border-b border-stone-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFFAF5] text-[#FF7B4A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">数据安全</p>
                <p className="text-[10px] text-stone-400">数据备份与隐私设置</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-300" />
          </div>
          <div className="flex items-center justify-between p-4 bg-white hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">使用帮助</p>
                <p className="text-[10px] text-stone-400">常见问题、功能说明</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-300" />
          </div>
        </section>

        <button className="w-full bg-white rounded-3xl p-4 shadow-sm border border-stone-50 flex items-center justify-center gap-2 text-rose-500 font-medium hover:bg-rose-50 transition-colors">
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>
    </div>
  );
}

function CatProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const cat = isNew ? null : MOCK_CATS.find(c => c.id === id);
  
  const [avatar, setAvatar] = useState(cat?.avatarUrl || '');
  const [name, setName] = useState(cat?.name || '');
  const [age, setAge] = useState(cat?.age?.toString() || '');
  const [weight, setWeight] = useState(cat?.weight?.toString() || '');
  const [gender, setGender] = useState<'male' | 'female'>(cat?.gender || 'male');
  const [neutered, setNeutered] = useState<boolean>(cat?.neutered ?? true);
  const [allergies, setAllergies] = useState(cat?.allergies?.join(', ') || '');
  const [dietNeeds, setDietNeeds] = useState(cat?.dietNeeds?.join(', ') || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('请输入猫咪姓名');
      return;
    }
    
    const newCat = {
      id: isNew ? `c${Date.now()}` : cat!.id,
      name: name.trim(),
      age: age ? parseFloat(age) : 0,
      weight: weight ? parseFloat(weight) : 0,
      gender,
      neutered,
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
      dietNeeds: dietNeeds.split(',').map(s => s.trim()).filter(Boolean),
      avatarUrl: avatar
    };

    if (isNew) {
      MOCK_CATS.push(newCat);
    } else {
      const index = MOCK_CATS.findIndex(c => c.id === cat!.id);
      if (index !== -1) MOCK_CATS[index] = newCat;
    }
    navigate('/profile');
  };

  return (
    <div className="p-4 space-y-4 bg-stone-50 min-h-full pb-24">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/profile" className="text-stone-500 hover:text-stone-700">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">{isNew ? '添加猫咪' : '编辑档案'}</h1>
        </div>
      </header>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 overflow-hidden border-2 border-dashed border-stone-300">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Plus className="w-8 h-8" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-[#FF7B4A] text-white p-1.5 rounded-full shadow-sm">
              <Plus className="w-4 h-4" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">姓名 <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="请输入猫咪姓名" 
            className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">年龄 (岁)</label>
            <input 
              type="number" 
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="选填" 
              className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">体重 (kg)</label>
            <input 
              type="number" 
              step="0.1"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="选填" 
              className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">性别</label>
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 has-[:checked]:border-[#FF7B4A] has-[:checked]:bg-[#FFFAF5] has-[:checked]:text-emerald-700">
              <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={() => setGender('male')} className="hidden" />
              <span className="text-sm font-medium">公猫</span>
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 has-[:checked]:border-[#FF7B4A] has-[:checked]:bg-[#FFFAF5] has-[:checked]:text-emerald-700">
              <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={() => setGender('female')} className="hidden" />
              <span className="text-sm font-medium">母猫</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">绝育状态</label>
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 has-[:checked]:border-[#FF7B4A] has-[:checked]:bg-[#FFFAF5] has-[:checked]:text-emerald-700">
              <input type="radio" name="neutered" value="true" checked={neutered === true} onChange={() => setNeutered(true)} className="hidden" />
              <span className="text-sm font-medium">已绝育</span>
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 has-[:checked]:border-[#FF7B4A] has-[:checked]:bg-[#FFFAF5] has-[:checked]:text-emerald-700">
              <input type="radio" name="neutered" value="false" checked={neutered === false} onChange={() => setNeutered(false)} className="hidden" />
              <span className="text-sm font-medium">未绝育</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">过敏源及忌口</label>
          <textarea 
            rows={3}
            value={allergies}
            onChange={e => setAllergies(e.target.value)}
            placeholder="选填，例如: 牛肉、鱼类 (用逗号分隔)" 
            className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20 resize-none" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">健康需求</label>
          <textarea 
            rows={2}
            value={dietNeeds}
            onChange={e => setDietNeeds(e.target.value)}
            placeholder="选填，例如: 护肾、减脂、低磷等" 
            className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20 resize-none" 
          />
        </div>
      </div>

      <div className="fixed bottom-20 inset-x-0 max-w-md mx-auto px-4">
        <button onClick={handleSave} className="w-full bg-[#FF7B4A] text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
          <Save className="w-5 h-5" />
          保存档案
        </button>
      </div>
    </div>
  );
}

function SettingsPage() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(MOCK_USER.avatarUrl);
  const [nickname, setNickname] = useState(MOCK_USER.nickname);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    MOCK_USER.avatarUrl = avatar;
    MOCK_USER.nickname = nickname;
    navigate('/profile');
  };

  return (
    <div className="p-4 space-y-4 bg-stone-50 min-h-full pb-24">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/profile" className="text-stone-500 hover:text-stone-700">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">账号设置</h1>
        </div>
      </header>
      
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 space-y-6">
        <div className="flex flex-col items-center justify-center mb-2">
          <div className="relative cursor-pointer mb-2" onClick={() => fileInputRef.current?.click()}>
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 overflow-hidden border-2 border-dashed border-stone-300">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-[#FF7B4A] text-white p-1.5 rounded-full shadow-sm">
              <Plus className="w-4 h-4" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <p className="text-sm text-stone-500">点击修改头像</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">昵称</label>
          <input 
            type="text" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="请输入昵称" 
            className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7B4A]/20" 
          />
        </div>
      </div>

      <div className="fixed bottom-20 inset-x-0 max-w-md mx-auto px-4">
        <button onClick={handleSaveSettings} className="w-full bg-[#FF7B4A] text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
          <Save className="w-5 h-5" />
          保存设置
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <Routes>
      <Route path="/" element={<ProfileHome />} />
      <Route path="/cats/:id" element={<CatProfile />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
