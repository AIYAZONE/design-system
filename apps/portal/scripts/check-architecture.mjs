import ts from 'typescript';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const directory = await mkdtemp(join(tmpdir(), 'zds-architecture-'));
try {
  const source = await readFile(new URL('../src/architecture-data.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  const file = join(directory, 'architecture.mjs');
  await writeFile(file, `const __ZONE_VERSION__ = 'validation';\n${compiled.outputText}`);
  const data = await import(pathToFileURL(file));
  const collections = ['layers', 'modules', 'features', 'relations', 'contracts', 'dataAssets',
    'deployments', 'evidence', 'scenarios', 'validationItems', 'architectureGaps', 'externalNodes'];
  for (const name of collections) assert.ok(Array.isArray(data[name]), `缺少统一数据集合：${name}`);
  const index = Object.fromEntries(collections.map((name) => {
    const ids = data[name].map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length, `${name} 存在重复 ID`);
    return [name, new Set(ids)];
  }));
  const ref = (collection, id, context) => assert.ok(index[collection].has(id), `${context} 引用了不存在的 ${collection}/${id}`);
  const refs = (collection, ids, context) => ids.forEach((id) => ref(collection, id, context));
  const statuses = ['source-present', 'partial', 'planned', 'proposed', 'unverified'];
  assert.equal(data.layers.length, 7, '需要完整七层');
  assert.equal(data.scenarios.length, 6, '需要六个运行/交付场景');
  for (const module of data.modules) {
    if (module.kind !== 'governance') ref('layers', module.layerId, module.id);
    assert.ok(statuses.includes(module.implementationStatus), `${module.id} 实现状态无效`);
    assert.ok(['verified', 'configured', 'unverified'].includes(module.validationStatus), `${module.id} 验证状态无效`);
    assert.ok(['confirmed', 'target', 'external-unverified'].includes(module.deploymentStatus), `${module.id} 部署状态无效`);
    for (const [field, collection] of Object.entries({ featureIds: 'features', contractIds: 'contracts', dataIds: 'dataAssets', deploymentIds: 'deployments', evidenceIds: 'evidence' })) {
      refs(collection, module[field], module.id);
    }
    assert.ok(module.featureIds.length && module.boundaries.length && module.ownerRole, `${module.id} 缺少功能/边界/责任`);
    if (['source-present', 'partial'].includes(module.implementationStatus)) {
      assert.ok(module.evidenceIds.some((id) => ['source', 'config'].includes(data.evidence.find((item) => item.id === id)?.kind)), `${module.id} 当前事实缺少源码或配置依据`);
    }
  }
  for (const feature of data.features) {
    ref('modules', feature.moduleId, feature.id);
    refs('evidence', feature.evidenceIds, feature.id);
    assert.ok(statuses.includes(feature.implementationStatus), `${feature.id} 状态无效`);
    assert.ok(data.modules.find((item) => item.id === feature.moduleId).featureIds.includes(feature.id), `${feature.id} 未被所属模块登记`);
  }
  const nodes = new Set([...index.modules, ...index.externalNodes]);
  for (const relation of data.relations) {
    assert.ok(nodes.has(relation.from) && nodes.has(relation.to), `${relation.id} 端点无效`);
    assert.ok(['code', 'call', 'event', 'artifact', 'governance'].includes(relation.kind), `${relation.id} 类型无效`);
    assert.ok(['current', 'target'].includes(relation.perspective), `${relation.id} 视角无效`);
    refs('scenarios', relation.scenarioIds, relation.id);
    refs('evidence', relation.evidenceIds, relation.id);
    if (relation.perspective === 'current') assert.ok(relation.evidenceIds.length, `${relation.id} 当前关系缺少证据`);
  }
  for (const asset of data.dataAssets) {
    assert.ok(nodes.has(asset.ownerModuleId), `${asset.id} 所有者无效`);
    asset.readers.concat(asset.writers).forEach((id) => assert.ok(nodes.has(id), `${asset.id} 读写方 ${id} 无效`));
  }
  for (const deployment of data.deployments) refs('modules', deployment.moduleIds, deployment.id);
  for (const item of [...data.validationItems, ...data.architectureGaps]) refs('evidence', item.evidenceIds, item.id);
  for (const item of data.evidence) {
    assert.equal(item.checkedAt, '2026-11-17', `${item.id} 核对日期无效`);
    assert.ok(!item.path.startsWith('/Users/'), `${item.id} 暴露本机路径`);
  }
  for (const module of data.modules) {
    assert.ok(data.relations.some((item) => item.from === module.id || item.to === module.id), `${module.id} 缺少上下游关系`);
  }
  const core = await readFile(new URL('../../../packages/core/src/index.ts', import.meta.url), 'utf8');
  const coreNames = [...core.matchAll(/export \* from '\.\/components\/([^']+)'/g)].map((match) => match[1]);
  const zdsFeatures = data.features.filter((item) => item.moduleId === 'experience-zds').map((item) => item.title).join(' ');
  for (const name of coreNames) assert.ok(zdsFeatures.includes(name), `ZDS 详情缺少实际组件 ${name}`);
  const overviewSource = await readFile(new URL('../src/architecture-overview-data.ts', import.meta.url), 'utf8');
  const overviewFile = join(directory, 'overview.mjs');
  await writeFile(overviewFile, ts.transpileModule(overviewSource, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText);
  const overview = await import(pathToFileURL(overviewFile));
  assert.equal(overview.capabilityBands.length, 7, '简明全景应有七条能力带');
  const groupIds = new Set(overview.capabilities.map((item) => item.id));
  assert.equal(groupIds.size, overview.capabilities.length, '能力组 ID 不应重复');
  for (const band of overview.capabilityBands) {
    assert.ok(band.groups.length >= 3 && band.groups.length <= (band.id === 'business' ? 6 : 4), `${band.id} 超出信息预算`);
    for (const group of band.groups) {
      assert.ok(group.tags.length <= 3, `${group.id} 标签过多`);
      assert.ok(['implemented', 'partial', 'planned'].includes(group.status), `${group.id} 状态无效`);
      for (const field of ['summary', 'includes', 'collaboration', 'statusNote']) {
        assert.ok(group[field] && group[field].length <= 120, `${group.id}/${field} 缺少说明或过长`);
      }
      assert.equal(overview.resolveGroupHash(`#group-${group.id}`), group.id);
    }
  }
  const overviewNodes = new Set([...groupIds, overview.externalSystem.id]);
  assert.ok(overview.keyRelations.length <= 8, '关键关系最多八条');
  assert.equal(new Set(overview.keyRelations.map((item) => item.id)).size, overview.keyRelations.length, '关系 ID 不应重复');
  assert.equal(overview.mainChains.length, 3, '应有三条主链路');
  const chainIds = new Set(overview.mainChains.map((item) => item.id));
  for (const relation of overview.keyRelations) {
    assert.ok(overviewNodes.has(relation.from) && overviewNodes.has(relation.to), `${relation.id} 端点无效`);
    relation.chains.forEach((id) => assert.ok(chainIds.has(id), `${relation.id} 链路无效`));
  }
  for (const chain of overview.mainChains) {
    chain.nodes.forEach((id) => assert.ok(overviewNodes.has(id), `${chain.id} 节点无效`));
  }
  for (const module of data.modules) {
    assert.ok(overview.resolveGroupHash(`#module-${module.id}`), `旧模块链接未映射：${module.id}`);
  }
  assert.equal(overview.resolveGroupHash('#module-unknown'), undefined);
  assert.equal(overview.resolveGroupHash('#group-unknown'), undefined);
  assert.ok(overview.capabilityBands.find((band) => band.id === 'zbc').groups.every((item) => item.status === 'planned'), 'ZBC 应明确为规划');
  assert.ok(overview.capabilities.find((item) => item.id === 'components').collaboration.includes('直接使用'), 'ZDS 应可直接使用');
  console.log(`简明全景检查通过：七条能力带、${groupIds.size} 个能力组、三条链路、${overview.keyRelations.length} 条关键关系；全部旧模块链接可映射。`);
  console.log(`架构数据检查通过：${data.modules.length} 模块、${data.features.length} 功能、${data.relations.length} 关系、六场景；实现/验证/部署状态独立。`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
