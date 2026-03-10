import xlsx from 'xlsx';
import * as fs from 'fs';
import * as https from 'https';

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function main() {
  await download('https://raw.githubusercontent.com/ltiancai606-del/MeowMeal/main/MeowMeal-Common%20Nutritional%20Elements%20in%20Meat.xlsx', 'meat.xlsx');
  await download('https://raw.githubusercontent.com/ltiancai606-del/MeowMeal/main/MeowMeal-Nutritional%20element%20standards%20%20NRC%2BAAFCO.xlsx', 'standards.xlsx');

  const meatWorkbook = xlsx.readFile('meat.xlsx');
  const meatData = xlsx.utils.sheet_to_json(meatWorkbook.Sheets[meatWorkbook.SheetNames[0]]);
  fs.writeFileSync('meat.json', JSON.stringify(meatData, null, 2));

  const standardsWorkbook = xlsx.readFile('standards.xlsx');
  const standardsData = xlsx.utils.sheet_to_json(standardsWorkbook.Sheets[standardsWorkbook.SheetNames[0]]);
  fs.writeFileSync('standards.json', JSON.stringify(standardsData, null, 2));
}

main().catch(console.error);
