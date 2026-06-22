#!/usr/bin/env node

if (process.env.SKIP_ROOT_GUARD === "1") {
  process.exit(0);
}

const path = require('node:path')

const workspaceRoot = path.resolve(__dirname, '..') // repo root
const initCwd = process.env.INIT_CWD ? path.resolve(process.env.INIT_CWD) : process.cwd()

console.log("[debug] workspaceRoot:", workspaceRoot);
console.log("[debug] initCwd:", initCwd);

function isInside(dir, parent) {
  const rel = path.relative(parent, dir)
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel)
}

const insideApps = isInside(initCwd, path.join(workspaceRoot, 'apps'))
const insidePackages = isInside(initCwd, path.join(workspaceRoot, 'packages'))

if (insideApps || insidePackages) {
  console.error('\n pnpm install은 workspace 루트에서만 실행하세요.\n')
  console.error(`- 지금 위치: ${initCwd}`)
  console.error(`- 루트 위치: ${workspaceRoot}\n`)
  console.error('올바른 방법:')
  console.error(`  cd ${workspaceRoot}`)
  console.error('  pnpm -w install\n')
  console.error(`  각각 앱에 패키지를 설치하고 싶다면 ${workspaceRoot}에서\n`)
  console.error('  pnpm -w add [패키지명] --filter [설치위치(apps안의 폴더명)]\n')
  process.exit(1)
}
