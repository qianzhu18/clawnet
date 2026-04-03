import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

const requiredDirs = [
  "doc/commands",
  "doc/design",
  "doc/design/标准文档",
  "doc/design/概要细节",
  "doc/design/原型细节",
  "doc/history",
  "doc/fixes",
];

const requiredFiles = [
  "AGENTS.md",
  "doc/README.md",
  "doc/commands/README.md",
  "doc/commands/Markdown工作台.md",
  "doc/design/README.md",
  "doc/design/标准文档/1-需求分析.md",
  "doc/design/标准文档/2-概要设计.md",
  "doc/design/标准文档/3-产品原型设计.md",
  "doc/design/标准文档/4-详细设计.md",
  "doc/design/标准文档/5-开发.md",
  "doc/design/标准文档/6-测试.md",
  "doc/design/标准文档/7-迭代.md",
  "doc/design/概要细节/README.md",
  "doc/design/原型细节/README.md",
];

const contentChecks = [
  {
    file: "doc/README.md",
    includes: ["commands/Markdown工作台.md", "localhost:3000/prototype"],
  },
  {
    file: "doc/commands/README.md",
    includes: ["Markdown工作台.md", "doc:check"],
  },
  {
    file: "doc/commands/测试操作.md",
    includes: ["npm run doc:check"],
  },
  {
    file: "doc/design/标准文档/3-产品原型设计.md",
    includes: ["/prototype", "/validation", "当前阅读下一步"],
  },
  {
    file: "doc/design/标准文档/6-测试.md",
    includes: ["/prototype", "/validation"],
  },
];

const errors = [];
const markdownFiles = [];
const activeMarkdownRoots = ["doc/commands", "doc/design"];

function exists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function walkMarkdown(dirRelativePath) {
  const dirPath = path.join(rootDir, dirRelativePath);
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(rootDir, fullPath);

    if (entry.isDirectory()) {
      walkMarkdown(relativePath);
      continue;
    }

    if (entry.isFile() && relativePath.endsWith(".md")) {
      markdownFiles.push(relativePath);
    }
  }
}

function resolveLinkTarget(filePath, target) {
  const normalizedTarget = decodeURI(target.split("#")[0]);
  if (!normalizedTarget) {
    return null;
  }

  if (normalizedTarget.startsWith("/")) {
    return path.join(rootDir, normalizedTarget.slice(1));
  }

  return path.resolve(path.dirname(path.join(rootDir, filePath)), normalizedTarget);
}

for (const dir of requiredDirs) {
  if (!exists(dir)) {
    errors.push(`缺少目录: ${dir}`);
  }
}

for (const file of requiredFiles) {
  if (!exists(file)) {
    errors.push(`缺少文件: ${file}`);
  }
}

for (const check of contentChecks) {
  if (!exists(check.file)) {
    continue;
  }

  const content = fs.readFileSync(path.join(rootDir, check.file), "utf8");
  for (const token of check.includes) {
    if (!content.includes(token)) {
      errors.push(`文件缺少关键内容: ${check.file} -> ${token}`);
    }
  }
}

for (const dir of activeMarkdownRoots) {
  if (exists(dir)) {
    walkMarkdown(dir);
  }
}

if (exists("AGENTS.md")) {
  markdownFiles.push("AGENTS.md");
}

const localLinkPattern = /\[[^\]]+\]\((?!https?:\/\/|mailto:|#)([^)]+)\)/g;

for (const file of markdownFiles) {
  const content = fs.readFileSync(path.join(rootDir, file), "utf8");
  let match;

  while ((match = localLinkPattern.exec(content)) !== null) {
    const target = match[1].trim();

    if (!target || target.startsWith("<")) {
      continue;
    }

    const resolvedPath = resolveLinkTarget(file, target);
    if (resolvedPath && !fs.existsSync(resolvedPath)) {
      errors.push(`无效链接: ${file} -> ${target}`);
    }
  }
}

if (errors.length > 0) {
  console.error("doc workspace check failed\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("doc workspace check passed");
console.log(`- checked markdown files: ${markdownFiles.length}`);
console.log(`- checked roots: ${activeMarkdownRoots.join(", ")}`);
console.log(`- required dirs: ${requiredDirs.length}`);
console.log(`- required files: ${requiredFiles.length}`);
