import fs from 'fs';

async function generate() {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSd3xNsjqRBou0WH6t_SedhGgnsHVWKMWRcsnRIkZQN2vDpNuV6yTFeckX9gZU2h6HeZlUHc1g-4r_M/pub?output=csv';
  const response = await fetch(url);
  const csvText = await response.text();

  function getCategory(name: string) {
    if (name.includes('肝')) return 'liver';
    if (name.includes('心')) return 'heart';
    if (name.includes('肾') || name.includes('腰') || name.includes('脾') || name.includes('睾丸') || name.includes('胗')) return 'other_organ';
    if (name.includes('三文鱼') || name.includes('青占鱼') || name.includes('马鲛鱼')) return 'fish';
    if (name.includes('青口贝')) return 'mussel';
    if (name.includes('鸡') || name.includes('鸭') || name.includes('兔')) return 'white_meat';
    return 'red_meat';
  }

  const lines = csvText.trim().split('\n');
  const result = [];
  let index = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith(',,,') || line.includes('部位/器官分类') || line.includes('部位 (分类)') || line.startsWith('以下数据均基于')) {
      continue;
    }
    
    const parts = line.split(',');
    if (parts.length < 30 || !parts[1]) continue;

    const nameParts = parts[1].split(' ');
    const name = nameParts[0];
    
    result.push({
      id: 'm' + (index + 1),
      name: name,
      category: getCategory(name),
      kcal: Number(parts[2]) || 0,
      protein: Number(parts[3]) || 0,
      carbohydrate: Number(parts[4]) || 0,
      fat: Number(parts[5]) || 0,
      moisture: Number(parts[6]) || 0,
      calcium: Number(parts[7]) || 0,
      phosphorus: Number(parts[8]) || 0,
      iron: Number(parts[9]) || 0,
      zinc: Number(parts[10]) || 0,
      taurine: Number(parts[11]) || 0,
      choline: Number(parts[12]) || 0,
      iodine: Number(parts[13]) || 0,
      copper: Number(parts[14]) || 0,
      manganese: Number(parts[15]) || 0,
      magnesium: Number(parts[16]) || 0,
      sodium: Number(parts[17]) || 0,
      vb1: Number(parts[18]) || 0,
      ve: Number(parts[19]) || 0,
      epa: Number(parts[20]) || 0,
      dha: Number(parts[21]) || 0,
      epa_dha: Number(parts[22]) || 0,
      va: Number(parts[23]) || 0,
      vd: Number(parts[24]) || 0,
      potassium: Number(parts[25]) || 0,
      vb2: Number(parts[26]) || 0,
      vb3: Number(parts[27]) || 0,
      vb5: Number(parts[28]) || 0,
      vb6: Number(parts[29]) || 0,
      vb7: Number(parts[30]) || 0,
      vb9: Number(parts[31]) || 0,
      vb12: Number(parts[32]) || 0
    });
    index++;
  }

  const mockTsPath = 'src/data/mock.ts';
  let mockTsContent = fs.readFileSync(mockTsPath, 'utf8');

  // Update interface
  const interfaceRegex = /export interface MeatNutrient \{[\s\S]*?\}/;
  const newInterface = `export interface MeatNutrient {
  id: string;
  name: string;
  category: MeatCategory;
  kcal: number; // per 100g
  protein: number; // g
  fat: number; // g
  carbohydrate: number; // g
  moisture?: number; // g
  calcium: number; // mg
  phosphorus: number; // mg
  iron: number; // mg
  zinc: number; // mg
  taurine: number; // mg
  choline?: number; // mg
  iodine?: number; // mg
  copper?: number; // mg
  manganese?: number; // mg
  magnesium?: number; // mg
  sodium?: number; // mg
  vb1?: number; // mg
  ve?: number; // mg
  epa?: number; // mg
  dha?: number; // mg
  epa_dha?: number; // mg
  va?: number; // IU
  vd?: number; // IU
  potassium?: number; // mg
  vb2?: number; // mg
  vb3?: number; // mg
  vb5?: number; // mg
  vb6?: number; // mg
  vb7?: number; // μg
  vb9?: number; // μg
  vb12?: number; // μg
}`;
  mockTsContent = mockTsContent.replace(interfaceRegex, newInterface);

  // Update MEAT_DATABASE
  const dbRegex = /export const MEAT_DATABASE: MeatNutrient\[\] = \[([\s\S]*?)\];/;
  const newDb = `export const MEAT_DATABASE: MeatNutrient[] = \n` + JSON.stringify(result, null, 2) + `;`;
  mockTsContent = mockTsContent.replace(dbRegex, newDb);

  fs.writeFileSync(mockTsPath, mockTsContent);
  console.log('Updated mock.ts with ' + result.length + ' entries.');
}

generate().catch(console.error);
