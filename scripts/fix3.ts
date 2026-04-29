import fs from 'fs';
const f = 'src/pages/Inventory.tsx';
let txt = fs.readFileSync(f, 'utf8');

// Fix Normal button tab
txt = txt.replace(/<span className=\{cn\("text-xl font-bold mb-0\.5", activeTab !== 'normal' && "text-\[\#FF7B4A\]"\)\}>\{normalItems\.length\}<\/span>/g, '<span className={cn("text-xl font-bold mb-0.5", activeTab !== \'normal\' && "text-emerald-500")}>{normalItems.length}</span>');
txt = txt.replace(/<span className=\{cn\("text-\[10px\] font-medium", activeTab !== 'normal' && "text-\[\#FF7B4A\]"\)\}>正常<\/span>/g, '<span className={cn("text-[10px] font-medium", activeTab !== \'normal\' && "text-emerald-500")}>正常</span>');

// Fix Normal item status
txt = txt.replace(/statusTag = <span className="text-\[10px\] border border-emerald-200 text-\[\#FF7B4A\] px-1\.5 py-0\.5 rounded font-medium">正常<\/span>;/, 'statusTag = <span className="text-[10px] border border-emerald-200 text-emerald-500 px-1.5 py-0.5 rounded font-medium">正常</span>;');

// Fix iconBg / iconDot for Normal
txt = txt.replace(/iconBg = "bg-\[\#FFFAF5\]";\n            iconDot = "bg-\[\#FF7B4A\]";/g, 'iconBg = "bg-emerald-50";\n            iconDot = "bg-emerald-500";');

fs.writeFileSync(f, txt);
