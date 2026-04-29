import fs from 'fs';
import path from 'path';

const files = [
  path.join(process.cwd(), 'src/pages/Inventory.tsx'),
  path.join(process.cwd(), 'src/pages/Dashboard.tsx'),
  path.join(process.cwd(), 'src/pages/Profile.tsx')
];

for(const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/bg-emerald-50 text-emerald-600/g, 'bg-[#FFFAF5] text-[#FF7B4A] border border-orange-100');
  content = content.replace(/text-emerald-500/g, 'text-[#FF7B4A]');
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
  content = content.replace(/text-\[\#FF7B4A\] bg-\[\#FFFAF5\] font-medium/g, 'text-[#FF7B4A] bg-[#FFFAF5] font-medium border border-orange-100');

  // specific checkmarks or normal item statuses in Inventory list
  // actually Inventory List normal status uses emerald, maybe we should keep normal status as green.
  // Wait, the status `正常` is border-emerald-200 text-emerald-500 -> text-[#FF7B4A]. 
  // Let's rely on standard Tailwind emerald for success states if we need to. But for main color action we want Orange.

  fs.writeFileSync(file, content);
}
console.log('done replacing');
