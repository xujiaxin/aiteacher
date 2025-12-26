const fs = require('fs');
const path = require('path');

// 递归查找所有 HTML 文件
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// 计算相对路径深度
function getRelativeDepth(filePath) {
  const relativePath = path.relative('out', filePath);
  const depth = relativePath.split(path.sep).length - 1;
  return depth;
}

// 修复 HTML 文件中的路径
function fixPaths() {
  const outDir = path.join(__dirname, 'out');
  const htmlFiles = findHtmlFiles(outDir);
  
  htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const depth = getRelativeDepth(filePath);
    const prefix = '../'.repeat(depth) || './';
    
    // 修复各种资源路径
    // CSS 和 JS 文件
    content = content.replace(/href="\/_next\//g, `href="${prefix}_next/`);
    content = content.replace(/src="\/_next\//g, `src="${prefix}_next/`);
    
    // 公共资源（图片等）
    content = content.replace(/href="\/([^/])/g, `href="${prefix}$1`);
    content = content.replace(/src="\/([^/])/g, `src="${prefix}$1`);
    
    // 背景图片 URL（处理普通引号和 HTML 实体编码）
    content = content.replace(/url\(['"]?\/([^'")]+)['"]?\)/g, `url('${prefix}$1')`);
    // 处理 HTML 实体编码的单引号 &#x27; - 需要先处理这个
    content = content.replace(/url\(&#x27;\/([^&#x27;)]+)&#x27;\)/g, `url('${prefix}$1')`);
    content = content.replace(/url\(&#x22;\/([^&#x22;)]+)&#x22;\)/g, `url('${prefix}$1')`);
    
    // 修复所有剩余的绝对路径（包括在脚本中的路径）
    content = content.replace(/["']\/_next\//g, `"${prefix}_next/`);
    content = content.replace(/["']\/([a-zA-Z])/g, `"${prefix}$1`);
    
    // 修复 favicon
    content = content.replace(/href="\/favicon/g, `href="${prefix}favicon`);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed paths in: ${filePath}`);
  });
  
  console.log(`\n✅ Fixed ${htmlFiles.length} HTML files`);
}

fixPaths();

