import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return groups.flat();
}

const codeFiles = (await walk(path.join(root, 'src'))).filter(file => /\.(tsx?|jsx?|css)$/.test(file));
codeFiles.push(path.join(root, 'index.html'));
const code = await Promise.all(codeFiles.map(async file => ({ file, content: await fs.readFile(file, 'utf8') })));
const assets = (await walk(path.join(root, 'public/assets'))).filter(file => /\.(png|jpe?g)$/i.test(file));
const results = [];
const generatedUrls = new Set();

for (const input of assets) {
  const url = '/' + path.relative(path.join(root, 'public'), input).split(path.sep).join('/');
  const outputUrl = url.replace(/\.(png|jpe?g)$/i, '.webp');
  if (generatedUrls.has(outputUrl)) continue;
  // Service character URLs are assembled from the service ID at runtime.
  const dynamic = url.startsWith('/assets/characters/services/');
  if (!dynamic && !code.some(source => source.content.includes(url) || source.content.includes(outputUrl))) continue;
  generatedUrls.add(outputUrl);
  const output = input.replace(/\.(png|jpe?g)$/i, '.webp');
  const size = url.includes('/brand/') ? 240 : url.includes('/characters/') ? 720 : url.includes('/hairstyles/') ? 768 : url.includes('/products/') ? 800 : url.includes('/team/') ? 400 : url.includes('/location/') ? 1600 : 1920;
  await sharp(input).rotate().resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: url.includes('/brand/') ? 90 : 80, alphaQuality: 95, effort: 6 }).toFile(output);
  const [before, after, metadata] = await Promise.all([fs.stat(input), fs.stat(output), sharp(output).metadata()]);
  results.push({ source: url, output: outputUrl, before: before.size, after: after.size, width: metadata.width, height: metadata.height, alpha: metadata.hasAlpha });
  for (const source of code) source.content = source.content.replaceAll(url, outputUrl);
}

for (const source of code) {
  source.content = source.content.replace('/assets/characters/services/${visual.image}.png', '/assets/characters/services/${visual.image}.webp');
  await fs.writeFile(source.file, source.content);
}
await fs.mkdir(path.join(root, 'reports'), { recursive: true });
await fs.writeFile(path.join(root, 'reports/image-optimization.json'), JSON.stringify(results, null, 2) + '\n');
const before = results.reduce((sum, item) => sum + item.before, 0);
const after = results.reduce((sum, item) => sum + item.after, 0);
console.log(JSON.stringify({ images: results.length, beforeBytes: before, afterBytes: after, reduction: `${((1 - after / before) * 100).toFixed(1)}%` }));
for (const image of results) console.log(`${image.output}: ${Math.round(image.before / 1024)} KB -> ${Math.round(image.after / 1024)} KB`);
