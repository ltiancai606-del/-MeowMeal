import fs from 'fs';
import path from 'path';
const files = [
  path.join(process.cwd(), 'src/pages/Inventory.tsx'),
  path.join(process.cwd(), 'src/pages/Dashboard.tsx'),
  path.join(process.cwd(), 'src/pages/Profile.tsx'),
  path.join(process.cwd(), 'src/pages/Recipes.tsx')
];

for(const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-emerald-100 text-\[\#FF7B4A\]/g, 'bg-emerald-100 text-emerald-600');
  content = content.replace(/bg-emerald-100 text-\[\#FF7B4A\]/g, 'bg-emerald-100 text-emerald-600');
  fs.writeFileSync(file, content);
}
