export type MeatCategory = 'red_meat' | 'white_meat' | 'fish' | 'liver' | 'heart' | 'other_organ' | 'mussel';

export interface MeatNutrient {
  id: string;
  name: string;
  category: MeatCategory;
  kcal: number; // per 100g
  protein: number; // g
  fat: number; // g
  carbohydrate: number; // g
  calcium: number; // mg
  phosphorus: number; // mg
  iron: number; // mg
  zinc: number; // mg
  taurine: number; // mg
}

export const MEAT_DATABASE: MeatNutrient[] = [
  // 猪肉系列 (red_meat)
  { id: 'm1', name: '猪里脊', category: 'red_meat', kcal: 143, protein: 21, fat: 6, carbohydrate: 0, calcium: 7, phosphorus: 230, iron: 1, zinc: 2, taurine: 40 },
  { id: 'm2', name: '猪后腿肉', category: 'red_meat', kcal: 150, protein: 20, fat: 7, carbohydrate: 0, calcium: 8, phosphorus: 210, iron: 1.1, zinc: 2.2, taurine: 40 },
  { id: 'm3', name: '猪梅花肉/前腿', category: 'red_meat', kcal: 200, protein: 17, fat: 15, carbohydrate: 0, calcium: 10, phosphorus: 190, iron: 1.2, zinc: 2.5, taurine: 40 },
  { id: 'm4', name: '猪心', category: 'heart', kcal: 118, protein: 17.3, fat: 4.8, carbohydrate: 0, calcium: 5, phosphorus: 185, iron: 4.5, zinc: 2.5, taurine: 200 },
  { id: 'm5', name: '猪肝', category: 'liver', kcal: 134, protein: 21, fat: 3.6, carbohydrate: 0, calcium: 9, phosphorus: 240, iron: 23, zinc: 6, taurine: 0 },
  { id: 'm6', name: '猪腰/肾', category: 'other_organ', kcal: 100, protein: 16, fat: 3, carbohydrate: 0, calcium: 9, phosphorus: 220, iron: 5, zinc: 2, taurine: 0 },

  // 禽肉系列：鸡 (white_meat)
  { id: 'm7', name: '鸡胸肉', category: 'white_meat', kcal: 115, protein: 23, fat: 1.5, carbohydrate: 0, calcium: 11, phosphorus: 210, iron: 0.8, zinc: 0.8, taurine: 18 },
  { id: 'm8', name: '鸡腿肉(去皮)', category: 'white_meat', kcal: 120, protein: 20, fat: 4, carbohydrate: 0, calcium: 10, phosphorus: 170, iron: 1, zinc: 1.5, taurine: 40 },
  { id: 'm9', name: '鸡腿肉(带皮)', category: 'white_meat', kcal: 210, protein: 16, fat: 15, carbohydrate: 0, calcium: 10, phosphorus: 160, iron: 0.9, zinc: 1.3, taurine: 35 },
  { id: 'm10', name: '鸡心', category: 'heart', kcal: 153, protein: 15, fat: 9, carbohydrate: 0, calcium: 15, phosphorus: 200, iron: 6, zinc: 7, taurine: 150 },
  { id: 'm11', name: '鸡肝', category: 'liver', kcal: 119, protein: 17, fat: 4.8, carbohydrate: 0, calcium: 8, phosphorus: 300, iron: 9, zinc: 3, taurine: 0 },

  // 禽肉系列：鸭 (white_meat)
  { id: 'm12', name: '鸭胸肉', category: 'white_meat', kcal: 135, protein: 19, fat: 6, carbohydrate: 0, calcium: 11, phosphorus: 190, iron: 2.5, zinc: 1.8, taurine: 50 },
  { id: 'm13', name: '鸭腿肉(去皮)', category: 'white_meat', kcal: 145, protein: 18, fat: 7, carbohydrate: 0, calcium: 11, phosphorus: 185, iron: 2.8, zinc: 2, taurine: 55 },
  { id: 'm14', name: '鸭肉(带皮)', category: 'white_meat', kcal: 210, protein: 16, fat: 15, carbohydrate: 0, calcium: 10, phosphorus: 170, iron: 2.4, zinc: 1.6, taurine: 45 },
  { id: 'm15', name: '鸭心', category: 'heart', kcal: 153, protein: 15, fat: 9, carbohydrate: 0, calcium: 12, phosphorus: 200, iron: 5.5, zinc: 6.5, taurine: 180 },
  { id: 'm16', name: '鸭肝', category: 'liver', kcal: 136, protein: 18, fat: 4.6, carbohydrate: 0, calcium: 10, phosphorus: 290, iron: 30, zinc: 3, taurine: 0 },

  // 牛肉系列 (red_meat)
  { id: 'm17', name: '牛里脊', category: 'red_meat', kcal: 140, protein: 22, fat: 7, carbohydrate: 0, calcium: 10, phosphorus: 200, iron: 2.5, zinc: 4.5, taurine: 45 },
  { id: 'm18', name: '牛后腿肉', category: 'red_meat', kcal: 135, protein: 21, fat: 5.5, carbohydrate: 0, calcium: 12, phosphorus: 205, iron: 3, zinc: 4.6, taurine: 45 },
  { id: 'm19', name: '牛上脑', category: 'red_meat', kcal: 250, protein: 19, fat: 19, carbohydrate: 0, calcium: 12, phosphorus: 190, iron: 2.5, zinc: 5, taurine: 40 },
  { id: 'm20', name: '牛肋条', category: 'red_meat', kcal: 290, protein: 18, fat: 24, carbohydrate: 0, calcium: 10, phosphorus: 180, iron: 2.2, zinc: 4.5, taurine: 35 },
  { id: 'm21', name: '牛腩', category: 'red_meat', kcal: 280, protein: 16, fat: 25, carbohydrate: 0, calcium: 10, phosphorus: 160, iron: 2, zinc: 4, taurine: 35 },
  { id: 'm22', name: '牛心', category: 'heart', kcal: 112, protein: 17, fat: 4, carbohydrate: 0, calcium: 6, phosphorus: 210, iron: 4.3, zinc: 1.7, taurine: 250 },
  { id: 'm23', name: '牛肝', category: 'liver', kcal: 135, protein: 20, fat: 3.6, carbohydrate: 0, calcium: 6, phosphorus: 380, iron: 6.5, zinc: 4, taurine: 0 },
  { id: 'm24', name: '牛脾', category: 'other_organ', kcal: 105, protein: 18, fat: 3, carbohydrate: 0, calcium: 10, phosphorus: 260, iron: 40, zinc: 2.5, taurine: 0 },

  // 鱼类与海鲜 (fish / mussel)
  { id: 'm25', name: '三文鱼/鲑鱼', category: 'fish', kcal: 208, protein: 20, fat: 13, carbohydrate: 0, calcium: 9, phosphorus: 200, iron: 0.3, zinc: 0.6, taurine: 130 },
  { id: 'm26', name: '青占鱼/鲭鱼', category: 'fish', kcal: 205, protein: 19, fat: 14, carbohydrate: 0, calcium: 12, phosphorus: 215, iron: 1, zinc: 1, taurine: 100 },
  { id: 'm27', name: '青口贝(熟)', category: 'mussel', kcal: 86, protein: 12, fat: 2, carbohydrate: 3.4, calcium: 26, phosphorus: 197, iron: 4, zinc: 1.6, taurine: 100 },

  // 羊类 (red_meat)
  { id: 'm28', name: '羊后腿肉', category: 'red_meat', kcal: 200, protein: 19, fat: 14, carbohydrate: 0, calcium: 10, phosphorus: 190, iron: 2, zinc: 3, taurine: 45 },
  { id: 'm29', name: '羊肩肉', category: 'red_meat', kcal: 280, protein: 17, fat: 23, carbohydrate: 0, calcium: 9, phosphorus: 175, iron: 1.8, zinc: 3.5, taurine: 40 },
  { id: 'm30', name: '羊心', category: 'heart', kcal: 122, protein: 16, fat: 6, carbohydrate: 0, calcium: 6, phosphorus: 195, iron: 4.8, zinc: 2.2, taurine: 220 },
  { id: 'm31', name: '羊肝', category: 'liver', kcal: 139, protein: 20, fat: 5, carbohydrate: 0, calcium: 8, phosphorus: 360, iron: 7.3, zinc: 4, taurine: 0 },

  // 兔类 (white_meat)
  { id: 'm32', name: '兔里脊', category: 'white_meat', kcal: 114, protein: 22, fat: 2.5, carbohydrate: 0, calcium: 12, phosphorus: 220, iron: 1.4, zinc: 1.5, taurine: 20 },
  { id: 'm33', name: '兔后腿肉', category: 'white_meat', kcal: 130, protein: 21, fat: 4.5, carbohydrate: 0, calcium: 14, phosphorus: 215, iron: 1.8, zinc: 1.7, taurine: 20 },
  { id: 'm34', name: '兔肋排肉', category: 'white_meat', kcal: 145, protein: 19.5, fat: 6.5, carbohydrate: 0, calcium: 15, phosphorus: 200, iron: 1.6, zinc: 1.6, taurine: 20 },
  { id: 'm35', name: '兔腹肉', category: 'white_meat', kcal: 165, protein: 18, fat: 9.5, carbohydrate: 0, calcium: 13, phosphorus: 190, iron: 1.5, zinc: 1.4, taurine: 20 },
  { id: 'm36', name: '兔心', category: 'heart', kcal: 125, protein: 16.5, fat: 5.5, carbohydrate: 0, calcium: 8, phosphorus: 195, iron: 4.5, zinc: 2, taurine: 150 },
  { id: 'm37', name: '兔肝', category: 'liver', kcal: 119, protein: 19, fat: 4, carbohydrate: 0, calcium: 10, phosphorus: 240, iron: 7.5, zinc: 3.5, taurine: 0 },
  { id: 'm38', name: '兔肾', category: 'other_organ', kcal: 105, protein: 16, fat: 3.5, carbohydrate: 0, calcium: 12, phosphorus: 230, iron: 5.5, zinc: 2.5, taurine: 0 },

  // 鹿类 (red_meat)
  { id: 'm39', name: '鹿里脊', category: 'red_meat', kcal: 115, protein: 22.5, fat: 2, carbohydrate: 0, calcium: 6, phosphorus: 210, iron: 3, zinc: 2.2, taurine: 40 },
  { id: 'm40', name: '鹿后腿', category: 'red_meat', kcal: 120, protein: 23, fat: 2.4, carbohydrate: 0, calcium: 5, phosphorus: 200, iron: 3.5, zinc: 2.5, taurine: 40 },
  { id: 'm41', name: '鹿肩/前腿', category: 'red_meat', kcal: 145, protein: 21.5, fat: 6, carbohydrate: 0, calcium: 7, phosphorus: 190, iron: 3.2, zinc: 3, taurine: 40 },
  { id: 'm42', name: '鹿脖', category: 'red_meat', kcal: 150, protein: 21, fat: 6.5, carbohydrate: 0, calcium: 8, phosphorus: 185, iron: 3.5, zinc: 3.2, taurine: 40 },
  { id: 'm43', name: '鹿肋条/腹肉', category: 'red_meat', kcal: 170, protein: 20, fat: 9, carbohydrate: 0, calcium: 8, phosphorus: 180, iron: 3, zinc: 2.8, taurine: 40 },
  { id: 'm44', name: '鹿心', category: 'heart', kcal: 118, protein: 17, fat: 4, carbohydrate: 0, calcium: 6, phosphorus: 200, iron: 5.5, zinc: 2.5, taurine: 200 },
  { id: 'm45', name: '鹿肝', category: 'liver', kcal: 136, protein: 20, fat: 4.5, carbohydrate: 0, calcium: 7, phosphorus: 350, iron: 8.5, zinc: 4.5, taurine: 0 },
];

export interface Supplement {
  id: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  type: 'calcium' | 'taurine' | 'vitamin_b' | 'vitamin_e' | 'fish_oil' | 'iodine' | 'other';
  unit: string;
  calcium: number;
  magnesium: number;
  potassium: number;
  sodium: number;
  phosphorus: number;
  iodine: number;
  vd: number;
  va: number;
  ve: number;
  vb1: number;
  vb2?: number;
  vb3?: number;
  vb5?: number;
  vb6?: number;
  vb7?: number;
  vb9?: number;
  vb12?: number;
  choline?: number;
  inositol?: number;
  paba?: number;
  manganese: number;
  taurine: number;
  iron: number;
  zinc: number;
  copper: number;
  epa_dha: number;
  epa: number;
  dha: number;
  sodium_alginate?: number;
}

export const SUPPLEMENTS: Supplement[] = [
  {
    id: 's1', name: 'NOWSFOOD 柠檬酸钙粉 (Calcium Citrate)', type: 'calcium', unit: 'g',
    calcium: 210, magnesium: 0, potassium: 0, sodium: 0, phosphorus: 0, iodine: 0, vd: 0, va: 0, ve: 0, vb1: 0, manganese: 0, taurine: 0, iron: 0, zinc: 0, copper: 0, epa_dha: 0, epa: 0, dha: 0
  },
  {
    id: 's2', name: 'NOWSFOOD 碳酸钙粉 (Calcium Carbonate)', type: 'calcium', unit: 'g',
    calcium: 353, magnesium: 0, potassium: 0, sodium: 0, phosphorus: 0, iodine: 0, vd: 0, va: 0, ve: 0, vb1: 0, manganese: 0, taurine: 0, iron: 0, zinc: 0, copper: 0, epa_dha: 0, epa: 0, dha: 0
  },
  {
    id: 's3', name: 'NF Ultra Omega-3 鱼油', type: 'fish_oil', unit: '粒',
    calcium: 0, magnesium: 0, potassium: 0, sodium: 0, phosphorus: 0, iodine: 0, vd: 0, va: 0, ve: 0, vb1: 0, manganese: 0, taurine: 0, iron: 0, zinc: 0, copper: 0, epa_dha: 750, epa: 500, dha: 250
  },
  {
    id: 's4', name: 'Viva Naturals 三倍效能鱼油', type: 'fish_oil', unit: '粒',
    calcium: 0, magnesium: 0, potassium: 0, sodium: 0, phosphorus: 0, iodine: 0, vd: 0, va: 0, ve: 0, vb1: 0, manganese: 0, taurine: 0, iron: 0, zinc: 0, copper: 0, epa_dha: 1035, epa: 750, dha: 285
  },
  {
    id: 's5', name: '双鲸VE（100mg）', type: 'vitamin_e', unit: '粒',
    calcium: 0, magnesium: 0, potassium: 0, sodium: 0, phosphorus: 0, iodine: 0, vd: 0, va: 0, ve: 100, vb1: 0, manganese: 0, taurine: 0, iron: 0, zinc: 0, copper: 0, epa_dha: 0, epa: 0, dha: 0
  },
  {
    id: 's6', name: 'NF 碘化钾 (Potassium Plus Iodine 225mcg)', type: 'iodine', unit: '片',
    calcium: 0, magnesium: 0, potassium: 99, sodium: 5, phosphorus: 0, iodine: 225, vd: 0, va: 0, ve: 0, vb1: 0, manganese: 0, taurine: 0, iron: 0, zinc: 0, copper: 0, epa_dha: 0, epa: 0, dha: 0, sodium_alginate: 100
  },
  {
    id: 's7', name: 'Nature’s Plus 复合维 B (含米糠)', type: 'vitamin_b', unit: '片',
    calcium: 0, magnesium: 0, potassium: 0, sodium: 0, phosphorus: 0, iodine: 0, vd: 0, va: 0, ve: 0, vb1: 10, vb2: 10, vb3: 50, vb6: 10, vb9: 100, vb12: 10, vb7: 20, vb5: 15, choline: 50, inositol: 50, paba: 10, manganese: 0, taurine: 0, iron: 0, zinc: 0, copper: 0, epa_dha: 0, epa: 0, dha: 0
  },
  {
    id: 's8', name: '汤普森复合维生素B', type: 'vitamin_b', unit: '片',
    calcium: 56, magnesium: 0, potassium: 0, sodium: 0, phosphorus: 0, iodine: 0, vd: 0, va: 0, ve: 0, vb1: 9.5, vb2: 10, vb3: 50, vb6: 8.2, vb9: 400, vb12: 10, vb7: 20, vb5: 13, choline: 50, inositol: 5, paba: 0, manganese: 0, taurine: 0, iron: 0, zinc: 0, copper: 0, epa_dha: 0, epa: 0, dha: 0
  },
  {
    id: 's9', name: 'NF 牛磺酸 1000mg', type: 'taurine', unit: '粒',
    calcium: 0, magnesium: 0, potassium: 0, sodium: 0, phosphorus: 0, iodine: 0, vd: 0, va: 0, ve: 100, vb1: 0, manganese: 0, taurine: 1000, iron: 0, zinc: 0, copper: 0, epa_dha: 0, epa: 0, dha: 0
  },
  {
    id: 's10', name: 'NF 牛磺酸 500mg', type: 'taurine', unit: '粒',
    calcium: 0, magnesium: 0, potassium: 0, sodium: 0, phosphorus: 0, iodine: 0, vd: 0, va: 0, ve: 100, vb1: 0, manganese: 0, taurine: 500, iron: 0, zinc: 0, copper: 0, epa_dha: 0, epa: 0, dha: 0
  },
];

export const MOCK_USER = {
  nickname: '铲屎官',
  avatarUrl: ''
};

export interface CatProfile {
  id: string;
  name: string;
  age: number;
  weight: number; // kg
  gender: 'male' | 'female';
  neutered: boolean;
  allergies: string[];
  dietNeeds: string[];
  avatarUrl?: string;
}

export const MOCK_CATS: CatProfile[] = [
  {
    id: 'c1',
    name: 'Mimi',
    age: 3,
    weight: 4.5,
    gender: 'female',
    neutered: true,
    allergies: ['牛肉'],
    dietNeeds: ['减肥', '美毛'],
  }
];

export interface InventoryItem {
  id: string;
  meatId: string;
  weight: number; // g
  price: number;
  productionDate: string;
  expiryDate: string;
  status: 'normal' | 'expiring' | 'expired' | 'out_of_stock';
}

const defaultInventory: InventoryItem[] = [
  {
    id: 'i1',
    meatId: 'm7', // 鸡胸肉
    weight: 2000,
    price: 35.5,
    productionDate: '2023-09-01',
    expiryDate: '2024-03-01',
    status: 'normal'
  },
  {
    id: 'i2',
    meatId: 'm1', // 猪里脊
    weight: 500,
    price: 28.0,
    productionDate: '2023-08-15',
    expiryDate: '2023-10-15',
    status: 'expiring'
  }
];

const savedInventory = localStorage.getItem('MOCK_INVENTORY');
export const MOCK_INVENTORY: InventoryItem[] = savedInventory ? JSON.parse(savedInventory) : defaultInventory;

export const saveInventory = () => {
  localStorage.setItem('MOCK_INVENTORY', JSON.stringify(MOCK_INVENTORY));
};

export interface RecipeIngredient {
  meatId: string;
  weight: number; // g
}

export interface RecipeSupplement {
  supplementId: string;
  amount: number; // units
}

export interface Recipe {
  id: string;
  name: string;
  catIds: string[];
  standard: 'NRC' | 'AAFCO';
  mode: 'by_need' | 'by_inventory';
  days: number;
  ingredients: RecipeIngredient[];
  supplements: RecipeSupplement[];
  createdAt: string;
  isActive: boolean;
  executedDays: number;
}

const defaultRecipes: Recipe[] = [
  {
    id: 'r1',
    name: 'Mimi的日常鸡肉餐',
    catIds: ['c1'],
    standard: 'NRC',
    mode: 'by_need',
    days: 7,
    ingredients: [
      { meatId: 'm7', weight: 500 }, // 鸡胸肉
      { meatId: 'm1', weight: 200 }, // 猪里脊
      { meatId: 'm11', weight: 50 }, // 鸡肝
      { meatId: 'm10', weight: 50 }, // 鸡心
    ],
    supplements: [
      { supplementId: 's1', amount: 3 },
      { supplementId: 's3', amount: 2 },
      { supplementId: 's7', amount: 1 },
    ],
    createdAt: '2023-10-01',
    isActive: true,
    executedDays: 3,
  }
];

const savedRecipes = localStorage.getItem('MOCK_RECIPES');
export const MOCK_RECIPES: Recipe[] = savedRecipes ? JSON.parse(savedRecipes) : defaultRecipes;

export const saveRecipes = () => {
  localStorage.setItem('MOCK_RECIPES', JSON.stringify(MOCK_RECIPES));
};
