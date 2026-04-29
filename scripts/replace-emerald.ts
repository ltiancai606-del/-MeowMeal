import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src/pages/Recipes.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replacements
content = content.replace(/bg-emerald-50 text-emerald-600/g, 'bg-[#FFFAF5] text-[#FF7B4A] border border-orange-100');
content = content.replace(/text-emerald-500/g, 'text-[#FF7B4A]');
// leave 304, 309 bg-emerald-500 out, wait they will be replaced. Let's be manual for others
content = content.replace(/focus:ring-emerald-500/g, 'focus:ring-[#FF7B4A]/20');
content = content.replace(/bg-emerald-600/g, 'bg-[#FF7B4A]');
content = content.replace(/hover:bg-emerald-700/g, 'hover:bg-orange-600');
content = content.replace(/bg-emerald-100 text-emerald-700/g, 'bg-[#FFFAF5] text-[#FF7B4A] border border-orange-100');
content = content.replace(/text-emerald-600/g, 'text-[#FF7B4A]');
content = content.replace(/border-emerald-500/g, 'border-[#FF7B4A]');
content = content.replace(/border-emerald-600/g, 'border-[#FF7B4A]');
content = content.replace(/focus:border-emerald-500/g, 'focus:border-[#FF7B4A]');
content = content.replace(/hover:border-emerald-500/g, 'hover:border-[#FF7B4A]');
content = content.replace(/bg-emerald-50/g, 'bg-[#FFFAF5]');
content = content.replace(/hover:bg-emerald-100/g, 'hover:bg-orange-100');
content = content.replace(/bg-emerald-100 text-emerald-600/g, 'bg-emerald-100 text-emerald-600'); // keep this one
content = content.replace(/text-\[\#FF7B4A\] bg-\[\#FFFAF5\] font-medium/g, 'text-[#FF7B4A] bg-[#FFFAF5] font-medium border border-orange-100');

// specifically for 1621, 1626
content = content.replace(/bg-emerald-500/g, 'bg-[#FF7B4A]');

// To prevent messing up the checkmarks that were bg-emerald-100 text-[#FF7B4A] (after text-emerald-600 got replaced):
content = content.replace(/bg-emerald-100 text-\[\#FF7B4A\]/g, 'bg-emerald-100 text-emerald-600');

fs.writeFileSync(file, content);
console.log('done replacing');
