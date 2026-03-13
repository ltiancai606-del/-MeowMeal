import fs from 'fs';

async function main() {
  const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSd3xNsjqRBou0WH6t_SedhGgnsHVWKMWRcsnRIkZQN2vDpNuV6yTFeckX9gZU2h6HeZlUHc1g-4r_M/pub?output=csv');
  const csv = await response.text();
  const lines = csv.split('\n').map(line => line.trim()).filter(line => line);

  let currentCategory = '';
  const items: any[] = [];
  let idCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('部位/器官分类') || line.includes('部位 (分类)')) {
      if (line.includes('猪肉')) currentCategory = 'red_meat';
      else if (line.includes('鸡')) currentCategory = 'white_meat';
      else if (line.includes('鸭')) currentCategory = 'white_meat';
      else if (line.includes('牛肉')) currentCategory = 'red_meat';
      else if (line.includes('鱼类')) currentCategory = 'fish';
      else if (line.includes('羊类')) currentCategory = 'red_meat';
      else if (line.includes('兔类')) currentCategory = 'white_meat';
      else if (line.includes('鹿类')) currentCategory = 'red_meat';
      continue;
    }
    
    const cols = line.split(',');
    if (cols.length < 24) continue;
    
    const nameRaw = cols[1];
    if (!nameRaw) continue;
    
    let name = nameRaw.split('(')[0].trim();
    let category = currentCategory;
    
    if (nameRaw.includes('肝脏类') || name.includes('肝')) category = 'liver';
    else if (nameRaw.includes('富牛磺酸肌肉') || name.includes('心')) category = 'heart';
    else if (nameRaw.includes('其他分泌腺') || name.includes('肾') || name.includes('腰') || name.includes('睾丸') || name.includes('脾')) category = 'other_organ';
    else if (name.includes('青口贝')) category = 'mussel';
    
    const parseNum = (val: string) => {
      const n = parseFloat(val);
      return isNaN(n) ? 0 : n;
    };
    
    items.push({
      id: `m${idCounter++}`,
      name,
      category,
      kcal: parseNum(cols[2]),
      protein: parseNum(cols[3]),
      carbohydrate: parseNum(cols[4]),
      fat: parseNum(cols[5]),
      moisture: parseNum(cols[6]),
      calcium: parseNum(cols[7]),
      phosphorus: parseNum(cols[8]),
      iron: parseNum(cols[9]),
      zinc: parseNum(cols[10]),
      taurine: parseNum(cols[11]),
      choline: parseNum(cols[12]),
      iodine: parseNum(cols[13]),
      copper: parseNum(cols[14]),
      manganese: parseNum(cols[15]),
      magnesium: parseNum(cols[16]),
      sodium: parseNum(cols[17]),
      vb1: parseNum(cols[18]),
      ve: parseNum(cols[19]),
      epa: parseNum(cols[20]),
      dha: parseNum(cols[21]),
      epa_dha: parseNum(cols[22]),
      va: parseNum(cols[23]),
      vd: parseNum(cols[24]),
    });
  }

  const mockTsPath = 'src/data/mock.ts';
  let mockTs = fs.readFileSync(mockTsPath, 'utf-8');

  // Update MeatNutrient interface
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
}`;

  mockTs = mockTs.replace(/export interface MeatNutrient \{[\s\S]*?\}/, newInterface);

  // Update MEAT_DATABASE
  const newDatabase = `export const MEAT_DATABASE: MeatNutrient[] = ${JSON.stringify(items, null, 2)};`;
  mockTs = mockTs.replace(/export const MEAT_DATABASE: MeatNutrient\[\] = \[[\s\S]*?\];/, newDatabase);

  fs.writeFileSync(mockTsPath, mockTs);
}

main();
