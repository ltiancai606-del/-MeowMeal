import fs from 'fs';
const f = 'src/pages/Recipes.tsx';
fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/bg-\[\#FFFAF5\]0/g, 'bg-[#FF7B4A]'));
