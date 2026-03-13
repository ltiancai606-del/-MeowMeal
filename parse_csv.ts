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
      continue;
    }
    
    const cols = line.split(',');
    if (cols.length < 24) continue;
    
    const nameRaw = cols[1];
    if (!nameRaw) continue;
    
    let name = nameRaw.split('(')[0].trim();
    let category = currentCategory;
    
    if (nameRaw.includes('肝脏类')) category = 'liver';
    else if (nameRaw.includes('富牛磺酸肌肉')) category = 'heart';
    else if (nameRaw.includes('其他分泌腺')) category = 'other_organ';
    else if (nameRaw.includes('猪睾丸')) category = 'other_organ';
    
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

  fs.writeFileSync('new_meats.json', JSON.stringify(items, null, 2));
}

main();
