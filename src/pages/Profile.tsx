import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronRight, Plus, Save } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { MOCK_CATS, MOCK_USER } from '../data/mock';

function ProfileHome() {
  return (
    <div className="p-4 space-y-4 bg-stone-50 min-h-full">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-900">个人中心</h1>
        <Link to="/profile/settings" className="p-2 text-stone-400 hover:text-stone-600">
          <Settings className="w-5 h-5" />
        </Link>
      </header>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 overflow-hidden">
          {MOCK_USER.avatarUrl ? (
            <img src={MOCK_USER.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-stone-800">{MOCK_USER.nickname}</h2>
          <p className="text-sm text-stone-500">ID: 888888</p>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-stone-800">多猫咪档案</h3>
          <Link to="/profile/cats/new" className="text-emerald-600 text-sm font-medium flex items-center gap-1">
            <Plus className="w-4 h-4" /> 添加
          </Link>
        </div>
        
        {MOCK_CATS.map(cat => (
          <Link 
            key={cat.id} 
            to={`/profile/cats/${cat.id}`}
            className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center justify-between hover:border-emerald-200 transition-colors"
          >
            <div className="flex items-center gap-4">
              {cat.avatarUrl ? (
                <img src={cat.avatarUrl} alt={cat.name} className="w-12 h-12 rounded-full object-cover border border-stone-200" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base border border-emerald-200">
                  {cat.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="font-semibold text-stone-800">{cat.name}</h4>
                <p className="text-xs text-stone-500">
                  {cat.age || '?'}岁 · {cat.weight || '?'}kg · {cat.gender === 'male' ? '公' : '母'}{cat.neutered ? '(已绝育)' : ''}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400" />
          </Link>
        ))}
      </section>

      <section className="mt-8">
        <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center justify-center gap-2 text-red-500 font-medium hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </section>
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
            <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full shadow-sm">
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
            className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" 
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
              className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" 
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
              className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">性别</label>
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 has-[:checked]:text-emerald-700">
              <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={() => setGender('male')} className="hidden" />
              <span className="text-sm font-medium">公猫</span>
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 has-[:checked]:text-emerald-700">
              <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={() => setGender('female')} className="hidden" />
              <span className="text-sm font-medium">母猫</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">绝育状态</label>
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 has-[:checked]:text-emerald-700">
              <input type="radio" name="neutered" value="true" checked={neutered === true} onChange={() => setNeutered(true)} className="hidden" />
              <span className="text-sm font-medium">已绝育</span>
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 has-[:checked]:text-emerald-700">
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
            className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">健康需求</label>
          <textarea 
            rows={2}
            value={dietNeeds}
            onChange={e => setDietNeeds(e.target.value)}
            placeholder="选填，例如: 护肾、减脂、低磷等" 
            className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
          />
        </div>
      </div>

      <div className="fixed bottom-20 left-0 w-full px-4 max-w-md mx-auto">
        <button onClick={handleSave} className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
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
            <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full shadow-sm">
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
            className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" 
          />
        </div>
      </div>

      <div className="fixed bottom-20 left-0 w-full px-4 max-w-md mx-auto">
        <button onClick={handleSaveSettings} className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
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
