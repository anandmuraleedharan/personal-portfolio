const fs = require('fs');
const path = require('path');
const readline = require('readline');

const csvPath = path.join(__dirname, 'tmp_olam.csv');
const outDir = path.join(__dirname, 'app/api/lipi/dictionary/data');

// Create output directory if it doesn't exist
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const partitions = {};

// Initialize partitions for 'a' to 'z' and 'other'
for (let i = 97; i <= 122; i++) {
  partitions[String.fromCharCode(i)] = Object.create(null);
}
partitions['other'] = Object.create(null);

console.log('Parsing TSV file...');
if (!fs.existsSync(csvPath)) {
  console.error(`Error: Raw database file not found at ${csvPath}. Please download it first.`);
  process.exit(1);
}

const fileStream = fs.createReadStream(csvPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let lineCount = 0;
let wordCount = 0;

rl.on('line', (line) => {
  lineCount++;
  // Skip headers/comments
  if (line.startsWith('#') || !line.trim()) return;

  const parts = line.split('\t');
  if (parts.length < 4) return;

  const englishWord = parts[1].trim();
  const partOfSpeech = parts[2].trim() || '-';
  const malayalamDefinition = parts[3].trim();

  if (!englishWord || !malayalamDefinition) return;

  const cleanWord = englishWord.toLowerCase();
  const firstChar = cleanWord.charAt(0);
  
  // Decide partition key
  let key = 'other';
  if (firstChar >= 'a' && firstChar <= 'z') {
    key = firstChar;
  }

  if (!partitions[key][cleanWord]) {
    partitions[key][cleanWord] = {
      word: englishWord,
      definitions: {}
    };
    wordCount++;
  }

  if (!partitions[key][cleanWord].definitions[partOfSpeech]) {
    partitions[key][cleanWord].definitions[partOfSpeech] = [];
  }
  
  // Add definition if not already present
  if (!partitions[key][cleanWord].definitions[partOfSpeech].includes(malayalamDefinition)) {
    partitions[key][cleanWord].definitions[partOfSpeech].push(malayalamDefinition);
  }
});

rl.on('close', () => {
  console.log(`Finished reading. Total lines: ${lineCount}. Unique words: ${wordCount}`);
  console.log('Writing partitioned JSON files...');

  let totalSaved = 0;
  for (const [key, data] of Object.entries(partitions)) {
    const filePath = path.join(outDir, `${key}.json`);
    const size = Object.keys(data).length;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Saved ${key}.json with ${size} words.`);
    totalSaved += size;
  }

  console.log(`Dictionary compilation complete! Total words saved: ${totalSaved}`);
});
