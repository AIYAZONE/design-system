/*
 * @Author: HB-BruceWang
 * @Date: 2025-07-21 20:09:57
 * @LastEditors: HB-BruceWang
 * @LastEditTime: 2025-07-21 20:23:31
 * @FilePath: \jackery-design-system\remove-jackery-package.cjs
 * @Description:这是一个用于从 package-lock.json 中删除指定包及其相关依赖的脚本。
 *              它会遍历 package-lock.json 文件，删除 packages 字段中对应的包条目，
 *              并从所有依赖项（dependencies, devDependencies, optionalDependencies）中移除该包。
 *              脚本支持同时删除多个包，并在操作完成后提示用户运行 `npm install`。
 *
 * Copyright (c) 2025 by Hello Tech, All Rights Reserved.
 */

const fs = require('fs');
const path = require('path');

const packageLockPath = path.join(__dirname, 'package-lock.json');

// 日志辅助函数
const log = {
    info: (msg) => console.log(`\u001b[34m[信息]\u001b[0m ${msg}`),
    success: (msg) => console.log(`\u001b[32m[成功]\u001b[0m ${msg}`),
    warn: (msg) => console.log(`\u001b[33m[警告]\u001b[0m ${msg}`),
    error: (msg) => console.error(`\u001b[31m[错误]\u001b[0m ${msg}`),
    tip: (msg) => console.log(`\u001b[36m[提示]\u001b[0m ${msg}`),
};

function removeDependencyFromType(pkg, type, packageName, pkgKey, changedFlag) {
    if (pkg[type] && pkg[type][packageName]) {
        delete pkg[type][packageName];
        log.success(`已从 ${pkgKey === '' ? '项目根目录' : pkgKey} 的${type === 'dependencies' ? '依赖' : type === 'devDependencies' ? '开发依赖' : '可选依赖'}中删除 ${packageName}。`);
        return true;
    }
    return changedFlag;
}

async function removePackage(packageName) {
    log.info(`尝试从 package-lock.json 中删除包: ${packageName}`);

    if (!fs.existsSync(packageLockPath)) {
        log.error(`package-lock.json 文件不存在: ${packageLockPath}`);
        return;
    }

    let packageLockContent;
    try {
        packageLockContent = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
    } catch (error) {
        log.error(`读取或解析 package-lock.json 失败: ${error.message}`);
        return;
    }

    let changed = false;

    // 删除 packages 中的条目
    if (packageLockContent.packages && packageLockContent.packages[`node_modules/${packageName}`]) {
        delete packageLockContent.packages[`node_modules/${packageName}`];
        changed = true;
        log.success(`已从 package-lock.json 的 packages 中删除 ${packageName}。`);
    } else {
        log.warn(`package-lock.json 的 packages 中未找到 ${packageName}。`);
    }

    // 遍历并删除依赖项中的条目
    for (const pkgKey in packageLockContent.packages) {
        const pkg = packageLockContent.packages[pkgKey];
        changed = removeDependencyFromType(pkg, 'dependencies', packageName, pkgKey, changed);
        changed = removeDependencyFromType(pkg, 'devDependencies', packageName, pkgKey, changed);
        changed = removeDependencyFromType(pkg, 'optionalDependencies', packageName, pkgKey, changed);
    }

    if (changed) {
        try {
            fs.writeFileSync(packageLockPath, JSON.stringify(packageLockContent, null, 2), 'utf8');
            log.success(`package-lock.json 已更新。`);
            log.tip('请运行 `npm install` 重新安装依赖以确保项目依赖的正确性。');
        } catch (error) {
            log.error(`写入 package-lock.json 失败: ${error.message}`);
        }
    } else {
        log.warn(`package-lock.json 中未找到 ${packageName} 的相关条目，无需修改。`);
    }
}

async function main() {
    const args = process.argv.slice(2);

    const packageNames = [];

    for (let i = 0; i < args.length; i++) {
        packageNames.push(args[i]);
    }

    if (packageNames.length === 0) {
        log.tip('用法: node remove-jackery-package.cjs <package1> [package2 ...]');
        return;
    }

    for (const packageName of packageNames) {
        await removePackage(packageName);
    }
}

main();
