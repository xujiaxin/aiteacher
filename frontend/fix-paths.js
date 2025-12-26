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
  // 对于 GitHub Pages，需要考虑 basePath /aiteacher
  // 文件路径如: out/scrm/default-panel/index.html
  // 访问路径: /aiteacher/scrm/default-panel/
  // 需要向上 3 级: ../../../
  const depth = relativePath.split(path.sep).length - 1;
  // 如果文件在子目录中，需要额外考虑 basePath 的层级
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
    // CSS 和 JS 文件（先处理 _next 路径，包括 /aiteacher/_next）
    content = content.replace(/href="\/aiteacher\/_next\//g, `href="${prefix}_next/`);
    content = content.replace(/src="\/aiteacher\/_next\//g, `src="${prefix}_next/`);
    content = content.replace(/href="\/_next\//g, `href="${prefix}_next/`);
    content = content.replace(/src="\/_next\//g, `src="${prefix}_next/`);
    
    // 公共资源（图片等）- 处理 /aiteacher/ 前缀和直接 / 开头的
    content = content.replace(/href="\/aiteacher\/([^"/]+)"/g, `href="${prefix}$1"`);
    content = content.replace(/src="\/aiteacher\/([^"/]+)"/g, `src="${prefix}$1"`);
    content = content.replace(/href="\/([^"/]+)"/g, (match, path) => {
      // 跳过已经是相对路径的或 _next
      if (path.startsWith('_next') || path.startsWith('../') || path.startsWith('./') || path.startsWith('aiteacher')) {
        return match;
      }
      return `href="${prefix}${path}"`;
    });
    content = content.replace(/src="\/([^"/]+)"/g, (match, path) => {
      if (path.startsWith('_next') || path.startsWith('../') || path.startsWith('./') || path.startsWith('aiteacher')) {
        return match;
      }
      return `src="${prefix}${path}"`;
    });
    
    // 背景图片 URL（处理普通引号和 HTML 实体编码）
    // 先处理带 /aiteacher/ 前缀的（转换为相对路径）
    content = content.replace(/url\(&#x27;\/aiteacher\/([^&#x27;)]+)&#x27;\)/g, `url('${prefix}$1')`);
    content = content.replace(/url\(['"]?\/aiteacher\/([^'")]+)['"]?\)/g, `url('${prefix}$1')`);
    
    // 处理直接以 / 开头的路径（转换为相对路径）
    content = content.replace(/url\(&#x27;\/([^&#x27;)]+)&#x27;\)/g, `url('${prefix}$1')`);
    content = content.replace(/url\(['"]?\/([^'")]+)['"]?\)/g, `url('${prefix}$1')`);
    content = content.replace(/url\(&#x22;\/([^&#x22;)]+)&#x22;\)/g, `url('${prefix}$1')`);
    
    // 特别处理 style 属性中的背景图片（HTML 实体编码）
    content = content.replace(/style="([^"]*background-image[^"]*)"/g, (match, styleContent) => {
      let fixed = styleContent.replace(/url\(&#x27;\/aiteacher\/([^&#x27;)]+)&#x27;\)/g, `url('${prefix}$1')`);
      fixed = fixed.replace(/url\(&#x27;\/([^&#x27;)]+)&#x27;\)/g, `url('${prefix}$1')`);
      return `style="${fixed}"`;
    });
    
    // 修复 style 属性中的路径
    content = content.replace(/style="([^"]*)"/g, (match, styleContent) => {
      return `style="${styleContent.replace(/url\(['"]?\/([^'")]+)['"]?\)/g, `url('${prefix}$1')`)}"`;
    });
    
    // 修复所有剩余的绝对路径（包括在脚本中的路径）
    content = content.replace(/["']\/_next\//g, `"${prefix}_next/`);
    content = content.replace(/["']\/([a-zA-Z][^"']*)/g, (match, path) => {
      // 跳过已经是相对路径的
      if (path.startsWith('_next') || path.startsWith('../') || path.startsWith('./')) {
        return match;
      }
      return match.replace(`/${path}`, `${prefix}${path}`);
    });
    
    // 修复 favicon
    content = content.replace(/href="\/favicon/g, `href="${prefix}favicon`);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed paths in: ${filePath}`);
  });
  
  console.log(`\n✅ Fixed ${htmlFiles.length} HTML files`);
}

fixPaths();

