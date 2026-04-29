import fs from 'fs';
const f = 'src/pages/Recipes.tsx';
let txt = fs.readFileSync(f, 'utf8');
txt = txt.replace(/<div className="bg-\[\#FF7B4A\] h-2" style={{ width: \`\$\{100 - proteinDisplay - fatDisplay\}%\` }}><\/div>/, '<div className="bg-emerald-500 h-2" style={{ width: \`${100 - proteinDisplay - fatDisplay}%\` }}></div>');
txt = txt.replace(/<span className="w-1.5 h-1.5 rounded-full bg-\[\#FF7B4A\]"><\/span>碳水/, '<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>碳水');
fs.writeFileSync(f, txt);
