import fs from 'fs';
const f = 'src/pages/Inventory.tsx';
let txt = fs.readFileSync(f, 'utf8');

txt = txt.replace(/hover:text-emerald-700/g, 'hover:text-orange-600');
txt = txt.replace(/text-emerald-700/g, 'text-orange-600');
txt = txt.replace(/bg-emerald-50 text-emerald-600/g, 'bg-[#FFFAF5] text-[#FF7B4A]');
txt = txt.replace(/bg-emerald-600/g, 'bg-[#FF7B4A]');
txt = txt.replace(/hover:bg-emerald-700/g, 'hover:bg-orange-600');

fs.writeFileSync(f, txt);
