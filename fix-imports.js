const fs = require('fs');
const path = require('path');

function getRelativePrefix(filePath) {
  const rootDir = __dirname;
  const fileDir = path.dirname(filePath);
  const relativeToRoot = path.relative(fileDir, rootDir);
  return relativeToRoot === '' ? './' : relativeToRoot + '/';
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        processDirectory(fullPath);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const prefix = getRelativePrefix(fullPath);
      // Replace from "./" to prefix
      const newContent = content.replace(/(["'])@\//g, `$1${prefix.replace(/\\/g, '/')}`);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(__dirname);
