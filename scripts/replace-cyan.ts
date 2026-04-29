import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src/pages/Nutrition.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-cyan-500/g, 'bg-[#FF7B4A]');
content = content.replace(/text-cyan-600/g, 'text-[#FF7B4A]');
content = content.replace(/text-cyan-700/g, 'text-[#FF7B4A]');
content = content.replace(/bg-cyan-50/g, 'bg-[#FFFAF5] border border-orange-100');
content = content.replace(/focus:ring-cyan-500/g, 'focus:ring-[#FF7B4A]/20');

fs.writeFileSync(file, content);
console.log('done replacing in nutrition');
